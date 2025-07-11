const express = require('express');
const Shop = require('../models/Shop');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get paginated shops (public)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || '';
  const pageSize = 10;

  const filter = {};
  if (search) filter.name = { $regex: search, $options: 'i' };

  try {
    const count = await Shop.countDocuments(filter);
    const shops = await Shop.find(filter)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    res.json({
      shops,
      page,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post new shop (protected)
router.post('/', protect, async (req, res) => {
  const { name, description, rating, location, imageUrl } = req.body;
  try {
    const shop = new Shop({
      name,
      description,
      rating,
      location,
      imageUrl,
      postedBy: req.user._id,
    });
    await shop.save();
    res.status(201).json(shop);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
