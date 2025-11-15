import React, { useState, useEffect } from "react";
import "./App.css";

const STATUSES = ["To Do", "In progress", "Done"];
const PRIORITIES = ["Low", "Medium", "High"];

function TaskCard({ task, refreshTasks }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(task);

  useEffect(() => setForm(task), [task]);

  const handleUpdate = () => {
    fetch(`http://localhost:5000/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      setEditing(false);
      refreshTasks();
    });
  };

  const handleDelete = () => {
    fetch(`http://localhost:5000/tasks/${task._id}`, { method: "DELETE" }).then(
      refreshTasks
    );
  };

  return (
    <div
      style={{
        background: "#cccccc37",
        padding: 20,
        marginBottom: 10,
        borderRadius: 6,
      }}
    >
      {editing ? (
        <div>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
          />
          <input
            type="date"
            value={form.dueDate?.slice(0, 10) || ""}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          <button onClick={handleUpdate}>Save</button>
        </div>
      ) : (
        <div>
          <div>
            <strong>Task:</strong> {task.title}
          </div>
          <small>
            <strong>Description:</strong> {task.description}
          </small>
          <div>
            <strong>Status:</strong> {task.status}
          </div>
          <div>
            <strong>Priority:</strong> {task.priority}
          </div>
          <div>
            <strong>Assigned:</strong> {task.assignedTo}
          </div>
          <div>
            <strong>Due:</strong> {task.dueDate?.slice(0, 10)}
          </div>
          <div style={{margin: 5}}>
            <button onClick={() => setEditing(true)} style={{margin: 5}}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
