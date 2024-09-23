const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  checkInImage: { type: String },
  checkOutImage: { type: String },
  workStatus: { type: String },
  location: { type: locationSchema, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attendance', attendanceSchema);