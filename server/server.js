require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Board = require('./models/Board');
const Task = require('./models/Task');

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://script-guru:Script%401234@script--guru.bmoeofx.mongodb.net/trello-clone?retryWrites=true&w=majority&appName=script--guru';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Atlas connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// ========== API ROUTES ==========

// Get all boards
app.get('/boards', async (req, res) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a board
app.post('/boards', async (req, res) => {
  try {
    const board = new Board(req.body);
    await board.save();
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tasks 
app.get('/boards/:id/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ boardId: req.params.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a task in a board
app.post('/boards/:id/tasks', async (req, res) => {
  try {
    const taskData = { ...req.body, boardId: req.params.id };
    if (!taskData.status) taskData.status = "To Do";
    const task = new Task(taskData);
    await task.save(); // ✅ FIXED: 'board' se 'task' kar diya
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PRODUCTION DEPLOYMENT
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
//   });
// }


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
