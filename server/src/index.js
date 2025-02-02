const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/duelNBackDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define User Schema
const userSchema = new mongoose.Schema({
  username: String,
  level: Number,
  delay: Number,
  score: Number,
  progress: Array
});

function generateSequence(level) {
  const sequence = [];
  for (let i = 0; i < level + 2; i++) { // Adding two extra items for initial display
    sequence.push(getRandomItem());
  }
  return sequence;
}

function getRandomItem() {
  // Return a random item from your set of possible items
  const items = ['A', 'B', 'C', 'D'];
  return items[Math.floor(Math.random() * items.length)];
}

const User = mongoose.model('User', userSchema);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});