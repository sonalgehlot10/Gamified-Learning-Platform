

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');
const OpenAI = require("openai");
const prompts = require('./promptlist');


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  

});

const labels = ['Mathematics', 'Classic', 'Dystopian', 'American Literature', 'Modernism', 'Space Exploration', '20th Century', 'MentalHealth', 'UX', 'Human Design', 'Prototyping', 'Interaction', 'Usability', 'Design Thinking', 'User Research', 'Empathy', 'Accessibility', 'UI Design', 'Testing', 'UX Principles', 'Psychology', 'Responsive Design', 'Visual Design', 'History', 'Ancient History', 'Modern History', 'Events', 'Revolutions', 'Figures', 'Movements', 'World Wars', 'Colonialism', 'Social Movements', 'Renaissance', 'Enlightenment', 'Industrial', 'Civil Rights', 'Feminism', 'Politics', 'Math', 'Algebra', 'Geometry', 'Calculus', 'Stats', 'Probability', 'Number Theory', 'Trigonometry', 'Logic', 'Proofs', 'Equations', 'Theorems', 'Primes', 'Topology', 'Applied Math', 'Business', 'Strategy', 'Entrepreneurship', 'Governance', 'Market Trends', 'Economics', 'Management', 'Leadership', 'Innovation', 'Positioning', 'Models', 'Behavior', 'Advantage', 'Shifts', 'Startups', 'Structures', 'Literature', 'Movements', 'Classics', 'Modern Lit', 'American Lit', 'British Lit', 'Fiction', 'Poetry', 'Characters', 'Plot', 'Themes', 'Symbols', 'Analysis', 'Narrative', 'Authors', 'Theory', 'Philosophy', 'Ethics', 'Metaphysics', 'Epistemology', 'Existentialism', 'Positivism', 'Morality', 'Mind', 'Ancient Philosophy', 'Modern Philosophy', 'Science Philosophy', 'Politics', 'Aesthetics', 'Rationalism', 'Idealism', 'Geography', 'Physical', 'Human', 'Geospatial', 'Cartography', 'Environment', 'Climate', 'Topography', 'Geopolitics', 'Landforms', 'Population', 'Urban', 'Conflict', 'Resources', 'GIS', 'SciFi', 'Tech', 'Space', 'AI', 'Aliens', 'Utopia', 'Dystopia', 'Time Travel', 'Robots', 'VR', 'Cyberpunk', 'Ethics', 'Empires', 'Post-Apocalypse', 'Science', 'Biology', 'Chemistry', 'Physics', 'Astronomy', 'Earth', 'Natural Science', 'Discovery', 'Method', 'Evolution', 'Ecology', 'Genetics', 'Quantum', 'Space Science', 'Quantum', 'Space Science', 'Environment', 'Social Media', 'Creation', 'Strategy', 'Engagement', 'Algorithm', 'Influencers', 'Virality', 'Hashtags', 'Timing', 'Calendar', 'Features', 'Growth', 'Branding', 'Trends', 'Finance', 'Investment', 'Economics', 'Markets', 'Stocks', 'Crypto', 'Planning', 'Growth', 'Risk', 'Banking', 'Wealth', 'Personal Finance', 'Policy', 'Mental Health', 'Therapy', 'Anxiety', 'Depression', 'Coping', 'Well-Being', 'CBT', 'Emotional Health', 'Disorders', 'Awareness', 'Stress', 'Self-Care', 'Wellness', 'Counseling'];

