const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ["To Do", "In progress", "Done"],
    default: "To Do"
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  },
  assignedTo: String,
  dueDate: Date,
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
