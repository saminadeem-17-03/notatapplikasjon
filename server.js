const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const { v4: uuid } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "db.json";
const API_KEY = "12345"; // enkel API key

// init db
fs.ensureFileSync(DB_FILE);
if (fs.readFileSync(DB_FILE).length === 0) {
  fs.writeJsonSync(DB_FILE, { notes: [], todos: [] });
}

function readDB() {
  return fs.readJsonSync(DB_FILE);
}

function writeDB(data) {
    fs.writeJsonSync(DB_FILE, data, { spaces: 2 });
  }
  
  // middleware for API key
  function auth(req, res, next) {
    if (req.headers["x-api-key"] !== API_KEY) {
      return res.status(403).json({ error: "Ugyldig API key" });
    }
    next();
  }
  
  // ---------- NOTES ----------
  app.get("/notes", auth, (req, res) => {
    const db = readDB();
    res.json(db.notes);
  });
  
  app.post("/notes", auth, (req, res) => {
    const { title, content } = req.body;
    const db = readDB();
  
    const note = { id: uuid(), title, content };
    db.notes.push(note);
    writeDB(db);
  
    res.json(note);
  });

  app.patch("/notes/:id", auth, (req, res) => {
    const db = readDB();
    const note = db.notes.find(n => n.id === req.params.id);
  
    if (!note) return res.status(404).send("Notat ikke funnet");
  
    Object.assign(note, req.body);
    writeDB(db);
    res.json(note);
  });
  
  app.delete("/notes/:id", auth, (req, res) => {
    const db = readDB();
    db.notes = db.notes.filter(n => n.id !== req.params.id);
    writeDB(db);
    res.send("Slettet");
  });
  
  // ---------- TODOS ----------
  app.get("/todos", auth, (req, res) => {
    const db = readDB();
    res.json(db.todos);
  });

  app.post("/todos", auth, (req, res) => {
    const { title, tasks } = req.body;
    const db = readDB();
  
    const todo = {
      id: uuid(),
      title,
      tasks: tasks || []
    };
  
    db.todos.push(todo);
    writeDB(db);
  
    res.json(todo);
  });
  
  app.patch("/todos/:id", auth, (req, res) => {
    const db = readDB();
    const todo = db.todos.find(t => t.id === req.params.id);
  
    if (!todo) return res.status(404).send("Todo ikke funnet");
  
    Object.assign(todo, req.body);
    writeDB(db);
    res.json(todo);
  });
  app.delete("/todos/:id", auth, (req, res) => {
    const db = readDB();
    db.todos = db.todos.filter(t => t.id !== req.params.id);
    writeDB(db);
    res.send("Slettet");
  });
  
  app.listen(3000, () => console.log("Server kjører på http://localhost:3000"));
    