async function generateQuestion(category) {

  const categoryPrompt = prompts[category] || '';

  const categoryExistingQs = await getLast50Questions(category);
  const existingQsString = categoryExistingQs.map(q => `"${q.en}"`).join(';');

  
  const prompt = `Generate a truly unique and varied 1-sentence multiple-choice question about ${category}, maximum of 3-4 words. It should have 2 answer options and 1 correct answer. ${categoryPrompt}
      Translations required:
      - English (en)
      - Hinglish (hinglish)
      - Gujlish (gujlish)
      Avoid using WH words like What, When, Where, Who, Whom, Which, Whose, Why, and How in the questions. 
      Questions should NOT be related to the president of the USA.
      Look at the following existing questions ${existingQsString} and make sure none of these are repeated or duplicated.
      Select one or more labels from this list if applicable: ${labels}. 
      Example format:
      {
        "question": {
          "en": "Tallest mountain",
          "hinglish": "Sabse uncha pahad",
          "gujlish": "Mota parvat"
        },
        "options": ["Everest", "K2"],
        "correct": 0,
        "category": "Geography",
        "labels": ["Geography", "Mountains"]
      }`;

  console.log("Prompt sent to OpenAI:", prompt);

  try {
    console.log("Generating question...");
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9, 
      // max_tokens: 500,

    });

    console.log("OpenAI response:", response);

    if (response.choices && response.choices.length > 0) {
      const content = response.choices[0].message.content.trim();
      const generatedQuestion = JSON.parse(content); 
      
      return {
        question: generatedQuestion.question,
        options: generatedQuestion.options,
        correct: generatedQuestion.correct,
        category: category,
        labels: generatedQuestion.labels || [], 
      };
    } else {
      console.error("No choices available in the OpenAI response");
      return null;
    }

  } catch (error) {
    console.error("Error generating question:", error);
    return null;
  }
}




async function saveGeneratedQuestions(category, categoryPrompt, count = 20) {
  for (let i = 0; i < count; i++) {
    generateAndEmitQuestion(category)
    const newQuestion = await generateQuestion(category, categoryPrompt);
    if (newQuestion) {
      try {
        const existingQuestion = await Question.findOne({
          question: newQuestion.question,
          category: newQuestion.category
        });

        if (!existingQuestion) {
          const questionDocument = new Question(newQuestion);
          await questionDocument.save();
          console.log(`Question about ${category} saved to database`);
        } else {
          console.log("Duplicate question found. Skipping save.");
        }
        
      } catch (error) {
        console.error("Error saving question to the database:", error);
      }
    } else {
      console.log("No question generated.");
    }
  }
}

async function getLast50Questions(category) {
  try {
    const questions = await Question.find({ category })
      .sort({ _id: -1 }) 
      .limit(50)
      .distinct('question'); 
    return questions;
  } catch (error) {
    console.error('Error fetching last 50 questions:', error);
    return [];
  }
}

// async function getLast50Cards(category) {
//   try {
//     const cards = await Card.find({ category })
//       .sort({ _id: -1 })
//       .limit(50)
//       // .select('title'); // Fetch only necessary fields
//       .distinct('title'); // Retrieve just the questions
    
//     return cards;
//   } catch (error) {
//     console.error('Error fetching last 50 cards:', error);
//     return [];
//   }
// }


