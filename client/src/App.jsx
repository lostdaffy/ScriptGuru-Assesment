import React, { useState, useEffect } from "react";
import "./App.css";
import StatusColumn from "./StatusColumn";

const API = "https://scriptguru-assesment-1.onrender.com";
const STATUSES = ["To Do", "In progress", "Done"];

function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");

  useEffect(() => {
    fetch(`${API}/boards`)
      .then((res) => res.json())
      .then(setBoards);
  }, []);

  useEffect(() => {
    if (selectedBoard)
      fetch(`${API}/boards/${selectedBoard}/tasks`)
        .then((res) => res.json())
        .then(setTasks);
  }, [selectedBoard]);

  const createBoard = () => {
    fetch(`${API}/boards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newBoardName }),
    })
      .then((res) => res.json())
      .then((board) => {
        setBoards([...boards, board]);
        setNewBoardName("");
      });
  };

  const groupedTasks = {};
  STATUSES.forEach((status) => (groupedTasks[status] = []));
  tasks.forEach((task) => groupedTasks[task.status].push(task));

  return (
    <div style={{ display: "flex" }}>
      <aside
        style={{
          width: 220,
          padding: 16,
          borderRight: "1px solid #ddd",
          minHeight: "100vh",
        }}
      >
        <h3>Boards</h3>
        {boards.map((b) => (
          <div
            key={b._id}
            style={{
              fontWeight: selectedBoard === b._id ? "bold" : "normal",
              cursor: "pointer",
              margin: "10px 0",
            }}
            onClick={() => setSelectedBoard(b._id)}
          >
            {b.name}
          </div>
        ))}
        <input
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="New Board Name"
        />
        <button onClick={createBoard}>Create Board</button>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>
        {selectedBoard ? (
          <div style={{ display: "flex", gap: 24 }}>
            {STATUSES.map((status) => (
              <StatusColumn
                key={status}
                status={status}
                tasks={groupedTasks[status]}
                boardId={selectedBoard}
                refreshTasks={() =>
                  fetch(`${API}/boards/${selectedBoard}/tasks`)
                    .then((res) => res.json())
                    .then(setTasks)
                }
              />
            ))}
          </div>
        ) : (
          <div>Select a board</div>
        )}
      </main>
    </div>
  );
}

export default App;
