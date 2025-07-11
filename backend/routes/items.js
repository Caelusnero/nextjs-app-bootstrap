const express = require('express');
const Item = require('../models/Item');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get paginated items (public)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const category = req.query.category || '';
  const pageSize = 10;

  const filter = {};
  if (category) filter.category = category;

  try {
    const count = await Item.countDocuments(filter);
    const items = await Item.find(filter)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    res.json({
      items,
      page,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post new item (protected)
router.post('/', protect, async (req, res) => {
  const { title, description, price, contactInfo, category, imageUrl } = req.body;
  try {
    const item = new Item({
      title,
      description,
      price,
      contactInfo,
      category,
      imageUrl,
      postedBy: req.user._id,
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
