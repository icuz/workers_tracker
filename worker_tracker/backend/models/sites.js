
const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  siteName: { type: String, required: true },
  location: { type: String, required: true },
  siteAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  progressImages: [{
    url: { type: String },
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Site', siteSchema);
