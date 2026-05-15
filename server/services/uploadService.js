import fs from "fs";
import DocumentModel from "../models/document.js";
import DocumentChunk from "../models/documentchunk.js";
import aiService from "./aiService.js";
import mongoose from "mongoose";

class UploadService {
  async getEmbeddingWithRetry(content) {
    for (let i = 0; i < 3; i++) {
      try {
        return await aiService.generateEmbedding(content);
      } catch (err) {
        if (i === 2) throw err;
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  async processPDF(filePath, originalName, userId) {
    try {
      const dataBuffer = await fs.promises.readFile(filePath);

      const pdfParseModule = await import("pdf-parse");
      const pdfParse = pdfParseModule.default || pdfParseModule;

      const parser = new pdfParse.PDFParse({ data: dataBuffer });
      const data = await parser.getText();
      const fullText = data.text;

      if (!fullText || fullText.trim().length === 0) {
        throw new Error(
          "No text could be extracted from the PDF. It may be scanned/image-based.",
        );
      }
      const stats = await fs.promises.stat(filePath);

        const existingDocument = await DocumentModel.findOne({
            title: originalName,
            user_id: userId
        });

        if (existingDocument) {
            return res.status(409).json({
                success: false,
                message: "File already exists"
            });
        }

      const document = await DocumentModel.create({
        user_id: new mongoose.Types.ObjectId(userId),
        title: originalName,
        file_path: filePath,
        file_size_bytes: stats.size,
        file_format: "pdf",
        page_count:data.numpages || 0,
        processing_status: "processing",
        extracted_text: fullText
      });

      const chunks = this.chunkText(fullText, 1000, 200);
      console.log(
        `[Upload] Processing ${chunks.length} chunks for "${originalName}"...`,
      );

      const BATCH_SIZE = 10;
      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (content, batchIdx) => {
            const globalIndex = i + batchIdx;
            try {
              const embedding = await this.getEmbeddingWithRetry(content);
              await DocumentChunk.create({
                document_id: document._id,
                chunk_index: globalIndex,
                chunk_content: content,
                token_count: content.split(/\s+/).length,
                embedding,
              });
            } catch (err) {
              console.error(
                `[Upload] Failed to embed chunk ${globalIndex}:`,
                err.message,
              );
              return;
            }
          }),
        );
        console.log(
          `[Upload] Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)} done`,
        );
      }

      document.processing_status = "completed";
      await document.save();

      console.log(
        `[Upload] Document "${originalName}" indexed successfully (${chunks.length} chunks).`,
      );
      return document._id.toString();
    } catch (error) {
      console.error("[Upload] Error processing PDF:", error.message);
      throw new Error("Failed to process and index PDF: " + error.message);
    }
  }

  chunkText(text, size, overlap) {
    const paragraphs = text.split("\n");
    const chunks = [];
    let current = "";

    for (const p of paragraphs) {
      if ((current + p).length > size) {
        chunks.push(current.trim());
        current = current.slice(-overlap) + " " + p;
      } else {
        current += " " + p;
      }
    }

    if (current) chunks.push(current.trim());

    return chunks.filter((c) => c.length > 50);
  }
}

export default new UploadService();
