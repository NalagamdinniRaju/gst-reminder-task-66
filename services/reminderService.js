const cron = require('cron');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const emailService = require('./emailService');

const sendReminders = async () => {
  const pendingInvoices = await Invoice.find({ status: 'pending' }).populate('recruiter');
  
  for (const invoice of pendingInvoices) {
    const daysUntilDue = Math.ceil((invoice.dueDate - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue <= 7) {
      await emailService.sendReminderEmail(invoice.recruiter.email, invoice);
    }
  }
};

const sendAdminAlerts = async () => {
  const totalGSTDue = await Invoice.aggregate([
    { $match: { status: 'pending' } },
    { $group: { _id: null, total: { $sum: '$gstAmount' } } }
  ]);

  const admins = await User.find({ role: 'admin' });
  
  for (const admin of admins) {
    await emailService.sendAdminAlertEmail(admin.email, totalGSTDue[0].total);
  }
};

const startReminderCron = () => {
  // Run every day at midnight
  new cron.CronJob('0 0 * * *', sendReminders, null, true, 'UTC');
  
  // Run on the 1st of every month
  new cron.CronJob('0 0 1 * *', sendAdminAlerts, null, true, 'UTC');
};

module.exports = { startReminderCron };