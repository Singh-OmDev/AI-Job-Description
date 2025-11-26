const express = require('express');
console.log("!!! SERVER RELOADED - SWITCHED TO GROQ API !!!");
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for large text/PDFs

// Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Secret key for JWT (in production, use .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const USERS_FILE = path.join(__dirname, 'users.json');

// Helper to read/write users
const getUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
};

const saveUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Routes

// Health check
app.get('/', (req, res) => {
    res.send('AI ATS Resume Tailor API is running (Groq Powered)');
});

// PDF Parse Endpoint
app.post('/api/parse-pdf', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const parser = new PDFParse({ data: req.file.buffer });
        const data = await parser.getText();
        await parser.destroy();

        res.json({ text: data.text });
    } catch (error) {
        console.error('PDF Parse Error:', error);
        res.status(500).json({ error: 'Failed to parse PDF' });
    }
});

// Auth Routes
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const users = getUsers();
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { id: Date.now().toString(), name, email, password: hashedPassword };

        users.push(newUser);
        saveUsers(users);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Analyze Endpoint (Protected)
app.post('/api/analyze', authenticateToken, async (req, res) => {
    try {
        const { jobDescription, resumeText } = req.body;

        if (!jobDescription || !resumeText) {
            return res.status(400).json({ error: 'Both Job Description and Resume text are required' });
        }

        const prompt = `
You are an ATS (Applicant Tracking System) and expert resume coach. You will receive:

1) A Job Description (JD)
2) A Candidate Resume

Your tasks:
- Extract a list of important skills, tools, and keywords from the JD.
- Extract current skills, experience, and keywords from the Resume.
- Compare both and find:
  - Matched skills / keywords
  - Missing but important skills / keywords
- Then generate:
  (a) An optimized professional summary for the resume, tailored to the JD (3–5 lines). Write in a natural, human tone. Avoid robotic phrasing, excessive parallelism, or "AI-sounding" patterns. Make it sound like a real person wrote it.
  (b) Rewritten experience bullet points that better match the JD while staying honest. Vary the sentence structure to sound authentic and not like AI-generated text. Do not make them all sound exactly the same structure.
  (c) A list of missing or weakly covered keywords that the candidate should add.
  (d) An ATS score from 0 to 100, based on how well the resume matches the JD.
  (e) 3–5 improvement tips to increase the ATS score.

Return your response STRICTLY in the following JSON format (no markdown, no backticks):

{
  "matchedSkills": ["skill1", "skill2", ...],
  "missingSkills": ["skillA", "skillB", ...],
  "extraKeywords": ["keyword1", "keyword2", ...],
  "optimizedSummary": "text...",
  "optimizedExperienceBullets": ["bullet1", "bullet2", ...],
  "atsScore": 87,
  "improvementTips": ["tip1", "tip2", ...]
}

Job Description:
${jobDescription}

Resume:
${resumeText}
    `;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI assistant that analyzes resumes against job descriptions and outputs strict JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0]?.message?.content || "{}";

        // Clean up the response to ensure it's valid JSON (just in case)
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonResponse = JSON.parse(jsonString);

        res.json(jsonResponse);

    } catch (error) {
        console.error('Analysis Error:', error);
        res.status(500).json({ error: 'Failed to analyze resume' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
