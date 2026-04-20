async function loadNotes() {
  const res = await fetch('/notes'); // Henter notater fra backend
  const notes = await res.json(); // Gjør om til JavaScript-objekt

  const container = document.getElementById('notes'); // Finner HTML-element
  container.innerHTML = ''; // Tømmer gammel visning

  notes.forEach(n => { // Går gjennom alle notater
    const div = document.createElement('div'); // Lager nytt element
    div.innerHTML = `<h3>${n.title}</h3><p>${n.content}</p>`; // Setter inn data
    container.appendChild(div); // Legger til på siden
  });
}

async function addNote() {
  const title = document.getElementById('title').value; // Henter tittel fra input
  const content = document.getElementById('content').value; // Henter innhold

  await fetch('/notes', {
    method: 'POST', // Sender data til server
    headers: { 'Content-Type': 'application/json' }, // Forteller at det er JSON
    body: JSON.stringify({ title, content }) // Gjør om til JSON
  });

  loadNotes(); // Oppdaterer visning etter lagring
}

loadNotes(); // Kjører når siden lastes