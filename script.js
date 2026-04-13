async function loadNotes() {
  const res = await fetch('/notes');
  const notes = await res.json();

  const list = document.getElementById('list');
  list.innerHTML = '';

  notes.forEach(note => {
    const li = document.createElement('li');

    li.innerHTML = `
      <span onclick="toggle(${note.id})" class="${note.done ? 'done' : ''}">
        ${note.text}
      </span>
      <button onclick="deleteNote(${note.id})">❌</button>
    `;

    list.appendChild(li);
  });
}

async function addNote() {
  const input = document.getElementById('input');
  const text = input.value;

  await fetch('/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  input.value = '';
  loadNotes();
}

async function toggle(id) {
  await fetch(`/notes/${id}`, { method: 'PUT' });
  loadNotes();
}

async function deleteNote(id) {
  await fetch(`/notes/${id}`, { method: 'DELETE' });
  loadNotes();
}

loadNotes();