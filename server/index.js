const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Vite's default ports
  credentials: true
}));

// Connect to MongoDB - with better error handling
mongoose.connect('mongodb://localhost:27017/animal-facts', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('Could not connect to MongoDB', err);
  console.log('Running in fallback mode with in-memory storage');
});

// Define Fact Schema and Model
const factSchema = new mongoose.Schema({
  fact: {
    type: String,
    required: true
  },
  animal: {
    type: String,
    enum: ['cat', 'dog'],
    default: 'cat'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Fact = mongoose.model('Fact', factSchema);

// Fallback in-memory storage if MongoDB connection fails
let inMemoryFacts = [];
let nextId = 1;

// API Routes
app.get('/api/facts', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      // If MongoDB is connected
      const facts = await Fact.find().sort({ createdAt: -1 });
      res.json(facts);
    } else {
      // Fallback to in-memory
      res.json(inMemoryFacts);
    }
  } catch (err) {
    console.error('Error fetching facts:', err);
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/facts', async (req, res) => {
  try {
    const { fact, animal } = req.body;
    
    if (!fact) {
      return res.status(400).json({ message: 'Fact content is required' });
    }
    
    if (mongoose.connection.readyState === 1) {
      // If MongoDB is connected
      const newFact = new Fact({
        fact,
        animal: animal || 'cat'
      });
      
      await newFact.save();
      res.status(201).json(newFact);
    } else {
      // Fallback to in-memory storage
      const newFact = {
        _id: String(nextId++),
        fact,
        animal: animal || 'cat',
        createdAt: new Date()
      };
      inMemoryFacts.push(newFact);
      res.status(201).json(newFact);
    }
  } catch (err) {
    console.error('Error saving fact:', err);
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/facts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    if (mongoose.connection.readyState === 1) {
      // If MongoDB is connected
      const fact = await Fact.findByIdAndDelete(id);
      
      if (!fact) {
        return res.status(404).json({ message: 'Fact not found' });
      }
    } else {
      // Fallback to in-memory storage
      const initialLength = inMemoryFacts.length;
      inMemoryFacts = inMemoryFacts.filter(fact => fact._id !== id);
      
      if (inMemoryFacts.length === initialLength) {
        return res.status(404).json({ message: 'Fact not found' });
      }
    }
    
    res.json({ message: 'Fact deleted' });
  } catch (err) {
    console.error('Error deleting fact:', err);
    res.status(500).json({ message: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongoConnected: mongoose.connection.readyState === 1,
    timestamp: new Date()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});