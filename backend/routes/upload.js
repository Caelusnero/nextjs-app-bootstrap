const express = require('express');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const { protect } = require('../middleware/auth');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload image to Cloudinary
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'divi' },
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Cloudinary upload failed', error });
        }
        res.json({ url: result.secure_url });
      }
    );
    result.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
