import React, { useState } from "react";
import "./App.css";
import TaskCard from "./TaskCard";

const PRIORITIES = ["Low", "Medium", "High"];

function StatusColumn({ status, tasks, boardId, refreshTasks }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "To Do",
    assignedTo: "",
    dueDate: "",
  });

  const addTask = () => {
    fetch(`https://scriptguru-assesment-1.onrender.com/boards/${boardId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, status: "To Do" }),
    }).then(() => {
      setTask({
        title: "",
        description: "",
        priority: "Low",
        status: "To Do",
        assignedTo: "",
        dueDate: "",
      });
      refreshTasks();
    });
  };

  return (
    <div style={{ minWidth: 260, background: "#f5f5f5", padding: 16, borderRadius: 8 }}>
      <h4>{status}</h4>
      {tasks.map((taskObj) => (
        <TaskCard key={taskObj._id} task={taskObj} refreshTasks={refreshTasks} />
      ))}
      <hr />
      <input
        placeholder="Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />
      <input
        placeholder="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />
      <select value={task.priority} onChange={(e) => setTask({ ...task, priority: e.target.value })}>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <input
        placeholder="Assigned to"
        value={task.assignedTo}
        onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
      />
      <input
        type="date"
        value={task.dueDate}
        onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
      />
      <button onClick={addTask} disabled={!task.title}>
        Add Task
      </button>
    </div>
  );
}

export default StatusColumn;
