import textProcessor from "./aiService.js";

class QuestionService {
  async extractQuestionsFromText(text, count = 5, difficulty = 'medium', language = 'English') {
    const formatInstruction = `
You are an expert academic evaluator. Based ONLY on the following context, generate a multiple-choice quiz.

Requirements:
- Number of questions: ${count}
- Difficulty level: ${difficulty}

IMPORTANT RULES FOR LANGUAGE:
1. The "question_text", "options", and "correct_answer" MUST be written in the exact SAME language as the original context text. Do not translate the questions.
2. The "explanation" field MUST be written strictly in ${language}.

Return ONLY a valid JSON array, no markdown, no explanation outside JSON.
Use this exact format:
[
  {
    "question_text": "The question itself?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option B",
    "explanation": "Detailed explanation..."
  }
]
`;

    const rawResult = await textProcessor.askAI(formatInstruction, text, 'gemini');

    if (!rawResult) {
      throw new Error("Error: Processing engine failed to respond.");
    }

    try {
      const start = rawResult.indexOf("[");
      const end = rawResult.lastIndexOf("]") + 1;

      if (start === -1 || end === 0) {
        throw new Error("Invalid output format generated");
      }

      const cleanData = rawResult.slice(start, end);
      const generatedQuestions = JSON.parse(cleanData);
      
      if (!Array.isArray(generatedQuestions)) {
        throw new Error("AI did not return an array.");
      }
      
      return generatedQuestions;
    } catch (err) {
      console.error("[QuestionService] Error extracting questions:", err.message);
      throw new Error('Failed to parse AI response as JSON.');
    }
  }
}

export default new QuestionService();
