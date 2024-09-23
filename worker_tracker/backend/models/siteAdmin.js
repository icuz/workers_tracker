
const mongoose = require('mongoose');

const siteAdminSchema = new mongoose.Schema({
  role: { type: String, enum: ['siteAdmin'], required: true }, 
  siteAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Linked to the User model for the siteAdmin's user profile
  workSiteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },  // Reference to the Site they are managing
  numberOfEmp: { type: Number, required: true },  // Number of employees under the siteAdmin at this worksite
  progress: { type: String },  // Description of the current progress at the site
  progressImages: [{
    url: { type: String },  // URL of the image
    date: { type: Date, default: Date.now }  // Date when the image was uploaded
  }],
  remarks: { type: String },  // Remarks or comments by the siteAdmin
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SiteAdmin', siteAdminSchema);
