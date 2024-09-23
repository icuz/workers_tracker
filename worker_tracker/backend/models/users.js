
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superAdmin', 'siteAdmin', 'employee'], required: true },
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
  employeeInfo: {
    jobTitle: { type: String },
    startDate: { type: Date },
    personalDetails: {
      phone: { type: String },
      address: { type: String }
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
