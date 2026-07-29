const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// JSON Schema for generated questions
const questionsSchema = {
  type: 'OBJECT',
  properties: {
    questions: {
      type: 'ARRAY',
      description: 'List of exactly 4 generated interview questions tailored to the candidate',
      items: {
        type: 'OBJECT',
        properties: {
          question: { type: 'STRING', description: 'The interview question text' },
          type: { 
            type: 'STRING', 
            enum: ['coding', 'conceptual', 'behavioral'],
            description: 'The type of question' 
          },
          codeTemplate: { 
            type: 'STRING', 
            description: 'For coding questions, a starter code function signature or template. Blank for others.' 
          },
        },
        required: ['question', 'type'],
      },
    },
  },
  required: ['questions'],
};

// JSON Schema for interview evaluation
const evaluationSchema = {
  type: 'OBJECT',
  properties: {
    score: { 
      type: 'INTEGER', 
      description: 'Overall score between 0 and 100 for the interview performance' 
    },
    recommendation: { 
      type: 'STRING', 
      enum: ['Strong Hire', 'Hire', 'Weak Hire', 'No Hire'],
      description: 'Overall hire recommendation' 
    },
    feedbackSummary: { 
      type: 'STRING', 
      description: 'Summary of the candidate performance, strengths and areas to work on' 
    },
    individualFeedback: {
      type: 'ARRAY',
      description: 'Feedback corresponding to each individual question',
      items: {
        type: 'OBJECT',
        properties: {
          questionIndex: { type: 'INTEGER', description: 'Index of the question (0-based)' },
          score: { type: 'INTEGER', description: 'Score between 0 and 100 for this specific answer' },
          feedback: { 
            type: 'STRING', 
            description: 'Detailed constructive feedback including what was good, what was missing, and code complexity/behavioral evaluation' 
          },
        },
        required: ['questionIndex', 'score', 'feedback'],
      },
    },
    roadmap: {
      type: 'ARRAY',
      description: 'Personalized action plan/roadmap for candidate improvement',
      items: {
        type: 'OBJECT',
        properties: {
          topic: { type: 'STRING', description: 'Topic or skill area the candidate needs to practice' },
          suggestion: { type: 'STRING', description: 'Specific steps, exercises or resources to improve in this area' },
        },
        required: ['topic', 'suggestion'],
      },
    },
  },
  required: ['score', 'recommendation', 'feedbackSummary', 'individualFeedback', 'roadmap'],
};

// JSON Schema for hint generation
const hintSchema = {
  type: 'OBJECT',
  properties: {
    hint: { 
      type: 'STRING', 
      description: 'A helpful, supportive hint pointing the candidate in the right direction without writing the code for them.' 
    },
  },
  required: ['hint'],
};

/**
 * Generates 4 custom questions (including coding questions) tailored to the JD, resume, difficulty, and focus area.
 */
async function generateInterviewQuestions({ jobTitle, jobDescription, resume, difficulty, focusArea }) {
  const prompt = `You are a professional technical recruiter and engineering interviewer.
Generate exactly 4 high-quality interview questions for a candidate interviewing for the role of: "${jobTitle}".

Context:
- Target Job Description: ${jobDescription}
- Candidate Resume: ${resume || 'No resume provided.'}
- Interview Difficulty Level: ${difficulty || 'Mid'}
- Focus Area: ${focusArea || 'Coding Heavy'}

Requirements:
1. Generate exactly 4 questions.
2. For "Coding Heavy", generate at least 2 coding questions (type: "coding") and 2 conceptual/behavioral questions.
3. For "System Design", generate at least 1 design question (type: "conceptual") and others.
4. For coding questions, provide a realistic Javascript coding starter template or signature inside 'codeTemplate' (e.g. "function solve(...) {\n  // Write code here\n}").
5. Customize questions based on candidate resume and job requirements (e.g. if they know Node.js and Mongoose, ask questions that require database or server understanding).
6. Ensure the questions match the chosen difficulty: ${difficulty}.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: questionsSchema,
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini API for question generation");
    }

    const data = JSON.parse(response.text);
    return data.questions || [];
  } catch (error) {
    console.error("Error in generateInterviewQuestions service:", error);
    throw error;
  }
}

/**
 * Evaluates the full interview answers and solutions.
 */
async function evaluateInterviewSession({ jobTitle, jobDescription, resume, questions }) {
  const formattedAnswers = questions.map((q, idx) => {
    return `--- QUESTION ${idx + 1} (${q.type}) ---
Question: ${q.question}
Candidate Text Answer: ${q.userAnswer || 'No text answer provided.'}
Candidate Code Answer: ${q.type === 'coding' ? (q.userCode || 'No code provided.') : 'N/A'}
Hints used: ${q.hintsUsed && q.hintsUsed.length > 0 ? q.hintsUsed.join('; ') : 'None'}
`;
  }).join('\n\n');

  const prompt = `You are a senior principal engineer conducting a post-interview debrief. 
Review the candidate's responses for the role: "${jobTitle}".

Context:
- Job Description: ${jobDescription}
- Candidate Resume: ${resume || 'No resume provided.'}

Interview Session details:
${formattedAnswers}

Evaluate the candidate's performance thoroughly. Provide:
1. An overall score (0-100).
2. A definitive hire recommendation.
3. A feedback summary listing key strengths and gaps.
4. Individual score and constructive feedback for each answer, analyzing the correctness, complexity (Time/Space for code), and code cleanliness. Take into account if they relied heavily on hints.
5. An actionable, customized learning roadmap containing specific topics and study actions.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: evaluationSchema,
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini API for interview evaluation");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error in evaluateInterviewSession service:", error);
    throw error;
  }
}

/**
 * Generates a helpful hint for a specific question given what the candidate has written so far.
 */
async function generateHint({ question, codeTemplate, userAnswerSoFar, userCodeSoFar }) {
  const prompt = `The candidate is in a live mock interview and is stuck on a question. 
Provide a single helpful, encouraging hint. 
Do NOT give the full code solution or answer. Instead, give a tip, outline an edge case to check, or explain a key concept that will guide them.

Question: ${question}
${codeTemplate ? `Starter Code Template: ${codeTemplate}` : ''}
Candidate's Current Text Answer: ${userAnswerSoFar || 'Empty'}
Candidate's Current Code Answer: ${userCodeSoFar || 'Empty'}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: hintSchema,
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini API for hint generation");
    }

    const data = JSON.parse(response.text);
    return data.hint || "Try breaking the problem down and writing pseudo-code first.";
  } catch (error) {
    console.error("Error in generateHint service:", error);
    return "Think about the input data structure and if there is a helper method you can use.";
  }
}

module.exports = {
  generateInterviewQuestions,
  evaluateInterviewSession,
  generateHint,
};
