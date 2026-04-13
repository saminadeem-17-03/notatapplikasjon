async function loadNotes() {
  const res = await fetch('/notes');
  const notes = await res.json();

  const container = document.getElementById('notes');
  container.innerHTML = '';

  notes.forEach(n => {
    const div = document.createElement('div');
    div.innerHTML = `<h3>${n.title}</h3><p>${n.content}</p>`;
    container.appendChild(div);
  });
}

async function addNote() {
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  await fetch('/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  });

  loadNotes();
}

loadNotes();