const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'listingType' },
  listingType: { type: String, required: true, enum: ['Room', 'Shop', 'Item'] },
  buyerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  messages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: { type: String },
      timestamp: { type: Date, default: Date.now },
    }
  ],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
