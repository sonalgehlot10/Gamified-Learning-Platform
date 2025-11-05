const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  category: String,
  title: String,
  content: String,
//media: String,
  // audio: String, 
  audioLabels: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Card', CardSchema);