async function generateCard(category, prompt) {
  const categoryExistingCards = await getLast50Cards(category);
  const existingCardsString = categoryExistingCards.map(c => `"${c.title}"`).join(';');

  const finalPrompt = `${prompt}. Look at the following existing cards ${existingCardsString} and make sure none of these are repeated or duplicated.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: finalPrompt }],
      temperature: 0.7,
    });

    console.log("New Information Card:", response)

    if (response.choices && response.choices.length > 0) {
      const cardData = JSON.parse(response.choices[0].message.content.trim());
      
      const newCard = new Card({
        category: category,
        title: cardData.title,
        content: cardData.content,
        audioLabels: cardData.audioLabels,
        
      });
      console.log(newCard)
      await newCard.save();
      return newCard;
      
    } else {
      console.error('No choices returned from OpenAI');
      return null;
    }
  } catch (error) {
    console.error('Error generating card:', error);
    return null;
  }
}



const app = express();
const server = http.createServer(app);
const io = socketIo(server,{
    cors: {
      origin: process.env.LOCAL_CLIENT_APP,
      methods: ["GET", "POST"]
    }
  });

const Question = require('./models/Question');
const UserProgress = require('./models/User');
const GlobalSolvedState = require('./models/GlobalSolvedState');
const Card = require('./models/Card');

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// const deletePhilosophyQuestions = async () => {
//   try {
//     const result = await Question.deleteMany({ category: 'Philosophy' });
//     console.log(`Deleted ${result.deletedCount} questions from the Philosophy category.`);
//   } catch (error) {
//     console.error('Error deleting Philosophy questions:', error);
//   } finally {
//     mongoose.connection.close();
//   }
// };
// deletePhilosophyQuestions();

// const deleteQuestionsByDateRange = async (startDate, endDate) => {
//   try {
//     const result = await Question.deleteMany({
//       createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
//     });
//     console.log(`${result.deletedCount} questions deleted.`);
//   } catch (error) {
//     console.error('Error deleting questions:', error);
//   }
// };

// // Example usage:
// deleteQuestionsByDateRange('2024-11-06', '2024-11-07');


const generateAndEmitQuestion = async (category) => {
  const newQuestion = await generateQuestion(category);
  if (newQuestion) {
    try {
      const questionDocument = new Question(newQuestion);
      await questionDocument.save();

      io.emit('newQuestion', questionDocument);
    } catch (error) {
      console.error("Error saving and emitting question:", error);
    }
  }
};

async function getLast50Cards(category) {
  try {
    const cards = await Card.find({ category })
      .sort({ _id: -1 })
      .limit(50)
      .select('title'); 
    
    return cards;
  } catch (error) {
    console.error('Error fetching last 50 cards:', error);
    return [];
  }
}

console.log(getLast50Cards('Business'));

const userCursors = {};

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('solveQuestion', async ({ questionId, userId }) => {
    try {
      await GlobalSolvedState.updateOne(
        { 'solvedQuestions.questionId': { $ne: questionId } },
        { $addToSet: { solvedQuestions: { questionId } } },
        { upsert: true }
      );

      if (userId) {
        await UserProgress.updateOne(
          { uid: userId },
          { $addToSet: { solvedQuestions: { questionId } } },
          { upsert: true }
        );
      }

      io.emit('updateSolved', { questionId });
    } catch (error) {
      console.error('Error updating solved state:', error);
    }
  });

  socket.on('disconnect', () => {
      console.log('User disconnected');
  });

  socket.on('cursorMove', (data) => {
    userCursors[socket.id] = data;
    socket.broadcast.emit('cursorsUpdate', userCursors);
  });

  socket.on('disconnect', () => {
    delete userCursors[socket.id];
    socket.broadcast.emit('cursorsUpdate', userCursors);
  });

});


app.get('/api/cards', async (req, res) => {
  let categories = req.query.category;

  if (!Array.isArray(categories)) {
    categories = categories ? categories.split(',') : [];
  }

  try {
    const cards = await Card.find({ category: { $in: categories } });
    res.json(cards);
  } catch (error) {
    console.error('Error retrieving cards:', error);
    res.status(500).send('Server Error');
  }
});

app.post('/api/generate-card', async (req, res) => {
  const { category, prompt } = req.body;

  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }

  const card = await generateCard(category, prompt);

  if (card) {
    res.status(201).json({ message: 'Card generated successfully', card });
  } else {
    res.status(500).json({ message: 'Error generating card' });
  }
});

app.put('/api/cards/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, audioLabels } = req.body;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { $set: {title, content, audioLabels} },
      { new: true, runValidators: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(updatedCard);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/cards/:id', async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).send('Server Error');
  }
});


app.get('/api/questions', async (req, res) => {
  let categories = req.query.categories;

  if (!Array.isArray(categories)) {
    categories = categories ? categories.split(',') : [];
  }

  try {
    const questions = await Question.find({ category: { $in: categories } });

    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).send('Server Error');
  }
});



app.get('/api/solved', async (req, res) => {


  try {
    const solvedState = await GlobalSolvedState.findOne({});
    
    if (solvedState) {
      res.json(solvedState.solvedQuestions); 
    } else {
      res.json([]);
    }

  } catch (error) {
    console.error('Error fetching solved state:', error);
    res.status(500).send('Server Error');
  }

});


app.post('/api/solved', async (req, res) => {
  const { questionId, selectedAnswer } = req.body;

  try {
    const solvedState = await GlobalSolvedState.findOneAndUpdate(
      {},
      { $addToSet: { solvedQuestions: { questionId, selectedAnswer } } },
      { new: true, upsert: true }
    );

    res.json(solvedState);
  } catch (error) {
    console.error('Error updating solved state:', error);
    res.status(500).send('Server Error');
  }
});

app.get('/api/user-progress/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const userProgress = await UserProgress.findOne({ uid: userId });
    res.json(userProgress || { solvedQuestions: [] });
  } catch (error) {
    res.status(500).send('Error retrieving user progress');
  }
});

app.post('/api/solve-question', async (req, res) => {
  const { userId, questionId } = req.body;

  try {
    await UserProgress.updateOne(
      { uid: userId },
      { $addToSet: { solvedQuestions: questionId } },
      { upsert: true }
    );
    res.status(200).send('Solved question updated');
  } catch (error) {
    console.error('Error updating solved questions:', error); // Log error
    res.status(500).send('Error updating solved questions');
  }
});


app.post('/api/generate-questions', async (req, res) => {
  const { category, categoryPrompt } = req.body;

  try {
    await saveGeneratedQuestions(category, categoryPrompt, 50); 
    res.json({ message: `Questions generated for category: ${category}` });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});


app.get('/65823913.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/public/65823913.html'));
});

app.post('/api/get-final-prompt', async (req, res) => {
  const { category, categoryPrompt } = req.body;

  

  try {
    const categoryExistingQs = await getLast50Questions(category);
    const existingQsString = categoryExistingQs.map(q => `"${q.en}"`).join(';');

    const prompt = `Generate a truly unique and varied 1-sentence multiple-choice question about ${category}, maximum of 3-4 words. It should have 2 answer options and 1 correct answer. ${categoryPrompt}
      Translations required:
      - English (en)
      - Hinglish (hinglish)
      - Gujlish (gujlish)
      Avoid using WH words like What, When, Where, Who, Whom, Which, Whose, Why, and How in the questions. 
      Questions should NOT be related to the president of the USA.
      Look at the following existing questions ${existingQsString} and make sure none of these are repeated or duplicated.
      Select one or more labels from this list if applicable: ${labels}.
      Example format:
      {
        "question": {
          "en": "Tallest mountain",
          "hinglish": "Sabse uncha pahad",
          "gujlish": "Mota parvat"
        },
        "options": ["Everest", "K2"],
        "correct": 0,
        "category": "Geography",
        "labels": ["Geography", "Mountains"]
      }`;

    res.json({ prompt, existingQsString });
  } catch (error) {
    console.error('Error constructing prompt:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});


app.post('/api/get-final-card-prompt', async (req, res) => {
  const { category } = req.body;

  try {

    const categoryExistingCards = await getLast50Cards(category);
    const existingCardsString = categoryExistingCards.map(c => `"${c.title}"`).join(';');

    
    const prompt = `Generate a brief card explaining a core concept in ${category}. Include:
    A title, Content and audioLabels that stays as the same 'audio1'. Content should be less than 15 words.
    Example format:
    {
      “title": "Why do landing pages use one giant image?”, 
      ”content": "A dominant visual creates a strong first impression, focusing the user's attention on the message”, 
      “category”: “Science”,
      "audioLabels": "audio1"
    }. Look at the following existing cards ${existingCardsString} and make sure none of these are repeated or duplicated. `;



    res.json({ prompt, existingCardsString });
  } catch (error) {
    console.error('Error constructing prompt:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});


app.get('/api/prompts', (req, res) => {
  res.json(prompts);
});



app.put('/api/questions/:id', async (req, res) => {
  const { id } = req.params;
  const { question, options, correct, labels } = req.body;

  try {
    if (!question || !options || typeof correct !== 'number') {
      return res.status(400).json({ error: 'Invalid data structure' });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { $set: { question, options, correct, labels } },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});



app.delete('/api/questions/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.get('/', (req, res) => {
    res.send('API server is running...');
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
