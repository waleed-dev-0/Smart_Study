# Smart Study

<div align="center">
  <h3>AI-powered study assistant for academic documents</h3>
  <p>
    Upload study materials, generate summaries, ask document-based questions,
    create quizzes, and track progress from one clean learning workspace.
  </p>

  <p>
    <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
    <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
    <img alt="AI" src="https://img.shields.io/badge/AI-Integrated-7C3AED?style=for-the-badge" />
  </p>
</div>

---

## Overview

Smart Study is a full-stack educational platform built to help students work with long academic materials more efficiently. Instead of manually reading through every PDF from start to finish, users can upload their study documents and turn them into structured summaries, interactive quizzes, and focused AI conversations.

The project combines document processing, AI-powered analysis, authentication, dashboards, and a responsive user interface into one practical study workflow.

## Main Features

### Document Upload

- Upload academic PDF files.
- Extract and store document content.
- Keep documents organized inside a personal library.
- Rename or delete uploaded documents.

### AI Summaries

- Generate summaries from uploaded documents.
- Choose between brief, detailed, and technical summary styles.
- Render generated content with clean Markdown formatting.

### Document-Based AI Chat

- Ask questions about a selected PDF.
- Receive answers based on the uploaded material.
- Stream AI responses for a smoother chat experience.
- Keep chat history connected to each document.

### Free AI Chat

- Start a general AI chat without selecting a document.
- Save local free-chat sessions.
- Switch between document analysis and open conversation.

### Quiz Generation

- Generate multiple-choice questions from document content.
- Answer questions inside an interactive quiz interface.
- View explanations after submitting answers.
- Store quiz attempts and review progress later.

### User Experience

- Authentication and protected routes.
- Profile and settings pages.
- Arabic and English interface support.
- Dark mode support.
- Responsive layouts for desktop and mobile.

### Admin Reports

- View total users.
- Track archived document sources.
- Monitor digital storage usage.
- Review user activity.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React icons
- Axios
- React Markdown

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- Multer file uploads
- PDF parsing
- Server-Sent Events for streamed chat responses

### AI Integration

- Google Gemini API
- Gemini embeddings
- Ollama provider support
- AI-generated summaries
- AI-powered quiz generation
- Context-aware document chat

## Project Structure

```text
Smart_study
├── public/
│   └── images/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── app.js
├── src/
│   ├── components/
│   ├── context/
│   ├── features/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   └── main.tsx
├── uploads/
├── package.json
├── tsconfig.json
└── vite.config.mts
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB running locally or through a remote connection
- Gemini API key
- Optional: Ollama API key

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/smart_study
JWT_SECRET=your_jwt_secret_key_here

GEMINI_API_KEY=your_gemini_api_key_here
OLLAMA_API_KEY=your_ollama_api_key_here
OLLAMA_CHAT_MODEL=cogito-2.1:671b

VITE_API_URL=http://localhost:5000/api
DISABLE_HMR=false
```

### Run the Backend

```bash
npm run server
```

The backend runs by default on:

```text
http://localhost:5000
```

### Run the Frontend

```bash
npm run dev
```

The frontend runs by default on:

```text
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

## Available Scripts

| Command           | Description                                |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Start the Vite frontend development server |
| `npm run server`  | Start the Express backend server           |
| `npm run build`   | Build the frontend for production          |
| `npm run preview` | Preview the production build               |
| `npm run lint`    | Run TypeScript checks                      |

## Core Pages

| Page             | Purpose                                               |
| ---------------- | ----------------------------------------------------- |
| Landing Page     | Introduces Smart Study and its value                  |
| Dashboard        | Shows uploaded documents and quick access to analysis |
| Upload Page      | Handles PDF upload and indexing                       |
| Document Library | Lists stored study documents                          |
| Summary Page     | Displays AI-generated summaries                       |
| AI Chat          | Lets users chat with documents or use free chat       |
| Quiz Bank        | Provides generated multiple-choice quizzes            |
| Quiz History     | Tracks previous quiz attempts                         |
| Settings         | Manages user preferences                              |
| Reports          | Provides admin-level usage insights                   |

## Team

- Waleed Younis
- Ahmad Hannani
- Tamara Hisham
- Hussam Al Sharif
- Yazan Naseer

## Notes

- Only PDF uploads are currently supported.
- AI features require valid API keys.
- MongoDB must be available before starting the backend server.
- Uploaded files are stored in the `uploads/` directory.

## License

This project was developed as an academic full-stack web application.
