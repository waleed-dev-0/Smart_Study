import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import DocumentModel from '../models/document';
import DocumentChunk from '../models/documentchunk';
import aiService from './aiService';
import mongoose from 'mongoose';

class UploadService {
  async processPDF(
    filePath: string,
    originalName: string,
    userId: string
  ): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      
      const parser = new PDFParse({ data: dataBuffer });
      const data = await parser.getText();
      const fullText = data.text;

      const document = await DocumentModel.create({
        user_id: new mongoose.Types.ObjectId(userId),
        title: originalName,
        file_path: filePath,
        file_size_bytes: fs.statSync(filePath).size,
        file_format: 'pdf',
        page_count: data.total,
        processing_status: 'processing'
      });

      const chunks = this.chunkText(fullText, 1000, 200);

      const chunkPromises = chunks.map(async (content, index) => {
        const embedding = await aiService.generateEmbedding(content);
        return DocumentChunk.create({
          document_id: document._id,
          chunk_index: index,
          chunk_content: content,
          token_count: content.split(/\s+/).length,
          embedding: embedding
        });
      });

      await Promise.all(chunkPromises);

      document.processing_status = 'completed';
      await document.save();

      return document._id.toString();
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new Error('Failed to process and index PDF');
    }
  }

  private chunkText(text: string, size: number, overlap: number): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + size, text.length);
      chunks.push(text.slice(start, end).trim());
      start += size - overlap;
    }

    return chunks.filter(c => c.length > 50);
  }
}

export default new UploadService();
