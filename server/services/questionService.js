import textProcessor from "./aiService.js";

class QuestionService {
  async extractQuestionsFromText(text, count = 5) {
    const formatInstruction = `
Create ${count} multiple choice questions from the following text.

Make questions clear and suitable for students.
Avoid very easy or very hard questions.

Return ONLY a valid JSON array, no markdown, no explanation outside JSON.
Use this exact format:
[
  {
    "question_text": "What is ...?",
    "options": ["option 1", "option 2", "option 3", "option 4"],
    "correct_answer": "option 1",
    "explanation": "short explanation"
  }
]
`;

  
    const rawResult = await textProcessor.askAI(formatInstruction, text);

    if (!rawResult) {
      console.log("Error: Processing engine failed to respond.");
      return [];
    }

    try {
      const start = rawResult.indexOf("[");
      const end = rawResult.lastIndexOf("]") + 1;

      if (start === -1 || end === 0) {
        throw new Error("Invalid output format generated");
      }

      const cleanData = rawResult.slice(start, end);
      return JSON.parse(cleanData);
    } catch (err) {
      console.log("Error extracting questions:", err.message);
      return [];
    }
  }
}

export default new QuestionService();