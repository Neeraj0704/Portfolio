import express from 'express';
import multer from 'multer';
import { queryResumeWithText, queryResumeWithSpeech } from '../Services/queryResume.js';

const router = express.Router();

// Configure multer for audio file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Text query endpoint
router.post('/text', async (req, res) => {
  try {
    const { query, topK = 5 } = req.body;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Query text is required'
      });
    }

    const result = await queryResumeWithText(query.trim(), topK);
    res.json(result);
  } catch (error) {
    console.error('Text query error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Voice query endpoint
router.post('/voice', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Audio file is required'
      });
    }

    const audioBuffer = req.file.buffer;
    const result = await queryResumeWithSpeech(audioBuffer);
    res.json(result);
  } catch (error) {
    console.error('Voice query error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;