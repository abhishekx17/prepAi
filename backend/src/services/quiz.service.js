const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// JSON Schema for Quiz Questions
const quizQuestionsSchema = {
  type: 'OBJECT',
  properties: {
    questions: {
      type: 'ARRAY',
      description: 'List of generated multiple choice quiz questions',
      items: {
        type: 'OBJECT',
        properties: {
          question: { type: 'STRING', description: 'The objective question text' },
          options: {
            type: 'ARRAY',
            items: { type: 'STRING' },
            description: 'Exactly 4 options representing possible answers',
          },
          correctOptionIndex: {
            type: 'INTEGER',
            description: 'The 0-based index (0 to 3) of the correct option',
          },
          explanation: {
            type: 'STRING',
            description: 'Detailed explanation of why this option is correct',
          },
        },
        required: ['question', 'options', 'correctOptionIndex', 'explanation'],
      },
    },
  },
  required: ['questions'],
};

/**
 * Generates custom multiple-choice questions for the specified topic, difficulty, and quantity.
 */
async function generateQuizQuestions({ topic, difficulty, numQuestions }) {
  const count = parseInt(numQuestions) || 5;

  const prompt = `You are a technical educator and test creator. 
Generate exactly ${count} multiple choice quiz questions on the technical topic: "${topic}".

Context & Requirements:
1. Target Topic: "${topic}"
2. Difficulty Level: ${difficulty || 'Mid'} (Low corresponds to Junior, Mid to Intermediate, High to Advanced/Staff)
3. Quantity: Exactly ${count} questions.
4. Each question must have exactly 4 clear options.
5. Provide a detailed educational explanation why the correct option is the right answer.
6. The correctOptionIndex must be a valid 0-based index (0, 1, 2, or 3).
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: quizQuestionsSchema,
      },
    });

    if (!response.text) {
      throw new Error("No response received from Gemini API for quiz generation");
    }

    const data = JSON.parse(response.text);
    return data.questions || [];
  } catch (error) {
    console.error("Error in generateQuizQuestions service:", error);
    throw error;
  }
}

module.exports = {
  generateQuizQuestions,
};
