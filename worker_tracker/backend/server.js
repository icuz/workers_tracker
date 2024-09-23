const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/users');
const Attendance = require('./models/attendance');
const SiteAdmin = require('./models/siteAdmin');
const Site = require('./models/sites');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect('mongodb://localhost:27017/worker_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Site Routes
app.post('/api/sites/:id/images', async (req, res) => {
    try {
      const { image } = req.body;
  
      if (!image) {
        return res.status(400).json({ error: 'Image is required' });
      }
  
      const site = await Site.findById(req.params.id);
      if (!site) {
        return res.status(404).json({ error: 'Site not found' });
      }
  
      site.progressImages.push({ url: image });
      await site.save();
  
      res.status(201).json(site);
    } catch (error) {
      console.error('Error adding image to site:', error);
      res.status(500).json({ error: 'Failed to add image to site' });
    }
});

// User Routes
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Attendance Routes
app.post('/api/attendance', async (req, res) => {
  try {
    const { employee, site, checkInTime, checkOutTime, checkInImage, checkOutImage, workStatus, location } = req.body;

    if (!employee || !site || !checkInImage || !location) {
      return res.status(400).send({ error: 'Missing required fields' });
    }

    // Define the start and end of the current day
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    // Find the attendance record for the same day
    let attendance = await Attendance.findOneAndUpdate(
      { employee, checkInTime: { $gte: startOfDay, $lte: endOfDay } },
      { site, checkInTime, checkOutTime, checkInImage, checkOutImage, workStatus, location },
      { new: true }
    );

    // If no record is found, create a new one
    if (!attendance) {
      attendance = new Attendance({
        employee,
        site,
        checkInTime,
        checkOutTime,
        checkInImage,
        checkOutImage,
        workStatus,
        location
      });
      await attendance.save();
    }

    res.status(201).send(attendance);
  } catch (error) {
    console.error('Error submitting attendance:', error);
    res.status(400).send({ error: 'Failed to submit attendance' });
  }
});

app.post('/api/attendance/logout', async (req, res) => {
  try {
    const { employee, checkOutTime, checkOutImage, location } = req.body;

    // Find the attendance record for the same day
    const attendance = await Attendance.findOneAndUpdate(
      { employee, checkInTime: { $gte: new Date().setHours(0, 0, 0, 0) } },
      { checkOutTime, checkOutImage, location },
      { new: true }
    );

    if (!attendance) {
      return res.status(404).send({ error: 'Attendance record not found' });
    }

    res.status(200).send(attendance);
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(400).send({ error: 'Failed to log out' });
  }
});

app.get('/api/attendance', async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find();
    res.status(200).send(attendanceRecords);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/attendance/user/:userId', async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({ employee: req.params.userId });
    if(!attendanceRecords) {
      return res.status(404).send();
    }
    res.status(200).send(attendanceRecords);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put('/api/attendance/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!attendance) {
      return res.status(404).send();
    }
    res.status(200).send(attendance);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/api/attendance/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).send();
    }
    res.status(200).send(attendance);
  } catch (error) {
    res.status(400).send(error);
  }
});

// SiteAdmin Routes
app.post('/api/siteAdmins', async (req, res) => {
  try {
    const siteAdmin = new SiteAdmin(req.body);
    await siteAdmin.save();
    res.status(201).send(siteAdmin);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/siteAdmins', async (req, res) => {
  try {
    const siteAdmins = await SiteAdmin.find();
    res.status(200).send(siteAdmins);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/siteAdmins/:id', async (req, res) => {
  try {
    const siteAdmin = await SiteAdmin.findById(req.params.id);
    if (!siteAdmin) {
      return res.status(404).send();
    }
    res.status(200).send(siteAdmin);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put('/api/siteAdmins/:id', async (req, res) => {
  try {
    const siteAdmin = await SiteAdmin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!siteAdmin) {
      return res.status(404).send();
    }
    res.status(200).send(siteAdmin);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/api/siteAdmins/:id', async (req, res) => {
  try {
    const siteAdmin = await SiteAdmin.findByIdAndDelete(req.params.id);
    if (!siteAdmin) {
      return res.status(404).send();
    }
    res.status(200).send(siteAdmin);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Site Routes
app.post('/api/sites', async (req, res) => {
  try {
    const site = new Site(req.body);
    await site.save();
    res.status(201).send(site);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/sites', async (req, res) => {
  try {
    const sites = await Site.find();
    res.status(200).send(sites);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/sites/:id', async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);
    if (!site) {
      return res.status(404).send();
    }
    res.status(200).send(site);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put('/api/sites/:id', async (req, res) => {
  try {
    const site = await Site.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!site) {
      return res.status(404).send();
    }
    res.status(200).send(site);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/api/sites/:id', async (req, res) => {
  try {
    const site = await Site.findByIdAndDelete(req.params.id);
    if (!site) {
      return res.status(404).send();
    }
    res.status(200).send(site);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});