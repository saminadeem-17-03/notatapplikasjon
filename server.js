const express = require('express'); // Importerer Express (lager server)
const sqlite3 = require('sqlite3').verbose(); // Importerer SQLite database
const fs = require('fs'); // Importerer filsystem (til backup)
const app = express(); // Lager en Express-app
const PORT = 3000; // Setter port til 3000

app.use(express.json()); // Gjør at serveren kan lese JSON fra requests
app.use(express.static(__dirname)); // Gjør at frontend-filer kan vises i nettleser

const db = new sqlite3.Database('./database.db'); // Lager/åpner databasefil

// 📄 Lager tabell for notater hvis den ikke finnes
db.run(`
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT, // Unik ID som øker automatisk
  title TEXT, // Tittel på notatet
  content TEXT // Innhold i notatet
)
`);

// ✅ Lager tabell for todos hvis den ikke finnes
db.run(`
CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT, // Unik ID
  text TEXT, // Selve todo-teksten
  done INTEGER // 0 = ikke ferdig, 1 = ferdig
)
`);

// 🔄 Backup-funksjon
function backup() {
  db.serialize(() => { // Kjører ting i riktig rekkefølge
    db.all("SELECT * FROM notes", [], (e, notes) => { // Henter alle notater
      db.all("SELECT * FROM todos", [], (e2, todos) => { // Henter alle todos
        fs.writeFileSync('backup.json', JSON.stringify({ notes, todos }, null, 2)); // Lagrer til fil
      });
    });
  });
}

// -------- NOTATER --------

// Henter alle notater
app.get('/notes', (req, res) => {
  db.all("SELECT * FROM notes", [], (err, rows) => { // SQL: hent alt
    res.json(rows); // Sender data som JSON til frontend
  });
});

// Legger til nytt notat
app.post('/notes', (req, res) => {
  const { title, content } = req.body; // Henter data fra request

  db.run("INSERT INTO notes (title, content) VALUES (?, ?)", [title, content], () => { // Legger inn i DB
    backup(); // Tar backup etter lagring
    res.sendStatus(200); // Sender OK tilbake
  });
});

// -------- TODOS --------

// Henter alle todos
app.get('/todos', (req, res) => {
  db.all("SELECT * FROM todos", [], (err, rows) => { // Henter alt
    res.json(rows); // Sender til frontend
  });
});

// Legger til ny todo
app.post('/todos', (req, res) => {
  const { text } = req.body; // Henter tekst fra frontend

  db.run("INSERT INTO todos (text, done) VALUES (?, 0)", [text], () => { // done = 0 (ikke ferdig)
    backup(); // Tar backup
    res.sendStatus(200); // OK
  });
});

// Toggle todo (bytter mellom ferdig/ikke ferdig)
app.put('/todos/:id', (req, res) => {
  const id = req.params.id; // Henter ID fra URL

  db.get("SELECT done FROM todos WHERE id=?", [id], (err, row) => { // Finner nåværende status
    const newVal = row.done ? 0 : 1; // Hvis 1 → 0, hvis 0 → 1

    db.run("UPDATE todos SET done=? WHERE id=?", [newVal, id], () => { // Oppdaterer DB
      backup(); // Tar backup
      res.sendStatus(200); // OK
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:${PORT}`); // Starter server
});