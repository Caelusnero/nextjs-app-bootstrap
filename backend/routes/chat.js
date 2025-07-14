const express = require('express');
const Chat = require('../models/Chat');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

// Create or get chat between buyer and owner for a listing
router.post('/start', protect, async (req, res) => {
  const { listingId, listingType, ownerId } = req.body;
  const buyerId = req.user._id;

  try {
    let chat = await Chat.findOne({ listingId, listingType, buyerId, ownerId, isActive: true });
    if (!chat) {
      chat = new Chat({ listingId, listingType, buyerId, ownerId, messages: [] });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message in chat
router.post('/:chatId/message', protect, async (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;
  const senderId = req.user._id;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isActive) return res.status(404).json({ message: 'Chat not found' });

    chat.messages.push({ senderId, message, timestamp: new Date() });
    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get chats for user (buyer or owner)
router.get('/', protect, async (req, res) => {
  const userId = req.user._id;
  try {
    const chats = await Chat.find({
      isActive: true,
      $or: [{ buyerId: userId }, { ownerId: userId }],
    }).populate('buyerId ownerId');
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin get all chats
router.get('/all', protect, admin, async (req, res) => {
  try {
    const chats = await Chat.find().populate('buyerId ownerId');
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin deactivate chat
router.put('/:chatId/deactivate', protect, admin, async (req, res) => {
  const { chatId } = req.params;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    chat.isActive = false;
    await chat.save();
    res.json({ message: 'Chat deactivated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
