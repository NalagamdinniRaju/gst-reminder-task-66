const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('recruiter');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new invoice
router.post('/', async (req, res) => {
  const invoice = new Invoice({
    recruiter: req.body.recruiter,
    amount: req.body.amount,
    gstAmount: req.body.gstAmount,
    dueDate: req.body.dueDate,
  });

  try {
    const newInvoice = await invoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update invoice status
router.patch('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (invoice == null) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    if (req.body.status != null) {
      invoice.status = req.body.status;
    }
    
    const updatedInvoice = await invoice.save();
    res.json(updatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;