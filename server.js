const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dbPath = "./students.json";

// Read database
function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

// Write database
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Test
app.get("/", (req, res) => {
  res.send("Upgraded Student Management System API Running!");
});

// Login API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: "Invalid credentials" });
});

// Get all students
app.get("/api/students", (req, res) => {
  res.json(readDB());
});

// Add student
app.post("/api/students", (req, res) => {
  const db = readDB();
  const newStu = {
    id: Date.now(),
    ...req.body,
  };
  db.push(newStu);
  writeDB(db);
  res.status(201).json(newStu);
});

// Update student
app.put("/api/students/:id", (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const idx = db.findIndex((s) => s.id === id);

  if (idx === -1) return res.status(404).json({ message: "Not found" });

  db[idx] = { id, ...req.body };
  writeDB(db);

  res.json(db[idx]);
});

// Delete student
app.delete("/api/students/:id", (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);

  const newDB = db.filter((s) => s.id !== id);
  writeDB(newDB);

  res.json({ message: "Deleted" });
});

app.listen(PORT, () =>
  console.log(`🚀 Upgraded server running at http://localhost:${PORT}`)
);
