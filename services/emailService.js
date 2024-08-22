const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReminderEmail = async (to, invoice) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'GST Payment Reminder',
    html: `
      <h1>GST Payment Reminder</h1>
      <p>Your GST payment of ${invoice.gstAmount} is due on ${invoice.dueDate.toDateString()}.</p>
      <p>Please ensure timely payment to avoid any penalties.</p>
    `,
  });
};

const sendAdminAlertEmail = async (to, totalGSTDue) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'GST Payment Alert',
    html: `
      <h1>GST Payment Alert</h1>
      <p>The total GST amount due for payment is ${totalGSTDue}.</p>
      <p>Please ensure this amount is paid to the government before the deadline.</p>
    `,
  });
};

module.exports = { sendReminderEmail, sendAdminAlertEmail };