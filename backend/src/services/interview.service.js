const Groq = require('groq-sdk');

let groqClient;
function getGroqClient() {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('The GROQ_API_KEY environment variable is missing.');
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

const MODEL_70B = 'llama-3.3-70b-versatile';
const MODEL_8B = 'llama-3.1-8b-instant';

/**
 * Helper: Call Groq chat completions with JSON mode enforced.
 */
async function callGroq(systemPrompt, userPrompt, model = MODEL_70B) {
  try {
    const response = await getGroqClient().chat.completions.create({
      model: model,
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
  } catch (error) {
    // If the 8B model is blocked, immediately fall back to the 70B model
    if (model === MODEL_8B && (error.status === 403 || error.message.includes('blocked'))) {
      console.warn(`⚠️ Groq model ${MODEL_8B} is blocked. Falling back to ${MODEL_70B} for hint generation...`);
      return callGroq(systemPrompt, userPrompt, MODEL_70B);
    }
    throw error;
  }
}

// ─────────────────────────────────────────────
// GENERATE INTERVIEW QUESTIONS
// ─────────────────────────────────────────────

/**
 * Generates 4 custom questions tailored to the JD, resume, difficulty, and focus area.
 * Returns: Array of { question, type, codeTemplate }
 */
async function generateInterviewQuestions({ jobTitle, jobDescription, resume, difficulty, focusArea }) {
  const systemPrompt = `You are a professional technical recruiter and senior engineering interviewer.
Generate exactly 4 high-quality interview questions for the given role.

You MUST respond with a valid JSON object in EXACTLY this format:
{
  "questions": [
    {
      "question": "string — the interview question text",
      "type": "coding" | "conceptual" | "behavioral",
      "codeTemplate": "string — for coding questions, a JavaScript starter template like 'function solve(...) {\\n  // Write your code here\\n}'. Leave empty string for non-coding questions."
    }
  ]
}

Rules:
- Generate EXACTLY 4 questions total.
- For "Coding Heavy" focus: at least 2 must be type "coding", rest "conceptual" or "behavioral".
- For "System Design" focus: at least 1 must be type "conceptual" (system design), rest mixed.
- For "Behavioral" focus: at least 2 must be type "behavioral", rest mixed.
- For coding questions, always provide a realistic JavaScript function signature as codeTemplate.
- Tailor questions specifically to the candidate's resume skills and the job requirements.
- Match difficulty level: Junior = simpler concepts, Mid = standard, Senior = advanced/architecture.`;

  const userPrompt = `Job Title: ${jobTitle}
Job Description: ${jobDescription}
Candidate Resume: ${resume || 'No resume provided.'}
Difficulty Level: ${difficulty || 'Mid'}
Focus Area: ${focusArea || 'Coding Heavy'}`;

  try {
    const data = await callGroq(systemPrompt, userPrompt);
    return data.questions || [];
  } catch (error) {
    console.error('Error in generateInterviewQuestions service:', error);
    throw error;
  }
}

// ─────────────────────────────────────────────
// EVALUATE INTERVIEW SESSION
// ─────────────────────────────────────────────

/**
 * Evaluates all answers from a completed interview session.
 * Returns: { score, recommendation, feedbackSummary, individualFeedback, roadmap }
 */
async function evaluateInterviewSession({ jobTitle, jobDescription, resume, questions }) {
  const formattedAnswers = questions.map((q, idx) => {
    return `--- QUESTION ${idx + 1} (${q.type}) ---
Question: ${q.question}
Candidate Text Answer: ${q.userAnswer || 'No text answer provided.'}
Candidate Code Answer: ${q.type === 'coding' ? (q.userCode || 'No code provided.') : 'N/A'}
Hints used: ${q.hintsUsed && q.hintsUsed.length > 0 ? q.hintsUsed.join('; ') : 'None'}`;
  }).join('\n\n');

  const systemPrompt = `You are a senior principal engineer conducting a post-interview debrief.
Evaluate the candidate's performance fairly and thoroughly.

You MUST respond with a valid JSON object in EXACTLY this format:
{
  "score": number — overall score integer 0–100,
  "recommendation": "Strong Hire" | "Hire" | "Weak Hire" | "No Hire",
  "feedbackSummary": "string — 2-3 sentences summarizing key strengths and main areas for improvement",
  "individualFeedback": [
    {
      "questionIndex": number — 0-based index matching the question order,
      "score": number — integer 0–100 for this specific answer,
      "feedback": "string — detailed constructive feedback: what was correct, what was missing, code complexity/cleanliness for coding questions, hint penalty if applicable"
    }
  ],
  "roadmap": [
    {
      "topic": "string — specific topic or skill to improve",
      "suggestion": "string — concrete action steps, resources, or exercises to improve in this area"
    }
  ]
}

Be honest but constructive. Factor in hint usage (heavy hint reliance should lower score). Provide actionable roadmap items (3-5 items).`;

  const userPrompt = `Role: ${jobTitle}
Job Description: ${jobDescription}
Candidate Resume: ${resume || 'No resume provided.'}

Interview Answers:
${formattedAnswers}`;

  try {
    return await callGroq(systemPrompt, userPrompt);
  } catch (error) {
    console.error('Error in evaluateInterviewSession service:', error);
    throw error;
  }
}

// ─────────────────────────────────────────────
// GENERATE HINT
// ─────────────────────────────────────────────

/**
 * Generates a helpful hint for the current question without giving away the answer.
 * Returns: string (the hint text)
 */
async function generateHint({ question, codeTemplate, userAnswerSoFar, userCodeSoFar }) {
  const systemPrompt = `You are a supportive mock interview coach helping a candidate who is stuck.
Provide ONE helpful, encouraging hint that nudges them in the right direction WITHOUT writing the code or giving the full answer.

You MUST respond with a valid JSON object in EXACTLY this format:
{
  "hint": "string — a single, concise, helpful hint (1-3 sentences). Point to a concept, edge case, or approach — never the full solution."
}`;

  const userPrompt = `Interview Question: ${question}
${codeTemplate ? `Starter Code Template:\n${codeTemplate}` : ''}

Candidate's Current Text Answer: ${userAnswerSoFar || 'Empty — they haven\'t started.'}
Candidate's Current Code: ${userCodeSoFar || 'Empty — no code written yet.'}`;

  try {
    const data = await callGroq(systemPrompt, userPrompt, MODEL_8B);
    return data.hint || 'Try breaking the problem into smaller steps and think about the input/output first.';
  } catch (error) {
    console.error('Error in generateHint service:', error);
    return 'Think about what data structure would make this problem easier to solve.';
  }
}

module.exports = {
  generateInterviewQuestions,
  evaluateInterviewSession,
  generateHint,
};
