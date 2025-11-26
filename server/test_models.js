const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

async function testGeminiPro() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        console.log("Attempting to generate content with gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello, are you working?");
        console.log("Success with gemini-pro:", result.response.text());
    } catch (error) {
        console.error("Error with gemini-pro:");
        console.error(error);
    }
}

testGeminiPro();
