async function loadTodos() {
    const res = await fetch('/todos');
    const todos = await res.json();
  
    const list = document.getElementById('todos');
    list.innerHTML = '';
  
    todos.forEach(t => {
      const li = document.createElement('li');
  
      li.innerHTML = `
        <span class="${t.done ? 'done' : ''}" onclick="toggle(${t.id})">
          ${t.text}
        </span>
      `;
  
      list.appendChild(li);
    });
  }
  
  async function addTodo() {
    const text = document.getElementById('todoInput').value;
  
    await fetch('/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
  
    loadTodos();
  }
  
  async function toggle(id) {
    await fetch(`/todos/${id}`, { method: 'PUT' });
    loadTodos();
  }
  
  loadTodos();