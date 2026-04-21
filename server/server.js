const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

function readDB() {
    return JSON.parse(fs.readFileSync('db.json'));
}

function writeDB(data) {
    fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
}


app.get('/notes', (req, res) => {
    res.json(readDB().notes);
});

app.post('/notes', (req, res) => {
    const db = readDB();
    const note = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content
    };
    db.notes.push(note);
    writeDB(db);
    res.json(note);
});

app.delete('/notes/:id', (req, res) => {
    const db = readDB();
    db.notes = db.notes.filter(n => n.id != req.params.id);
    writeDB(db);
    res.json({ message: "Slettet" });
});

// GET
app.get('/todos', (req, res) => {
    res.json(readDB().todos);
});

// POST
app.post('/todos', (req, res) => {
    const db = readDB();

    const todo = {
        id: Date.now(),
        title: req.body.title,
        tasks: req.body.tasks || []
    };

    db.todos.push(todo);
    writeDB(db);
    res.json(todo);
});

// DELETE todo
app.delete('/todos/:id', (req, res) => {
    const db = readDB();
    db.todos = db.todos.filter(t => t.id != req.params.id);
    writeDB(db);
    res.json({ message: "Todo slettet" });
});

// PATCH toggle task
app.patch('/todos/:todoId/tasks/:taskIndex', (req, res) => {
    const db = readDB();

    const todo = db.todos.find(t => t.id == req.params.todoId);

    if (!todo) return res.status(404).json({ error: "Fant ikke todo" });

    const task = todo.tasks[req.params.taskIndex];

    if (!task) return res.status(404).json({ error: "Fant ikke task" });

    task.done = !task.done;

    writeDB(db);
    res.json(task);
});

// DELETE task
app.delete('/todos/:todoId/tasks/:taskIndex', (req, res) => {
    const db = readDB();

    const todo = db.todos.find(t => t.id == req.params.todoId);

    if (!todo) return res.status(404).json({ error: "Fant ikke todo" });

    todo.tasks.splice(req.params.taskIndex, 1);

    writeDB(db);
    res.json({ message: "Task slettet" });
});

app.listen(PORT, () => {
    console.log("Server kjører på http://localhost:" + PORT);
});