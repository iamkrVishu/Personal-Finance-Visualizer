import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0.01, 'Amount must be greater than 0'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Transaction', TransactionSchema);