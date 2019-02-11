//====Moduli NODEJS per gestione servizi REST + modulo per loggare su file
var express = require('express');
var app = express();
var http = require('http');
var log4js = require('log4js');
var LISTA_AZIONI_CARRO=null;
var REGISTRAZIONE=false;
var TIMER_REGISTRAZIONE=null;//è il timer che lancia la funzione di Riproduzione Azioni

// =======================
// ===================================
// Implementazione metodi REST =======
// ===================================

/**
	Attiva la registrazione
**/
app.get('/registra', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	if(REGISTRAZIONE && LISTA_AZIONI_CARRO && LISTA_AZIONI_CARRO.length>0){
		//se era attiva chiudo l'ultima azione
		LISTA_AZIONI_CARRO[LISTA_AZIONI_CARRO.length-1].fine=Date.now();
		LISTA_AZIONI_CARRO[LISTA_AZIONI_CARRO.length-1].ultimaAzione=true;
	}else if(!REGISTRAZIONE){
		//creo l'array
		LISTA_AZIONI_CARRO=[];
	}
	REGISTRAZIONE=!REGISTRAZIONE;
	var esito={};
	esito.registrazione=REGISTRAZIONE?'ON':'OFF';
	res.json(esito);
})

app.get('/motore', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	registraAzioniCarro(req.query.verso,80,req.query.direzione);
	var esito={};
	esito.messaggio=LISTA_AZIONI_CARRO;
	res.json(esito);
})

app.get('/riproduci', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	var esito={};
	esito.messaggio='avviata riproduzione in backgroud';
	esegueAzioni();
	res.json(esito);
})
//===============================================

//========Funzioni core

function registraAzioniCarro(motore,velocita,direzione){
	if(LISTA_AZIONI_CARRO && LISTA_AZIONI_CARRO.length>0){
		LISTA_AZIONI_CARRO[LISTA_AZIONI_CARRO.length-1].fine=Date.now();
	}
	var inizio = Date.now();
	var azioneCarro={};
	azioneCarro.motore=motore;
	azioneCarro.velocita=velocita;
	azioneCarro.direzione=direzione;
	azioneCarro.inizio=inizio;
	LISTA_AZIONI_CARRO.push(azioneCarro);
}


/**
	Preleva la prima azione dalla lista
	contestualmente viene eliminata dalla lista
**/
function popAzione(){
	var azione=null;
	if(LISTA_AZIONI_CARRO && LISTA_AZIONI_CARRO.length>0){
		azione = LISTA_AZIONI_CARRO.shift();
	}
	return azione;
}


function esegueAzioni() {
  if(!REGISTRAZIONE){
	  var azioneCorrente = popAzione();
	  
	  if(azioneCorrente && azioneCorrente.motore=='DRITTO'  && azioneCorrente.velocita==0){
		//sto chiedendo di fermare il carro
		fermaCarro();
		clearTimeout(TIMER_REGISTRAZIONE);
	  }else if(azioneCorrente){
		  muoviCarro(azioneCorrente.motore,azioneCorrente.velocita,azioneCorrente.direzione);
		  clearTimeout(TIMER_REGISTRAZIONE);
		  TIMER_REGISTRAZIONE = setTimeout(esegueAzioni, (azioneCorrente.fine-azioneCorrente.inizio));	  		  
	  }else{
		console.log("Azioni terminate "+Date.now());  
	  }
  }else{
		console.log("stoppa prima la registrazione!");
  }
  console.log("End esegueAzioni");
}

function muoviCarro(motore,velocita,direzione){
	console.log("muovo carro "+motore+" "+velocita+" "+direzione+" -ISTANTE="+Date.now());
}
function fermaCarro(){
	console.log("FERMO il carro !");
}

//===============================================
var server = http.createServer(app);

//Gestisco evento di shutdown del server nodejs..
/*server.on('close', function() {
  logger.debug(' spengo il carro ...');
});*/

//con questo metodo forzo la chiusura di eventuali eventi (timer, ecc.)
process.on('SIGINT', function() {
  console.log(' eseguo il process.exit()..');
  process.exit(0);
});

server.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("rasppi3-gestione-carroarmato in ascolto su -> http://%s:%s", host, port)
});
