const mongoose = require('mongoose');

const SolvedQuestionSchema = new mongoose.Schema({
  questionId: String,
  selectedAnswer: Number,
});

const GlobalSolvedStateSchema = new mongoose.Schema({
  solvedQuestions: [SolvedQuestionSchema],
});

// const GlobalSolvedStateSchema = new mongoose.Schema({
//   // solvedQuestions: [String],
//   solvedQuestions: [
//     {
//       questionId: String,
//       selectedAnswer: Number, // Store the selected answer index here
//     }
//   ],
// });

module.exports = mongoose.model('GlobalSolvedState', GlobalSolvedStateSchema);