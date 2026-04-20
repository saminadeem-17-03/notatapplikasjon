async function loadTodos() {
  const res = await fetch('/todos'); // Henter todos fra backend
  const todos = await res.json(); // Gjør om til JS-objekt

  const list = document.getElementById('todos'); // Finner liste i HTML
  list.innerHTML = ''; // Tømmer lista

  todos.forEach(t => { // Går gjennom alle todos
    const li = document.createElement('li'); // Lager liste-element

    li.innerHTML = `
      <span class="${t.done ? 'done' : ''}" onclick="toggle(${t.id})">
        ${t.text}
      </span>
    `; 
    // Hvis done = true → får CSS klasse
    // onclick → kjører toggle funksjon

    list.appendChild(li); // Legger til i lista
  });
}

async function addTodo() {
  const text = document.getElementById('todoInput').value; // Henter input

  await fetch('/todos', {
    method: 'POST', // Sender til backend
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }) // Gjør om til JSON
  });

  loadTodos(); // Oppdaterer lista
}

async function toggle(id) {
  await fetch(`/todos/${id}`, { method: 'PUT' }); // Sender update request
  loadTodos(); // Oppdaterer visning
}

loadTodos(); // Kjører når siden lastes