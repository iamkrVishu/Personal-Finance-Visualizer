import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true,
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget amount'],
    min: [0, 'Budget cannot be negative'],
  },
}, {
  timestamps: true,
});

export default mongoose.model('Budget', BudgetSchema);