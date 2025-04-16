const mongoose = require('mongoose');

// Define commentSchema first
const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Use function reference to avoid self-referencing issue
  },
  { timestamps: true }
);

// Define tacotruckSchema after commentSchema
const tacotruckSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['News', 'Sports', 'Games', 'Movies', 'Music', 'Television'],
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [ commentSchema],
  },
  { timestamps: true }
);

// Now create the model
const Tacotruck = mongoose.model('Tacotruck', tacotruckSchema);
const Comment = mongoose.model('Comment', commentSchema); // Register Comment model

module.exports = Tacotruck;
