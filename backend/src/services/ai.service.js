const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = 'llama-3.3-70b-versatile';

/**
 * Helper: Call Groq chat completions with JSON mode enforced.
 * Returns the parsed JSON object from the model response.
 */
async function callGroq(systemPrompt, userPrompt) {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content received from Groq API');
  }
  return JSON.parse(content);
}

// ─────────────────────────────────────────────
// GENERATE INTERVIEW REPORT (Resume Analysis)
// ─────────────────────────────────────────────

/**
 * Generates a full interview preparation report from a resume + job description.
 * Returns: { matchScore, technicalQuestions, behavioralQuestions, skillGaps, preparationPlan, title }
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const systemPrompt = `You are an expert technical recruiter and career coach. 
Analyze the candidate's profile against the job description and generate a structured interview preparation report.

You MUST respond with a valid JSON object in EXACTLY this format:
{
  "title": "string — the job title extracted from the job description",
  "matchScore": number — integer 0–100 indicating how well the resume matches the JD,
  "technicalQuestions": [
    {
      "question": "string — a technical interview question",
      "intention": "string — what the interviewer wants to assess",
      "answer": "string — how to answer it, what points to cover"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "string — a behavioral interview question",
      "intention": "string — what the interviewer wants to assess",
      "answer": "string — how to answer it using STAR method or relevant approach"
    }
  ],
  "skillGaps": [
    {
      "skill": "string — skill the candidate lacks",
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number — day number starting from 1,
      "focus": "string — main focus for this day",
      "tasks": ["string — task 1", "string — task 2"]
    }
  ]
}

Generate 5 technical questions, 3 behavioral questions, identify all skill gaps, and create a 7-day preparation plan.`;

  const userPrompt = `Job Description:
${jobDescription}

Candidate Resume:
${resume || 'No resume provided.'}

Self Description:
${selfDescription || 'Not provided.'}`;

  try {
    return await callGroq(systemPrompt, userPrompt);
  } catch (error) {
    console.error('Groq API Error in generateInterviewReport:', error);
    throw error;
  }
}

module.exports = generateInterviewReport;
