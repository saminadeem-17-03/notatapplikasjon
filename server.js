const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const db = new sqlite3.Database('./database.db');

// 📄 Notater tabell
db.run(`
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content TEXT
)
`);

// ✅ Todo tabell
db.run(`
CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT,
  done INTEGER
)
`);

// 🔄 Backup
function backup() {
  db.serialize(() => {
    db.all("SELECT * FROM notes", [], (e, notes) => {
      db.all("SELECT * FROM todos", [], (e2, todos) => {
        fs.writeFileSync('backup.json', JSON.stringify({ notes, todos }, null, 2));
      });
    });
  });
}

// -------- NOTATER --------

// hent
app.get('/notes', (req, res) => {
  db.all("SELECT * FROM notes", [], (err, rows) => {
    res.json(rows);
  });
});

// legg til
app.post('/notes', (req, res) => {
  const { title, content } = req.body;

  db.run("INSERT INTO notes (title, content) VALUES (?, ?)", [title, content], () => {
    backup();
    res.sendStatus(200);
  });
});

// -------- TODOS --------

// hent
app.get('/todos', (req, res) => {
  db.all("SELECT * FROM todos", [], (err, rows) => {
    res.json(rows);
  });
});

// legg til
app.post('/todos', (req, res) => {
  const { text } = req.body;

  db.run("INSERT INTO todos (text, done) VALUES (?, 0)", [text], () => {
    backup();
    res.sendStatus(200);
  });
});

// toggle (ikke slett!)
app.put('/todos/:id', (req, res) => {
  const id = req.params.id;

  db.get("SELECT done FROM todos WHERE id=?", [id], (err, row) => {
    const newVal = row.done ? 0 : 1;

    db.run("UPDATE todos SET done=? WHERE id=?", [newVal, id], () => {
      backup();
      res.sendStatus(200);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:${PORT}`);
});