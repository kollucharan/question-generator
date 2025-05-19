
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

const allowedOrigins = [
  ' https://questiongenerato.netlify.app',
  'https://ai-agents.talview.com',
  

];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
// app.use(cors());

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
      .map(key => {
        const title = headingMap[key] || key;
        return `  "${title}": [\n    /* Generate ${count} ${round.toLowerCase().includes('assignment') ? 'assignment tasks' : 'interview questions'} for ${title.toLowerCase()} */\n  ]`;
      })
      .join(",\n");

   
    const systemPrompt = `
You are an expert Interviewing Manager drafting interview questions based on user inputs. Output ONLY valid JSON.

1️⃣ Validate the job role:
   • Must contain at least one letter [A–Z or a–z].
   • Must NOT be only digits, only punctuation, or empty.
   • If invalid, respond with EXACTLY: {"error": "Invalid input provided."}

2️⃣ Adjust difficulty per experience tier:
   • Junior/Fresher: basic foundational questions
   • Mid: scenario-based application
   • Senior: strategic, high-level problem solving

3️⃣ Generate for the "${round}" round for a "${role}" (${experience}):
   • If round contains "assignment": write ${count} practical tasks per area.
   • Otherwise: write ${count} concise interview questions per area.
   • Only include the specified assessment areas.
   • ${scenario ? `Integrate the following scenario into all questions/tasks: "${scenario}".` : ''}

Output STRICTLY valid JSON with these keys (no extra keys):
{
${sectionLines}
}
`.trim();

  
    const userInputs = `
Role: ${role}
Experience: ${experience}
Round: ${round}
Assessments: ${assessments.join(', ')}
Count: ${count}
${scenario ? `Scenario: ${scenario}` : ''}
`.trim();

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInputs }
    ];

    
    const aiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const raw = aiRes.data.choices[0].message.content.trim();
    let questionsObj;
    try {
      questionsObj = JSON.parse(raw);
    } catch (e) {
      return res.status(502).json({ error: 'AI response not valid JSON', raw });
    }

    if (questionsObj.error) {
      return res.status(400).json({ error: questionsObj.error });
    }

    res.json({ questions: questionsObj });
  } catch (err) {
    console.error('Error generating questions:', err);
    res.status(500).json({ error: 'Failed to generate questions.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
