import mongoose, { Schema } from "mongoose";

const DocumentChunkSchema = new Schema(
    {
        document_id: {
            type: Schema.Types.ObjectId,
            ref: "Document",
            required: true,
            index: true,
        },
        chunk_index: {
            type: Number,
            required: true,
        },
        chunk_content: {
            type: String,
            required: true,
        },
        token_count: {
            type: Number,
            default: 0,
        },
        embedding: {
            type: [Number],
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

const DocumentChunk = mongoose.model("DocumentChunk", DocumentChunkSchema);

export default DocumentChunk;
