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

  const {
    patient_name,
    gender,
    age,
    weight,
    height,
    blood_pressure,
    oxygen_saturation,
    pregnancy_status,
    temperature,
    heart_rate,
    symptoms
  } = data;


  const prompt = `
You are a clinical decision support assistant.

PATIENT INFORMATION:

- Patient Name: ${patient_name}
- Gender: ${gender}
- Age: ${age} years
- Weight: ${weight} kg
- Height: ${height} cm
- Blood Pressure: ${blood_pressure} mmHg
- Oxygen Saturation: ${oxygen_saturation} %
- Pregnancy Status: ${pregnancy_status}
- Temperature: ${temperature} °C
- Heart Rate: ${heart_rate} bpm
- Symptoms: ${Array.isArray(symptoms) ? symptoms.join(", ") : symptoms}


TASK:
- Suggest possible medical conditions (NOT final diagnosis)
- Assign risk level: Low, Medium, High
- Provide clinical recommendations
- Provide a short patient summary


IMPORTANT RULES:
- Be medically cautious
- Do NOT provide a final diagnosis
- Consider all available patient information
- Return ONLY valid JSON
- NO markdown
- NO backticks
- NO explanations outside JSON


OUTPUT FORMAT:

{
  "patient_name": "",
  "possible_conditions": [
    "condition 1",
    "condition 2"
  ],
  "risk": "Low | Medium | High",
  "recommendation": "clinical advice",
  "summary": "short patient summary"
}

`;


  try {

    const dataRes = await callGemini(prompt);

    let text = dataRes.candidates[0].content.parts[0].text;


    // 🧹 CLEAN GEMINI RESPONSE
    text = text.replace(/```json|```/g, "").trim();


    let parsed;


    try {

      parsed = JSON.parse(text);

    } catch (err) {

      console.log("JSON parse failed, using fallback");

      parsed = {
        patient_name: patient_name,
        possible_conditions: [
          "Unstructured AI response"
        ],
        risk: "Unknown",
        recommendation: text,
        summary: text
      };

    }


    return parsed;


  } catch (error) {

    console.error(
      "Gemini API Error:",
      error.response?.data || error.message
    );


    // 🛡️ SAFE FALLBACK
    return {

      patient_name: patient_name,

      possible_conditions: [
        "Service unavailable"
      ],

      risk: "Unknown",

      recommendation:
        "Please try again or use clinical assessment",

      summary:
        "AI system temporarily unavailable"

    };

  }

}


module.exports = { analyzePatient };
