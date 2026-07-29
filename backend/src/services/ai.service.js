const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const interviewReportSchema = {
  type: 'OBJECT',
  properties: {
    matchScore: {
      type: 'INTEGER',
      description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description",
    },
    technicalQuestions: {
      type: 'ARRAY',
      description: 'Technical questions that can be asked in the interview along with their intention and how to answer them',
      items: {
        type: 'OBJECT',
        properties: {
          question: { type: 'STRING', description: 'The technical question' },
          intention: { type: 'STRING', description: 'The intention of interviewer behind asking this question' },
          answer: { type: 'STRING', description: 'How to answer this question, what points to cover, what approach to take' },
        },
        required: ['question', 'intention', 'answer'],
      },
    },
    behavioralQuestions: {
      type: 'ARRAY',
      description: 'Behavioral questions that can be asked in the interview along with their intention and how to answer them',
      items: {
        type: 'OBJECT',
        properties: {
          question: { type: 'STRING', description: 'The behavioral question' },
          intention: { type: 'STRING', description: 'The intention of interviewer behind asking this question' },
          answer: { type: 'STRING', description: 'How to answer this question, what points to cover, what approach to take' },
        },
        required: ['question', 'intention', 'answer'],
      },
    },
    skillGaps: {
      type: 'ARRAY',
      description: "List of skill gaps in the candidate's profile along with their severity",
      items: {
        type: 'OBJECT',
        properties: {
          skill: { type: 'STRING', description: 'The skill which the candidate is lacking' },
          severity: {
            type: 'STRING',
            enum: ['low', 'medium', 'high'],
            description: 'The severity of this skill gap',
          },
        },
        required: ['skill', 'severity'],
      },
    },
    preparationPlan: {
      type: 'ARRAY',
      description: 'A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively',
      items: {
        type: 'OBJECT',
        properties: {
          day: { type: 'INTEGER', description: 'The day number in the preparation plan, starting from 1' },
          focus: { type: 'STRING', description: 'The main focus of this day in the preparation plan' },
          tasks: {
            type: 'ARRAY',
            items: { type: 'STRING' },
            description: 'List of tasks to be done on this day',
          },
        },
        required: ['day', 'focus', 'tasks'],
      },
    },
    title: { type: 'STRING', description: 'The title of the job for which the interview report is generated' },
  },
  required: ['matchScore', 'technicalQuestions', 'behavioralQuestions', 'skillGaps', 'preparationPlan', 'title'],
};

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: interviewReportSchema,
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini API");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error details:", error);
    throw error;
  }
}

module.exports = generateInterviewReport;
