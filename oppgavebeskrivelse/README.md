Notatapplikasjon med API
Beskrivelse

Dette er en enkel notatapplikasjon hvor brukeren kan:

Lage tekstnotater (tittel + innhold)
Lage todo-lister med oppgaver

Løsningen min består av:

Frontend (HTML + JS) som viser data til bruker
Backend (Node.js + Express) som håndterer API
Database (db.json) som lagrer data

Hvordan det fungerer
Frontend sender request via fetch
Backend mottar GET, POST, DELETE, PATCH
Data lagres i db.json
Frontend oppdaterer visning



Refleksjon:

Jeg valgte å bruke:

Express fordi det er enkelt å lage API
JSON-fil som database fordi det er lett å forstå og bruke
Fetch API i frontend for kommunikasjon

Fordeler:

Enkelt å implementere
Lett å forstå hvordan data flyter

Ulemper:

JSON-fil er ikke skalerbar
Ingen sikkerhet (ingen autentisering)



Oppsett på server (SSH)

Koble til server:

ssh server@192.168.20.84

Slett gammel versjon:

rm -rf notatapplikasjon

Klon prosjekt:

git clone https://github.com/saminadeem-17-03/notatapplikasjon.git

Gå inn i mappen:

cd notatapplikasjon

Installer:

npm install

Fiks feil:

npm audit fix

Rebuild (valgfritt):

npm rebuild

Start server:

node server.js 

Åpne i nettleser:

http://192.168.20.84:3000

Lagre endringer:

git add .
git commit -a -m "endringer"
git push