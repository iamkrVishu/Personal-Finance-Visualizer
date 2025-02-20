import express from 'express';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Get all budgets with expense calculations
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find();
    const transactions = await Transaction.find();

    const categoryExpenses = transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

    const budgetData = budgets.map(budget => {
      const spent = categoryExpenses[budget.category] || 0;
      const remaining = budget.budget - spent;
      const warning = spent >= (budget.budget * 0.8);

      return {
        id: budget._id,
        category: budget.category,
        budget: budget.budget,
        spent,
        remaining,
        warning,
      };
    });

    res.json(budgetData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching budgets' });
  }
});

// Add/update budget
router.post('/', async (req, res) => {
  try {
    const { category, budget } = req.body;

    if (!category || !budget || budget < 0) {
      return res.status(400).json({ error: 'Please provide valid category and budget amount' });
    }

    const existingBudget = await Budget.findOne({ category });
    if (existingBudget) {
      existingBudget.budget = budget;
      const updatedBudget = await existingBudget.save();
      return res.json(updatedBudget);
    }

    const newBudget = await Budget.create({ category, budget });
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(500).json({ error: 'Error creating/updating budget' });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting budget' });
  }
});

export default router;