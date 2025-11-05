// const mongoose = require('mongoose');

// const SolvedQuestionSchema = new mongoose.Schema({
//     questionId: String,
// });

// const userSchema = new mongoose.Schema({
//     uid: String,
//     solvedQuestions: [SolvedQuestionSchema],
// });

// module.exports = mongoose.model('UserProgress', userSchema);


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: String, // User ID from Firebase Auth
  solvedQuestions: [{ questionId: String }], // Array of objects
});

module.exports = mongoose.model('UserProgress', userSchema);