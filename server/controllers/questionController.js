import Question from "../models/question.js";
import DocumentChunk from "../models/documentchunk.js";
import questionService from "../services/questionService.js";
import DocumentModel from "../models/document.js";
import fs from "fs";
import mongoose from "mongoose";

export const generateQuestions = async (req, res) => {
  try {
    const document_id = req.body.document_id || req.body.documentId;
    const count = req.body.count || req.body.numberOfQuestions || 10;
    const difficulty = req.body.difficulty || "medium";
    const language = req.body.language || "English";
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID is missing",
      });
    }

    if (!document_id || !mongoose.Types.ObjectId.isValid(document_id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or missing data: document_id must be a valid ObjectId",
      });
    }

    const chunks = await DocumentChunk.find({ document_id })
      .sort("chunk_index")
      .limit(15);
    console.info(
      `[Quiz Generator] Found ${chunks.length} chunks for document ${document_id}`,
    );

    let contentToProcess = "";

    if (!chunks || chunks.length === 0) {
      console.warn("[Quiz] No chunks found. Falling back to raw PDF parsing.");
      const document = await DocumentModel.findById(document_id);

      if (
        !document ||
        !document.file_path ||
        !fs.existsSync(document.file_path)
      ) {
        return res.status(404).json({
          success: false,
          message:
            "No text found for this document. Please re-upload the file.",
        });
      }

      try {
        const pdfParseModule = await import("pdf-parse");
        const pdfParse = pdfParseModule.default || pdfParseModule;
        const dataBuffer = await fs.promises.readFile(document.file_path);

        let data;
        try {
          data = await pdfParse(dataBuffer);
        } catch (innerErr) {
          if (pdfParse.PDFParse) {
            const parser = new pdfParse.PDFParse({ data: dataBuffer });
            data = await parser.getText();
          } else {
            throw innerErr;
          }
        }

        if (!data || !data.text || data.text.trim().length === 0) {
          return res
            .status(404)
            .json({
              success: false,
              message: "No extractable text found in the PDF.",
            });
        }

        let text = data.text.slice(0, 30000);
        contentToProcess = text.substring(0, text.lastIndexOf(".")) + ".";
      } catch (err) {
        console.error("[Quiz Generator] Fallback parsing failed:", err.message);
        return res
          .status(500)
          .json({
            success: false,
            message: "Failed to extract text from the document.",
          });
      }
    } else {
      contentToProcess = chunks.map((c) => c.chunk_content).join("\n\n");
    }

    const numQuestions = Math.min(Math.max(parseInt(count), 1), 25);

    // Pass language to the service
    const questions = await questionService.extractQuestionsFromText(
      contentToProcess,
      numQuestions,
      difficulty,
      language,
    );

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No questions could be generated from the provided text",
      });
    }

    const validQuestions = questions.filter(
      (q) =>
        typeof q.question_text === "string" &&
        q.question_text.trim().length > 0 &&
        Array.isArray(q.options) &&
        q.options.length >= 2 &&
        typeof q.correct_answer === "string" &&
        q.options.includes(q.correct_answer),
    );

    if (validQuestions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Generated questions did not meet quality standards.",
      });
    }

    const saved = await Question.insertMany(
      validQuestions.map((q) => ({
        document_id: document_id,
        user_id: userId,
        question_text: q.question_text,
        question_type: "multiple_choice",
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation || "",
      })),
    );

    // Only delete old questions AFTER successfully saving new ones
    await Question.deleteMany({
      document_id: document_id,
      user_id: userId,
      _id: { $nin: saved.map((q) => q._id) },
    });

    console.info(
      `[Quiz Generator] Successfully generated and saved ${saved.length} questions.`,
    );

    res.status(200).json({
      success: true,
      message: "Questions created",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID is missing",
      });
    }

    const questions = await Question.find({
      document_id: documentId,
      user_id: userId,
    });

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
