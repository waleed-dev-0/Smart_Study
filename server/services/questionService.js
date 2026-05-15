import DocumentChunk from "../models/documentchunk.js";
import Question from "../models/question.js";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

export class QuestionService {
  // Dependency Injection: injecting the AI processor
  constructor(aiProcessor) {
    this.aiProcessor = aiProcessor;
  }

  async extractQuestionsFromText(text, count = 5, difficulty = 'medium', language = 'English') {
    const prompt = `
Please read this text and give me a quiz.
I need ${count} questions. Make it ${difficulty} difficulty.

Important:
- Write the question, options, and correct answer in the same language as the text.
- Write the explanation in ${language}.

Give me a JSON array only, like this:
[
  {
    "question_text": "question here?",
    "options": ["A", "B", "C", "D"],
    "correct_answer": "B",
    "explanation": "because..."
  }
]
`;

    let responseText = await this.aiProcessor.askAI(prompt, text, 'gemini');

    if (!responseText) {
      throw new Error("No response received from AI service");
    }

    try {
      const startIndex = responseText.indexOf("[");
      const endIndex = responseText.lastIndexOf("]") + 1;
      
      let cutString = responseText.slice(startIndex, endIndex);
      let parsedArray = JSON.parse(cutString);
      
      if (!Array.isArray(parsedArray)) {
        throw new Error("AI output format is not a valid array");
      }
      
      return parsedArray;
    } catch (err) {
      throw new Error('Failed to parse AI JSON response');
    }
  }

  async generateAndSaveQuestions(documentId, userId, count, difficulty, language) {
    // 1. Fetch data safely
    const fileParts = await DocumentChunk.find({ document_id: documentId })
      .select('chunk_content')
      .lean();

    if (!fileParts || fileParts.length === 0) {
      const error = new Error("No text chunks found");
      error.status = 404;
      throw error;
    }

    // 2. Optimize memory using ENV variable
    let allText = "";
    let totalLength = 0;
    const MAX_LENGTH = parseInt(process.env.MAX_TEXT_LENGTH) || 50000;

    for (const part of fileParts) {
      if (totalLength + part.chunk_content.length > MAX_LENGTH) {
        allText += part.chunk_content.substring(0, MAX_LENGTH - totalLength);
        break;
      }
      allText += part.chunk_content + "\n\n";
      totalLength += part.chunk_content.length;
    }

    // 3. Process with AI
    logger.info(`Sending ${totalLength} chars to AI for document ${documentId}`);
    const generatedQuiz = await this.extractQuestionsFromText(allText, count, difficulty, language);

    if (!generatedQuiz || generatedQuiz.length === 0) {
      throw new Error("AI returned an empty question list");
    }

    // 4. Validate questions
    const goodQuestions = generatedQuiz.filter(item =>
      item.question_text &&
      item.options && item.options.length >= 2 &&
      item.options.includes(item.correct_answer)
    );

    if (goodQuestions.length === 0) {
      throw new Error("Generated questions did not pass validation");
    }

    const finalArray = goodQuestions.map(item => ({
      document_id: documentId,
      user_id: userId,
      question_text: item.question_text,
      question_type: "multiple_choice",
      options: item.options,
      correct_answer: item.correct_answer,
      explanation: item.explanation
    }));

    // 5. Safe Database Operations (Transactions)
    const session = await mongoose.startSession();
    let result = null;

    try {
      await session.withTransaction(async () => {
        await Question.deleteMany({ document_id: documentId, user_id: userId }, { session });
        result = await Question.insertMany(finalArray, { session });
      });
      logger.info(`Successfully saved ${result.length} questions for doc ${documentId}`);
    } catch (dbError) {
      if (dbError.message.includes('Transaction') || dbError.message.includes('replica set')) {
        logger.warn("Transactions not supported, falling back to standard operations");
        await Question.deleteMany({ document_id: documentId, user_id: userId });
        result = await Question.insertMany(finalArray);
      } else {
        throw dbError; 
      }
    } finally {
      session.endSession();
    }

    return result;
  }

  async getQuestionsByDocument(documentId, userId) {
    return await Question.find({ document_id: documentId, user_id: userId }).lean();
  }
}
