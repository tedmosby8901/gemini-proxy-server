const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Important for allowing requests
const app = express();

app.use(cors()); // Allow requests from any origin
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE";

app.post('/ask', async (req, res) => {
  const question = req.body.question;
  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  const prompt = `You are a multiple-choice quiz expert. Given the following question, respond with ONLY the text of the correct answer. Do not add explanations. Question: ${question}`;

  try {
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    const answer = geminiResponse.data.candidates[0].content.parts[0].text;
    res.json({ answer: answer.trim() });
  } catch (error) {
    console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to get answer from Gemini." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));