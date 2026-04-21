const API = "http://localhost:3000";


async function getNotes() {
    const res = await fetch(API + "/notes");
    const data = await res.json();

    const list = document.getElementById("notes");
    list.innerHTML = "";

    data.forEach(note => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${note.title}</strong><br>
            ${note.content}
            <button onclick="deleteNote(${note.id})">Slett</button>
        `;
        list.appendChild(li);
    });
}

async function addNote() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    await fetch(API + "/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
    });

    getNotes();
}

async function deleteNote(id) {
    await fetch(API + "/notes/" + id, { method: "DELETE" });
    getNotes();
}

let tasks = [];

function addTask() {
    const input = document.getElementById("taskInput");
    if (!input.value) return;

    tasks.push({ text: input.value, done: false });
    input.value = "";
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(t => {
        const li = document.createElement("li");
        li.innerText = t.text;
        list.appendChild(li);
    });
}

async function addTodo() {
    const title = document.getElementById("todoTitle").value;

    if (!title || tasks.length === 0) return;

    await fetch(API + "/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tasks })
    });

    tasks = [];
    renderTasks();
    getTodos();
}

// Hent todos
async function getTodos() {
    const res = await fetch(API + "/todos");
    const data = await res.json();

    const list = document.getElementById("todos");
    list.innerHTML = "";

    data.forEach(todo => {
        const li = document.createElement("li");

        let tasksHTML = "";

        todo.tasks.forEach((t, index) => {
            tasksHTML += `
                <div>
                    <input type="checkbox" 
                        ${t.done ? "checked" : ""} 
                        onchange="toggleTask(${todo.id}, ${index})">
                    
                    ${t.done ? "<s>" + t.text + "</s>" : t.text}

                    <button onclick="deleteTask(${todo.id}, ${index})">X</button>
                </div>
            `;
        });

        li.innerHTML = `
            <strong>${todo.title}</strong>
            <button onclick="deleteTodo(${todo.id})">Slett liste</button>
            ${tasksHTML}
        `;

        list.appendChild(li);
    });
}

// Toggle task
async function toggleTask(todoId, taskIndex) {
    await fetch(`${API}/todos/${todoId}/tasks/${taskIndex}`, {
        method: "PATCH"
    });
    getTodos();
}

// Slett todo
async function deleteTodo(id) {
    await fetch(API + "/todos/" + id, {
        method: "DELETE"
    });
    getTodos();
}

// Slett task
async function deleteTask(todoId, taskIndex) {
    await fetch(`${API}/todos/${todoId}/tasks/${taskIndex}`, {
        method: "DELETE"
    });
    getTodos();
}

getNotes();
getTodos();