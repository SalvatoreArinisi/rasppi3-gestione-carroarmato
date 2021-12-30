# rasppi3-gestione-carroarmato
Gestione remota di un carro armato attraverso un raspberry.

Il progetto è costituito da una parte hardware, che consiste in un raspberry pi3B oppure un raspberry pi Zero W
montato su un carro che comanda un controllo motore a cui sono connessi i motorini DC che muovono i cingoli e da una parte software costituita da un progetto frontend ed uno backend.

Il frontend è una semplice pagina html con jquery e svg.js 
Il backend è costituito da un servizio REST scritto in javascript per nodejs che si interfaccia con i GPIO del Raspberry

Per controllo GPIO tramide NODEJS è stato installata
la libreria pigpio che gestisce il PWM (Pulse-width modulation)
essa è un wrapper della  pigpio C library(che deve essere installata prima)

Un limite della  pigpio C library e' che 
 puo' essere usata solo da un singolo processo attivo.

La libreria C e quindi anche il wrapper nodejs richiedono privilegi di root

documentazione libreria pigpio del modulo Nodejs https://github.com/fivdi/pigpio/blob/master/doc/gpio.md

## Getting Started

Le istruzioni seguenti consentono di scaricare il progetto in ambiente locale e di avviare il server

### Prerequisites

Prima di iniziare assicurati di avere **Nodejs** ed **Npm** installati sul raspberry e di aver scaricato e compilato la **libreria C pigpio**, prerequisito per il modulo pigpio Nodejs.

##### Nodejs ed NPM 
per controllare la tua versione di nodejs, avvia node -v da shell. 
Il progetto è stato testato sulla versione 9 di nodejs

Per scaricare Node.js vai su : https://nodejs.org/dist/latest-v9.x/ 

- In caso di Raspberry pi 3B+ scegliere una distribuzione nodejs per CPU ARM64

- In caso di Raspberry pi Zero W scegliere la distribuzione per ARM6

Una volta scaricato il tar della distribuzione nodejs scelta (es. la 9) :

***curl -o nodejs.tar.gz https://nodejs.org/dist/latest-v9.x/node-v9.11.2-linux-armv6l.tar.gz***


scompattarlo in una folder a piacere con il comando: ***tar -xzf nodejs.tar.gz***

dopo averlo scompattato eseguire la copia in usr/local:

***sudo cp -r node-v9.11.2-linux-armv6l/**** ***/usr/local/***

Infine eseguire 
- ***node -v*** e verificare che sia *v9.11.2*
- **npm -v** e verificare che sia *5.6.0*


##### Libreria C pgpio
verifica prima se la libreria è gia presente tramite: 	  ***pigpiod -v***
Il progetto è stato testato con la versione 64 di pigpio

se non è presente o la versione è molto vecchia eseguire l'installazione:
- ***sudo apt-get update***
-  ***sudo apt-get install pigpio***
  
Per una guida completa sull'installazione di tale libreria C, guardare il paragrafo "*Step 1 - Install the pigpio C library*" al link https://www.npmjs.com/package/pigpio


### Installing

Per ottenere una copia del sorgente sulla macchina locale

***git clone https://github.com/SalvatoreArinisi/rasppi3-gestione-carroarmato.git***

verrà creata la directory **rasppi3-gestione-carroarmato** sulla propria macchina

copiare la seguente cartella e la relativa sottocartella sul raspberry:

- ***rasppi3-gestione-carroarmato\backend *** *(non occorre copiare anche il frontend sul raspberry)*

aprire una shell via ssh sul raspberry ed eseguire i seguenti comandi:

- ***cd /rasppi3-gestione-carroarmato/backend***
- ***npm install*** *(per installazione dipendenze)*

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
