const express = require('express');
const User = require('../models/User');
const Room = require('../models/Room');
const Shop = require('../models/Shop');
const Item = require('../models/Item');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

// Get all users (admin only)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user by ID (admin only)
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isAdmin) return res.status(403).json({ message: 'Cannot delete admin user' });

    await user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all rooms (admin only)
router.get('/rooms', protect, admin, async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete room by ID (admin only)
router.delete('/rooms/:id', protect, admin, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    await room.remove();
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all shops (admin only)
router.get('/shops', protect, admin, async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update shop rating (admin only)
router.put('/shops/:id/rating', protect, admin, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    shop.rating = req.body.rating;
    await shop.save();
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete shop by ID (admin only)
router.delete('/shops/:id', protect, admin, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    await shop.remove();
    res.json({ message: 'Shop deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all items (admin only)
router.get('/items', protect, admin, async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item by ID (admin only)
router.delete('/items/:id', protect, admin, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.remove();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
