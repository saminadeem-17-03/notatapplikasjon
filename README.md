# notatapplikasjonset-up

Start med å koble til serveren via SSH:

ssh server@192.168.20.84

Deretter fjerner du eventuell gammel versjon av prosjektet:

rm -rf notatapplikasjon

Klon prosjektet fra GitHub:

git clone https://github.com/saminadeem-17-03/notatapplikasjon.git

Gå inn i server-mappen:

cd notatapplikasjon

Installer nødvendige avhengigheter:

npm install

Fiks eventuelle sikkerhetsproblemer:

npm audit fix

Rebuild prosjektet (hvis nødvendig):

npm rebuild

Start serveren og lagre logg:

node server.js > log.txt

Applikasjonen er nå tilgjengelig i nettleser:

http://192.168.20.84:3000



Bruk av Git (GitHub Terminal)

For å lagre og laste opp endringer:

Legg til endringer:

git add .

Commit med melding:

git commit -a -m "comment"

Push til GitHub:

git push