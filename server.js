const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Database
const db = new sqlite3.Database('./database.db');

// Lag tabell
db.run(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    done INTEGER
  )
`);

// 🔄 Sync til JSON
function backupToJSON() {
  db.all("SELECT * FROM notes", [], (err, rows) => {
    if (!err) {
      fs.writeFileSync('backup.json', JSON.stringify(rows, null, 2));
    }
  });
}

// 📥 Hent notater
app.get('/notes', (req, res) => {
  db.all("SELECT * FROM notes", [], (err, rows) => {
    res.json(rows);
  });
});

// ➕ Legg til
app.post('/notes', (req, res) => {
  const { text } = req.body;

  db.run("INSERT INTO notes (text, done) VALUES (?, 0)", [text], function () {
    backupToJSON();
    res.sendStatus(200);
  });
});

// ✔️ Toggle done
app.put('/notes/:id', (req, res) => {
  const id = req.params.id;

  db.get("SELECT done FROM notes WHERE id=?", [id], (err, row) => {
    const newValue = row.done ? 0 : 1;

    db.run("UPDATE notes SET done=? WHERE id=?", [newValue, id], () => {
      backupToJSON();
      res.sendStatus(200);
    });
  });
});

// ❌ Slett
app.delete('/notes/:id', (req, res) => {
  db.run("DELETE FROM notes WHERE id=?", [req.params.id], () => {
    backupToJSON();
    res.sendStatus(200);
  });
});

app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:${PORT}`);
});