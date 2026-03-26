const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(__dirname)); // server html, css og js

// Hent alle notater
app.get('/notes', (req, res) => {
  let notes = [];
  if (fs.existsSync(DATA_FILE)) {
    notes = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }
  res.json(notes);
});

// Legg til nytt notat
app.post('/notes', (req, res) => {
  const { note } = req.body;
  if (!note) return res.status(400).send('Ingen note');

  let notes = [];
  if (fs.existsSync(DATA_FILE)) {
    notes = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }
  notes.push(note);
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:3000);
});

