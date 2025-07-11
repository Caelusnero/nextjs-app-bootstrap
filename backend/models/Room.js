const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  rent: { type: Number, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String },
  viewCount: { type: Number, default: 0 },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
