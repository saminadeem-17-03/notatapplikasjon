const noteInput = document.getElementById('note');
const saveBtn = document.getElementById('saveBtn');
const notesList = document.getElementById('notesList');

async function loadNotes() {
  const res = await fetch('/notes');
  const notes = await res.json();
  notesList.innerHTML = '';
  notes.forEach((note, i) => {
    const li = document.createElement('li');
    li.textContent = note;
    notesList.appendChild(li);
  });
}

saveBtn.addEventListener('click', async () => {
  const note = noteInput.value.trim();
  if (!note) return;

  await fetch('/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note })
  });

  noteInput.value = '';
  loadNotes();
});

// Last inn notater ved oppstart
loadNotes();  