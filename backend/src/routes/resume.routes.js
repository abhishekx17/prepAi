const { Router } = require('express');
const resumeRouter = Router();
const multer = require('multer');

const pdf = require('pdf-parse');

// Configure multer in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit to 5MB
  },
});

/**
 * @route POST /api/resume/upload
 * @description Uploads a PDF or TXT resume and parses it to plain text.
 * @access Private
 */
resumeRouter.post('/upload', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'No file uploaded.',
    });
  }

  const mimeType = req.file.mimetype;
  const originalName = req.file.originalname.toLowerCase();

  try {
    let extractedText = '';

    if (mimeType === 'application/pdf' || originalName.endsWith('.pdf')) {
      const data = await pdf(req.file.buffer);
      extractedText = data.text || '';
    } else if (mimeType === 'text/plain' || originalName.endsWith('.txt')) {
      // Parse TXT
      extractedText = req.file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({
        message: 'Unsupported file format. Please upload a PDF (.pdf) or Text (.txt) file.',
      });
    }

    // Clean up basic extra spacing
    extractedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    if (!extractedText) {
      return res.status(400).json({
        message: 'Could not extract text from the file. Please ensure it is not scanned or empty.',
      });
    }

    res.status(200).json({
      message: 'Resume parsed successfully',
      text: extractedText,
    });
  } catch (error) {
    console.error('Error parsing resume file:', error);
    res.status(500).json({
      message: 'An error occurred while parsing the resume file.',
      error: error.message,
    });
  }
});

module.exports = resumeRouter;
