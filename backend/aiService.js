const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 🔁 Retry helper (handles 503 overloads)
async function callGemini(prompt, retries = 3) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(url, {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      });

      return response.data;

    } catch (error) {
      const status = error.response?.status;

      if (status === 503) {
        console.log(`Gemini busy... retry ${i + 1}/${retries}`);
        await new Promise(res => setTimeout(res, 2000));
        continue;
      }

      throw error;
    }
  }

  throw new Error("Gemini unavailable after retries");
}

async function analyzePatient(data) {
  const { temperature, heart_rate, symptoms, age } = data;

  const prompt = `
You are a clinical decision support assistant.

Patient Data:
- Age: ${age}
- Temperature: ${temperature} °C
- Heart Rate: ${heart_rate} bpm
- Symptoms: ${symptoms.join(", ")}

TASK:
- Suggest possible conditions (NOT final diagnosis)
- Assign risk level: Low, Medium, High
- Give clear recommendation
- Provide short clinical summary

IMPORTANT RULES:
- Be medically cautious
- Do NOT give a final diagnosis
- Return ONLY valid JSON
- NO markdown, NO backticks, NO explanations

OUTPUT FORMAT:
{
  "diagnosis": "possible conditions only",
  "risk": "Low | Medium | High",
  "recommendation": "clear clinical advice",
  "summary": "short patient summary"
}
`;

  try {
    const dataRes = await callGemini(prompt);

    let text = dataRes.candidates[0].content.parts[0].text;

    // 🧹 CLEAN OUTPUT (VERY IMPORTANT)
    text = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.log("JSON parse failed, using fallback");

      parsed = {
        diagnosis: "Unstructured AI response",
        risk: "Unknown",
        recommendation: text,
        summary: text
      };
    }

    return parsed;

  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);

    // 🛡️ SAFE FALLBACK (NEVER FAIL SYSTEM)
    return {
      diagnosis: "Service unavailable",
      risk: "Unknown",
      recommendation: "Please try again or use clinical assessment",
      summary: "AI system temporarily unavailable"
    };
  }
}

module.exports = { analyzePatient };