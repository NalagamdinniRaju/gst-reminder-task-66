// backend/app.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const reminderService = require('./services/reminderService');
const User = require('./models/User');
const Invoice = require('./models/Invoice');
const { addDays } = require('./utils/dateUtils');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/users', require('./routes/users'));

// Data seeding function
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Invoice.deleteMany();

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    });

    const recruiters = await User.insertMany([
      { name: 'John Doe', email: 'john@example.com', role: 'recruiter' },
      { name: 'Jane Smith', email: 'jane@example.com', role: 'recruiter' },
      { name: 'Bob Johnson', email: 'bob@example.com', role: 'recruiter' },
    ]);

    // Create invoices
    const today = new Date();
    const invoices = await Invoice.insertMany([
      {
        recruiter: recruiters[0]._id,
        amount: 1000,
        gstAmount: 100,
        dueDate: addDays(today, 14),
        status: 'pending',
      },
      {
        recruiter: recruiters[1]._id,
        amount: 1500,
        gstAmount: 150,
        dueDate: addDays(today, 30),
        status: 'pending',
      },
      {
        recruiter: recruiters[2]._id,
        amount: 2000,
        gstAmount: 200,
        dueDate: addDays(today, 7),
        status: 'paid',
      },
      {
        recruiter: recruiters[0]._id,
        amount: 1200,
        gstAmount: 120,
        dueDate: addDays(today, 45),
        status: 'pending',
      },
      {
        recruiter: recruiters[1]._id,
        amount: 1800,
        gstAmount: 180,
        dueDate: addDays(today, 21),
        status: 'pending',
      },
      {
        recruiter: recruiters[2]._id,
        amount: 2200,
        gstAmount: 220,
        dueDate: addDays(today, 60),
        status: 'pending',
      },
    ]);

    console.log('Dummy data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Seed data on application start
seedData().then(() => {
  console.log('Data seeding completed');
});

// Start reminder cron job
reminderService.startReminderCron();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;