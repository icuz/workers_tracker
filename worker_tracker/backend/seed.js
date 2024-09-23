const mongoose = require('mongoose');
const User = require('./models/users');
const Attendance = require('./models/attendance');
const SiteAdmin = require('./models/siteAdmin');
const Site = require('./models/sites');

mongoose.connect('mongodb://localhost:27017/worker_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Attendance.deleteMany({});
    await SiteAdmin.deleteMany({});
    await Site.deleteMany({});

    // Create test users
    const user1 = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'employee',
      site: null,
      employeeInfo: {
        jobTitle: 'Engineer',
        startDate: new Date(),
        phone: '123-456-7890',
        address: '123 Main St'
      }
    });

    const user2 = new User({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'siteAdmin',
      site: null,
      employeeInfo: {
        jobTitle: 'Manager',
        startDate: new Date(),
        phone: '987-654-3210',
        address: '456 Elm St'
      }
    });

    await user1.save();
    await user2.save();

    // Create test site
    const site = new Site({
      siteName: 'Construction Site A',
      location: '123 Construction Rd',
      siteAdmin: user2._id,
      progressImages: [],
      createdAt: new Date()
    });

    await site.save();

    // Update user2 with site reference
    user2.site = site._id;
    await user2.save();

    // Create test attendance
    const attendance = new Attendance({
      employee: user1._id,
      site: site._id,
      checkInTime: new Date(),
      checkOutTime: null,
      checkInImage: '',
      checkOutImage: null,
      workStatus: 'working',
      location: { lat: 40.7128, lng: -74.0060 }, // Example location (New York City)
      createdAt: new Date()
    });

    await attendance.save();

    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDatabase();