# Video Summarizer: AI-Powered Summaries for YouTube and Local Videos

This project demonstrates a full-stack application to generate concise, AI-powered summaries for YouTube videos and local video files. Built using Next.js 15 and Strapi CMS, it leverages cutting-edge AI models for efficient transcript extraction and summarization.

## Project Overview

This application provides the following functionality:

### YouTube Videos

- Upload YouTube videos using a URL or video ID.
- Extract transcripts using YouTube's API.
- Generate AI-powered summaries with the ChatGroq Llama model.
- Manage summaries in a user-friendly interface.
- Search and paginate through saved content.

### Local Videos

- Upload local video files in various formats.
- Convert videos to MP3 files using the FFMPEG module.
- Extract transcripts with OpenAI's Whisper model from HuggingFace.
- Generate summaries with the ChatGroq Llama model.
- Manage and view summaries.
- Search and paginate through user-generated content.

## Key Features

### Authentication & Authorization

- JWT-based user authentication.
- Protected routes and middleware for secured data access.
- User registration and login functionality.
- Secure cookie management for session persistence.

### Content Management

- CRUD operations for video summaries.
- User-specific content access and management.
- File upload support with ownership verification middleware.

### AI Integration

- ChatGroq API for summarization.
- OpenAI Whisper model for transcript generation.
- YouTube video transcript extraction.
- Customizable AI prompt templates.

### Search & Pagination

- Debounced search functionality.
- Server-side pagination for efficient content handling.
- Dynamic content filtering with URL-based parameters.

## Technical Stack

### Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- Shadcn UI Components

### Backend

- Strapi CMS
- PostgreSQL
- JWT Authentication
- Custom Middleware

### AI/ML

- ChatGroq Llama API for summarization.
- OpenAI Whisper model for transcription.
- YouTube Transcript API.

## Note about this project

If you have a suggestion or find a mistake in the post, please open an issue on the [GitHub repository](https://github.com/stevepanther/ai-project).

Fell free to make PRs to fix any issues you find in the project or let me know if you have any questions.

Happy coding!

- Panther
