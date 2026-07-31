const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = 'llama-3.1-8b-instant';
const FALLBACK_MODEL = 'llama-3.3-70b-versatile';

/**
 * Helper: Call Groq chat completions with JSON mode enforced.
 */
async function callGroq(systemPrompt, userPrompt, modelName = MODEL) {
  try {
    const response = await groq.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from Groq API');
    }
    return JSON.parse(content);
  } catch (error) {
    // If blocked or permissions issue, try the fallback model
    if (modelName === MODEL && (error.status === 403 || error.message.includes('blocked'))) {
      console.warn(`⚠️ Groq model ${MODEL} is blocked. Falling back to ${FALLBACK_MODEL}...`);
      return callGroq(systemPrompt, userPrompt, FALLBACK_MODEL);
    }
    throw error;
  }
}

// ─────────────────────────────────────────────
// GENERATE QUIZ QUESTIONS
// ─────────────────────────────────────────────

/**
 * Generates multiple-choice quiz questions for the specified topic, difficulty, and count.
 * Returns: Array of { question, options, correctOptionIndex, explanation }
 */
async function generateQuizQuestions({ topic, difficulty, numQuestions }) {
  const count = parseInt(numQuestions) || 5;

  const systemPrompt = `You are a technical educator and expert quiz creator.
Generate multiple-choice questions that test genuine understanding, not just memorization.

You MUST respond with a valid JSON object in EXACTLY this format:
{
  "questions": [
    {
      "question": "string — a clear, concise question",
      "options": ["string — option A", "string — option B", "string — option C", "string — option D"],
      "correctOptionIndex": number — 0-based index of the correct option (0, 1, 2, or 3),
      "explanation": "string — a detailed educational explanation of WHY the correct option is right and why the others are wrong"
    }
  ]
}

Rules:
- Generate EXACTLY ${count} questions.
- Each question MUST have exactly 4 options in the "options" array.
- correctOptionIndex MUST be 0, 1, 2, or 3.
- Vary the position of the correct answer across questions (don't always put it at index 0 or 1).
- Match difficulty: Low = fundamental concepts, Mid = intermediate understanding, High = advanced/edge cases.
- Make all 4 options plausible — avoid obviously wrong distractors.`;

  const userPrompt = `Topic: ${topic}
Difficulty: ${difficulty || 'Mid'} (Low = Junior, Mid = Intermediate, High = Advanced/Staff Engineer)
Number of questions: ${count}`;

  try {
    const data = await callGroq(systemPrompt, userPrompt);
    return data.questions || [];
  } catch (error) {
    console.error('Error in generateQuizQuestions service:', error);
    throw error;
  }
}

module.exports = {
  generateQuizQuestions,
};
