const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    // question: String,
    question: Object,
    // question: {
    //     en: String,
    //     hinglish: String,
    //     gujlish: String,
    // },
    options: [String],
    correct: Number,
    category: String,
    labels: [String],
},{ timestamps: true }); // This adds createdAt and updatedAt fields

module.exports = mongoose.model('Question', QuestionSchema);