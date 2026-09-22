# Neeraj Vijayakumar Pattanashetti – Portfolio

Welcome to my personal portfolio repository! 

## 🚀 Project Overview

This portfolio site serves as a digital showcase of my work, featuring:

- **Interactive UI**: Built with React.js and styled using Tailwind CSS.
- **AI Integration**: Utilizes Google’s **Gemini API** for conversational responses, Text-to-Speech (TTS), and Speech-to-Text (STT) functionalities.
- **Resume Download**: Allows visitors to download my resume directly.
- **Project Showcases**: Highlights various projects with detailed descriptions and technologies used.

## 🔧 Technologies Used

- **Frontend**: React.js, Tailwind CSS, TypeScript
- **Backend / Deployment**: Render
- **AI Integration**: Google Gemini API (Conversational AI, TTS, STT)
- **Other Tools**: Vite, ESLint, Prettier

## 🌐 Live Portfolio

Experience the live version of my portfolio at:  
🔗 [https://neeraj-v-p.onrender.com/](https://neeraj-v-p.onrender.com/)


## 📄 Resume

You can download my resume directly from the website or access it here:  

🔗 [Neeraj_V_Pattanashetti_Resume.pdf](public/Neeraj_V_Pattanashetti_Resume.pdf)

## Development and Deployment

Production is hosted on Render from the `master` branch.
Run `npm ci`, `npm run check`, and `npm test` before deploying.
`npm run build` builds both the Vite client and the TypeScript server;
`npm start` serves the result. The generated server is currently tracked
for compatibility with the existing Render deployment, so include regenerated
`build/server` files when changing server source.

For local development, run `npm run build:server` and `npm start` alongside
`npm run dev`. The Vite API proxy targets the server on port 3000.

Chat requires `PINECONE_API_KEY`, `PINECONE_INDEX`, `GEMINI_API_KEY`,
and `TEXT_TO_SPEECH_API` in the hosting environment. The optional contact
endpoint uses `SMTP_APP_PASSWORD` and optionally `SMTP_USER`; the contact
form is currently hidden. Never commit credentials.

`GET /api/health` reports server availability and Render's deployed commit.

## Contact Details

Feel free to reach out:  

- **Email**: [neerajvpattanashetti@gmail.com](mailto:neerajvpattanashetti@gmail.com)  
- **LinkedIn**: [Neeraj VP](https://www.linkedin.com/in/neeraj-vijayakumar-pattanashetti-613305239/)
