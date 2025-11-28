# AI ATS Resume Tailor 🚀


 demo link https://ai-job-description-gamma.vercel.app/


 <img width="1898" height="881" alt="image" src="https://github.com/user-attachments/assets/ec6f806e-aa1d-410e-9dca-071564933ee2" />


A powerful web application that helps job seekers tailor their resumes to specific job descriptions using advanced AI. It analyzes your resume against a JD, provides an ATS score, and generates optimized content to help you get hired.

## ✨ Key Features
- **🤖 AI-Powered Analysis**: Uses **Llama 3 (via Groq)** for deep semantic analysis of resumes and JDs.
- **📊 ATS Scoring**: Get a match score (0-100) to see where you stand.
- **🔍 Smart Insights**: Identifies **Matched Skills**, **Missing Keywords**, and provides actionable **Improvement Tips**.
- **✍️ Content Optimization**: Automatically generates a tailored **Professional Summary** and **Experience Bullet Points**.
- **🔐 User Authentication**: Secure Login and Signup functionality to save your progress.
- **🌓 Dark Mode**: A beautiful, responsive UI with seamless light and dark theme switching.
- **📄 PDF Support**: Drag-and-drop support for PDF resumes and job descriptions.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, React Router
- **Backend**: Node.js, Express, Multer
- **AI Engine**: Groq SDK (Llama 3.3 70B)
- **Security**: BCrypt (Password Hashing), JWT (Authentication)
- **Processing**: `pdf-parse`

## 🚀 Setup & Run

1. **Backend**
   ```bash
   cd server
   npm install
   # Create .env file with GROQ_API_KEY and JWT_SECRET
   node index.js
   ```

2. **Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. Open your browser at `http://localhost:5173`.

## 🔑 Environment Variables
Create a `.env` file in the `server` directory:
```env
GROQ_API_KEY=your_groq_api_key_here

PORT=5000
```
