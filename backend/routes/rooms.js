const express = require('express');
const Room = require('../models/Room');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get paginated rooms (public)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const maxRent = req.query.maxRent ? parseFloat(req.query.maxRent) : null;
  const city = req.query.city || null;
  const pageSize = 10;

  const filter = {};
  if (maxRent !== null) filter.rent = { $lte: maxRent };
  if (city) filter.location = { $regex: city, $options: 'i' };

  try {
    const count = await Room.countDocuments(filter);
    const rooms = await Room.find(filter)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    res.json({
      rooms,
      page,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post new room (protected)
router.post('/', protect, async (req, res) => {
  const { title, description, rent, location, imageUrl } = req.body;
  try {
    const room = new Room({
      title,
      description,
      rent,
      location,
      imageUrl,
      postedBy: req.user._id,
    });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
