const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Board = require('./models/Board');
const Task = require('./models/Task');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/trello-clone', { useNewUrlParser: true, useUnifiedTopology: true });

// Get all boards
app.get('/boards', async (req, res) => {
  const boards = await Board.find();
  res.json(boards);
});

// Create a board
app.post('/boards', async (req, res) => {
  const board = new Board(req.body);
  await board.save();
  res.json(board);
});

// Get tasks for a board
app.get('/boards/:id/tasks', async (req, res) => {
  const tasks = await Task.find({ boardId: req.params.id });
  res.json(tasks);
});

// Create a task in a board (status defaults to "To Do")
app.post('/boards/:id/tasks', async (req, res) => {
  const taskData = { ...req.body, boardId: req.params.id };
  // Ensure status defaults to "To Do" if not set
  if (!taskData.status) taskData.status = "To Do";
  const task = new Task(taskData);
  await task.save();
  res.json(task);
});

// Update a task (includes status update through dropdown in frontend)
app.put('/tasks/:id', async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(5000, () => console.log('Server running on port 5000'));
