import express from 'express';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Get all transactions with category summary
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    
    // Calculate category-wise summary
    const categorySummary = transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

    res.json({
      transactions,
      categorySummary
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

// Create transaction
router.post('/', async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;

    if (!amount || amount <= 0 || !description || !category || !date) {
      return res.status(400).json({ 
        error: 'Please provide valid amount, description, category, and date' 
      });
    }

    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Error creating transaction' });
  }
});

// Update transaction
router.put('/:id', async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;

    if (!amount || amount <= 0 || !description || !category || !date) {
      return res.status(400).json({ 
        error: 'Please provide valid amount, description, category, and date' 
      });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Error updating transaction' });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting transaction' });
  }
});

export default router;