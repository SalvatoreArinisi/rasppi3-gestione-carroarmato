# rasppi3-gestione-carroarmato
gestione remota di un raspberry pi3 montato su un carro armato

Il progetto è costituito da una parte frontend ed una backend.
Il frontend è una semplice pagina html con jquery e svg.js 
Il backend è costituito da uno script su nodejs che si interfaccia con i GPIO del Raspberry PI3

## Getting Started

Le istruzioni seguenti consentono di scaricare il progetto in ambiente locale e di avviare il server

### Prerequisites

Prima di iniziare assicurati di avere Nodejs ed Npm installati sul raspberry.

per controllare la tua versione di nodejs, avvia node -v da shell.

Per scaricare Node.js vai a  nodejs.org.

### Installing

Per ottenere una copia del sorgente sulla macchina locale

git clone https://github.com/SalvatoreArinisi/rasppi3-gestione-carroarmato.git

verrà creata la directory rasppi3-gestione-carroarmato sulla macchina locale

copiare la cartella e la relativa sottocartella sul raspberry:
rasppi3-gestione-carroarmato\backend (non occorre copiare anche il frontend sul raspberry)

eseguire dal raspberry la shell 
eseguire poi cd rasppi3-gestione-carroarmato
eseguire cd backend

installare le dipendenze del backend via npm

npm install

spostarsi sulla macchina locale sulla cartella  
rasppi3-gestione-carroarmato\frontend

installare le dipendenze del frontend via npm

npm install

Se si utilizza un webserver per il frontend copiare il contenuto della cartella frontend
dentro la cartella di deploy del webserver altrimenti cliccare direttamente sulla pagina
rasppi3-gestione-carroarmato.html per avviare il pannello di controllo 

### Avvio backend
l'avvio dello script node può essere fatta lanciando semplicemente il seguente comando da shell su raspberry
dentro la cartella rasppi3-gestione-carroarmato\backend:

npm start
che provvede ad avviare il file rasppi3-gestione-carroarmato.js

### Avvio frontend
l'avvio del frontend può essere fatto semplicemente aprendo la pagina html rasppi3-gestione-carroarmato.html
oppure caricandola dentro un qualunque webserver come Apache o Nginx assicurandosi ovviamente di 
avviare tale server prima di poter utilizzare la pagina

###Note
sul raspberry è necessario installare la sola cartella di backend:
rasppi3-gestione-carroarmato\backend

sul PC da cui si vuole comandare il carro è necessario invece installare la cartella di frontend:
rasppi3-gestione-carroarmato\frontend
