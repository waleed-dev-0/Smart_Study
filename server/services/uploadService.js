import fs from "fs";
import { PDFParse } from "pdf-parse";
import DocumentModel from "../models/document.js";
import DocumentChunk from "../models/documentchunk.js";
import aiService from "./aiService.js";
import mongoose from "mongoose";

class UploadService {
  async processPDF(filePath, originalName, userId) {
    try {
      const dataBuffer = await fs.promises.readFile(filePath);

      let result;
      try {
        const parser = new PDFParse({ data: dataBuffer });
        result = await parser.getText();
      } catch {
        throw new Error("Failed to extract text from PDF.");
      }

      const fullText = result?.text?.trim();
      if (!fullText) {
        throw new Error(
          "No text could be extracted from the PDF. It may be scanned/image-based.",
        );
      }

      const stats = await fs.promises.stat(filePath);

      const document = await DocumentModel.create({
        user_id: new mongoose.Types.ObjectId(userId),
        title: originalName,
        file_path: filePath,
        file_size_bytes: stats.size,
        file_format: "pdf",
        page_count: result.total || 0,
        processing_status: "processing",
        extracted_text: fullText,
      });

      const chunks = this.chunkText(fullText, 1000, 200);
      console.log(
        `[Upload] Processing ${chunks.length} chunks for "${originalName}"...`,
      );

      const BATCH_SIZE = 10;
      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);

        const results = await Promise.allSettled(
          batch.map(async (content, batchIdx) => {
            const globalIndex = i + batchIdx;
            let embedding = [];
            try {
              embedding = await this._embedWithRetry(content);
            } catch (e) {
              console.error(`[Upload] Embedding failed for chunk ${globalIndex}:`, e.message);
            }
            return {
              document_id: document._id,
              chunk_index: globalIndex,
              chunk_content: content,
              token_count: content.split(/\s+/).length,
              embedding,
            };
          }),
        );

        const valid = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
        if (valid.length) await DocumentChunk.insertMany(valid);

        console.log(
          `[Upload] Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)} done`,
        );
      }

      document.processing_status = "completed";
      await document.save();

      console.log(
        `[Upload] "${originalName}" indexed successfully (${chunks.length} chunks).`,
      );
      return document._id.toString();
    } catch (error) {
      console.error("[Upload] Error processing PDF:", error.message);
      throw new Error("Failed to process and index PDF: " + error.message);
    }
  }

  async _embedWithRetry(content) {
    for (let i = 0; i < 3; i++) {
      try {
        return await aiService.generateEmbedding(content);
      } catch (err) {
        if (i === 2) throw err;
        await new Promise((r) => setTimeout(r, 1000));
      }
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
