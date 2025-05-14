
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

const headingMap = {
  communication: "Communication Skills",
  problemSolving: "Problem Solving",
  domainKnowledge: "Domain Knowledge",
  toolsProcesses: "Tools & Processes",
  cultureFit: "Culture Fit",
  research: "Research & Preparation",
  writing: "Writing or Presentation Skills",
  objectionHandling: "Objection Handling / Sales Pitching",
};

app.post("/generate", async (req, res) => {
  try {
    const { role, experience, round, assessments, scenario, count } = req.body;

   
    const sectionLines = assessments
      .map((key) => {
        const title = headingMap[key] || key;
        return `"${title}": [
  /* 2–${count} questions to assess ${title.toLowerCase()} */
]`;
      })
      .join(",\n");

    // Optionally add a scenario section
    const scenarioLine = scenario
      ? `,\n"Scenario": [
  "${scenario}"
]`
      : "";

    // Final prompt: ask _only_ for valid JSON
    const prompt = `
You are an expert interviewer generating structured interview questions.
Generate questions for the role of **${role}** with **${experience}** experience in the **${round}** round.

Output STRICTLY valid JSON with exactly these keys (no markdown, no extra keys):
{
${sectionLines}${scenarioLine}
}
`.trim();

    // Send to OpenAI
    const messages = [
      { role: "system", content: "You output ONLY valid JSON." },
      { role: "user",   content: prompt },
    ];
    const aiRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages,
        max_tokens: 1500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const raw = aiRes.data.choices[0].message.content.trim();
    let questionsObj;

    try {
      questionsObj = JSON.parse(raw);
    } catch (parseErr) {
      console.error("Invalid JSON from AI:", raw);
      return res.status(502).json({ error: "AI response not valid JSON", raw });
    }

    // Success! return structured questions
    res.json({ questions: questionsObj });
  } catch (err) {
    console.error("Error generating questions:", err);
    res.status(500).json({ error: "Failed to generate questions." });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
