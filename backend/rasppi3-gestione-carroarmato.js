const Gpio = require('pigpio').Gpio;
//====Moduli NODEJS per gestione servizi REST + modulo per loggare su file
var express = require('express');
var app = express();
var http = require('http');
var log4js = require('log4js');
// =======================
// Impostazione GPIO PIN ============
// =======================
// ******* INIZIO SETUP MOTORE SINISTRO **********
const GPIO_MS_F=13;
const GPIO_MS_B=6;
const MOTORE_SX_FORWARD = new Gpio(GPIO_MS_F, {mode: Gpio.OUTPUT});
const MOTORE_SX_BACKWARD = new Gpio(GPIO_MS_B, {mode: Gpio.OUTPUT});
// ******* FINE SETUP MOTORE SINISTRO **********
// ******* INIZIO SETUP MOTORE DESTRO **********
const GPIO_MD_F=20;
const GPIO_MD_B=16;
const MOTORE_DX_FORWARD = new Gpio(GPIO_MD_F, {mode: Gpio.OUTPUT});
const MOTORE_DX_BACKWARD = new Gpio(GPIO_MD_B, {mode: Gpio.OUTPUT});
// ******* FINE SETUP MOTORE DESTRO **********
// =======================
// ******* INIZIO SETUP LUCI **********
const GPIO_LUCI_SX=26;
const GPIO_LUCI_DX=19;
const LUCI_DX = new Gpio(GPIO_LUCI_DX, {mode: Gpio.OUTPUT});
const LUCI_SX = new Gpio(GPIO_LUCI_SX, {mode: Gpio.OUTPUT});
// ******* FINE LUCI **********
// =======================

//inizializzazione motori e luci
MOTORE_SX_FORWARD.pwmWrite(0); 
MOTORE_SX_BACKWARD.pwmWrite(0);
MOTORE_DX_FORWARD.pwmWrite(0); 
MOTORE_DX_BACKWARD.pwmWrite(0);


const VELOCITA_ZERO=55;//a questa velocita il carro è fermo
var DELTA_VELOCITA=40; //incremento/decremento di velocita per ogni AUMENTO/DIMINUISCO di manetta
var STOP=0;
var ultimaDirezioneSX;
var ultimaDirezioneDX;
//imposto frequenza a 2KHz
//MOTORE_SX_FORWARD.pwmFrequency(2000);
//MOTORE_SX_BACKWARD.pwmFrequency(2000);


var LISTA_AZIONI_CARRO=null;
var REGISTRAZIONE=false;
var RIPRODUZIONE=false;
var TIMER_REGISTRAZIONE=null;//è il timer che lancia la funzione di Riproduzione Azioni
// =======================
// Configurazione LOG4J ============
// =======================
log4js.configure({
    appenders: [
        {type: 'file', filename: 'rasppi3-gestione-carroarmato.log', category: 'rasppi3-gestione-carroarmato'}
    ],
    replaceConsole: false/* se true il console.log viene disabilitato.*/
});
var logger = log4js.getLogger('rasppi3-gestione-carroarmato');
logger.setLevel('DEBUG');
// ===================================
// Implementazione metodi REST =======
// ===================================

app.get('/motore', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
    var esito={};
	var checkDirezione=req.query.direzione=='AVANTI' || req.query.direzione=='INDIETRO';
	var checkVerso=req.query.verso=='SX' || req.query.verso=='DX'|| req.query.verso=='DRITTO';
	var checkStep=Number(req.query.step)>=1 || Number(req.query.step)<=5;
	var cambioDirezionePermesso=true;
	if(checkDirezione && checkVerso && checkStep){
		if(req.query.verso=='SX'){
			if((req.query.direzione=='AVANTI' && ultimaDirezioneSX =='INDIETRO') &&
			   (req.query.direzione=='INDIETRO' && ultimaDirezioneSX =='AVANTI')
			){
				cambioDirezionePermesso=false;	
			}else{
				ultimaDirezioneSX=req.query.direzione;
			}
		}else if(req.query.verso=='DX'){
			if((req.query.direzione=='AVANTI' && ultimaDirezioneDX =='INDIETRO') &&
			   (req.query.direzione=='INDIETRO' && ultimaDirezioneDX =='AVANTI')
			){
				cambioDirezionePermesso=false;	
			}else{
				ultimaDirezioneDX=req.query.direzione;
			}
		}
	}
	
	if(cambioDirezionePermesso){
		if(req.query.manetta=='AUMENTA'){ 
			esito = aumentaManetta(req.query.direzione,req.query.verso,req.query.step);
			esito.codErr='200';	
			esito.stepImpostato=req.query.step;
			res.json(esito);
		}else if(req.query.manetta=='DIMINUISCI'){ 
			esito = diminuisciManetta(req.query.direzione,req.query.verso,req.query.step);
			esito.codErr='200';	
			esito.stepImpostato=req.query.step;
			res.json(esito);
		}else{
			res.json({
					  esito: 'KO',
					  codErr: 500,
					  messaggio: 
					  'specificare direzione:[AVANTI/INDIETRO] manetta:[AUMENTA/DIMINUISCI] verso[SX/DX/DRITTO] e step[1..5].'+
					  'esempio: /motore?direzione=AVANTI&manetta=AUMENTA&verso=SX&step=1'
				});
		}			
	}else{
		//non posso passare repentinamente da AVANTI a INDIETRO e viceversa
		res.json({
			  esito: 'KO',
			  codErr: 500,
			  messaggio: 
			  'Prima di invertire senso di marcia azzerare il motore'
		});		
	}
})

app.get('/stopCarro', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
    ultimaDirezioneSX=null;
	ultimaDirezioneDX=null;
	var checkVerso=req.query.verso=='SX' || req.query.verso=='DX'|| req.query.verso=='DRITTO';
	var esito={};
	if(checkVerso){
	  spegniMotore(req.query.verso);
	  esito.codErr='200';	
	}else{
		esito.codErr='500';
		esito.messaggio='specificare verso SX o DX'+
		 'esempio: /stopCarro?verso=SX';
	}
	res.json(esito);
})
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

app.get('/cancellaRegistrazione', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	if(TIMER_REGISTRAZIONE){
		clearTimeout(TIMER_REGISTRAZIONE);
	}
	LISTA_AZIONI_CARRO=null;
	REGISTRAZIONE=false;
	var esito={};
	esito.registrazione='OFF';
	esito.messaggio='registrazione cancellata';
	res.json(esito);
})
/**
	Riproduce le azioni registrate
**/
app.get('/riproduci', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	var esito={};
	if(RIPRODUZIONE){
		esito.messaggio='riproduzione già avviata';
		esito.listaAzioni=LISTA_AZIONI_CARRO;
	}else{
		esito.messaggio='avviata riproduzione in backgroud';
		esito.listaAzioni=LISTA_AZIONI_CARRO;
		esegueAzioni();		
	}
	res.json(esito);
})


app.get('/luci', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
    var esito={};
	if(req.query.stato=='ACCESE'){ 
		esito = accendiLuci();
		esito.codErr='200';	
		res.json(esito);
	}else if(req.query.stato=='SPENTE'){ 
		esito = spegniLuci();
		esito.codErr='200';	
		res.json(esito);
	}else{
		res.json({
				  esito: 'KO',
				  codErr: 500,
				  messaggio: 
				  'specificare stato: [ACCESE/SPENTE].'+
          'esempio: /luci?stato=ACCESE'
			});
    }	
})
// ==================================================
// Implementazione metodi per gestione MOTORE =======
// ==================================================
function aumentaManetta(direzione,verso,step){
  logger.debug('aumento manetta. Direzione='+direzione+' verso='+verso+' step='+step);
  var esito ={};
  var velocitaVerso;
  var spegnimentoForzato=false;
  if(verso=='SX'){
	 velocitaVerso = getVelocitaMotoreSX(direzione);
  }else if(verso=='DX'){
	 velocitaVerso =getVelocitaMotoreDX(direzione); 
  }else if(verso=='DRITTO'){
	  var vdx=getVelocitaMotoreDX(direzione);
	  var vsx=getVelocitaMotoreSX(direzione);
	  if(vdx!=vsx){
		//Fermo il motore
		spegnimentoForzato=true;
		spegniMotore(verso);
		esito.msg='NON aumento la manetta\n i motori viaggiano a velocita diversa\n FORZO spegnimento motore';
		esito.direzione=direzione;
		esito.verso=verso;
	  }else{
		  velocitaVerso=vdx;
	  }
  }
  if(!spegnimentoForzato){
	  if (velocitaVerso >= 255 || (velocitaVerso + (DELTA_VELOCITA*step) >=255)) {
		 esito=muoviMotore(255,direzione,verso);
		 esito.msg='raggiunta velocita massima';
	  }else{
		  velocitaVerso += (DELTA_VELOCITA*step);
		  esito=muoviMotore(velocitaVerso,direzione,verso);
		  esito.msg='aumentata la manetta';
	  }	  
  }
  return esito;
}
function diminuisciManetta(direzione,verso,step){
  logger.debug('diminuisco manetta. Direzione='+direzione+' verso='+verso+' step='+step);
  var esito ={};
  var velocitaVerso;
  var spegnimentoForzato=false;
  if(verso=='SX'){
	 velocitaVerso = getVelocitaMotoreSX(direzione);
  }else if(verso=='DX'){
	 velocitaVerso =getVelocitaMotoreDX(direzione); 
  }else if(verso=='DRITTO'){
	  var vdx=getVelocitaMotoreDX(direzione);
	  var vsx=getVelocitaMotoreSX(direzione);
	  if(vdx!=vsx){
		//Fermo il motore
		spegnimentoForzato=true;
		spegniMotore(verso);
		esito.msg='NON diminusco la manetta\n i motori viaggiano a velocita diversa\n FORZO spegnimento motore';
		esito.direzione=direzione;
		esito.verso=verso;
	  }else{
		  velocitaVerso=vdx;
	  }
  }
  if(!spegnimentoForzato){
	  if (velocitaVerso == VELOCITA_ZERO || (velocitaVerso - (DELTA_VELOCITA*step) <=VELOCITA_ZERO)) {
		velocitaVerso=VELOCITA_ZERO;	  	
		esito=muoviMotore(STOP,direzione,verso);
		esito.msg='motore fermo';
	  }else{
		  velocitaVerso -= (DELTA_VELOCITA*step);
		  esito=muoviMotore(velocitaVerso,direzione,verso);
		  esito.msg='diminuita la manetta';
	  }	  
  }
   return esito;	
}
function getVelocitaMotoreSX(direzione){
	logger.debug('START getVelocitaMotoreSX, direzione = '+direzione); 
	var velocitaCalcolata;
	if(direzione=='AVANTI'){
		velocitaCalcolata=MOTORE_SX_FORWARD.getPwmDutyCycle();
		if(velocitaCalcolata<=VELOCITA_ZERO){//velocita minima piu bassa il motore non si muove
			velocitaCalcolata=VELOCITA_ZERO;
		}
	}else if (direzione=='INDIETRO'){
		velocitaCalcolata=MOTORE_SX_BACKWARD.getPwmDutyCycle();
		if(velocitaCalcolata<=VELOCITA_ZERO){
			velocitaCalcolata=VELOCITA_ZERO;
		}
	}
	logger.debug('END getVelocitaMotoreSX');
	return velocitaCalcolata;
}

function getVelocitaMotoreDX(direzione){
	logger.debug('START getVelocitaMotoreDX, direzione = '+direzione); 
	var velocitaCalcolata;
	if(direzione=='AVANTI'){
		velocitaCalcolata=MOTORE_DX_FORWARD.getPwmDutyCycle();
		if(velocitaCalcolata<=VELOCITA_ZERO){//velocita minima piu bassa il motore non si muove
			velocitaCalcolata=VELOCITA_ZERO;
		}
	}else if (direzione=='INDIETRO'){
		velocitaCalcolata=MOTORE_DX_BACKWARD.getPwmDutyCycle();
		if(velocitaCalcolata<=VELOCITA_ZERO){
			velocitaCalcolata=VELOCITA_ZERO;
		}
	}
	logger.debug('END getVelocitaMotoreDX'); 
	return velocitaCalcolata;	
}
/**
	Spegne il motore SX,DX oppure Entrambi
**/
function spegniMotore(verso){
	logger.debug('spengo il motore..'+verso);
	if(REGISTRAZIONE){
		registraAzioniCarro(verso,STOP,null);
	}
    if(verso=='SX'){
		MOTORE_SX_FORWARD.pwmWrite(STOP); 
		MOTORE_SX_BACKWARD.pwmWrite(STOP);
	}else if(verso=='DX'){
		MOTORE_DX_FORWARD.pwmWrite(STOP); 
		MOTORE_DX_BACKWARD.pwmWrite(STOP);	
	}else {
		MOTORE_SX_FORWARD.pwmWrite(STOP); 
		MOTORE_SX_BACKWARD.pwmWrite(STOP);
		MOTORE_DX_FORWARD.pwmWrite(STOP); 
		MOTORE_DX_BACKWARD.pwmWrite(STOP);	
	}	
	logger.debug('spento.');
}
/**
	Funzione core 
	per muovere il motore SX,DX o DRITTO
**/
function muoviMotore(velocitaImpostata,direzione,verso){
	logger.debug('muoviMotore START-> direzione:'+direzione+' verso='+verso);
	logger.debug('..velocitaImpostata '+ velocitaImpostata);
	var esito ={};
    var velocitaFisicaImpostataSX,velocitaFisicaImpostataDX,direzioneSX,direzioneDX;
	if(REGISTRAZIONE){
		registraAzioniCarro(verso,velocitaImpostata,direzione);
	}
	if(direzione=='AVANTI'){
		if(verso=='SX'){
			MOTORE_SX_FORWARD.pwmWrite(velocitaImpostata); 	
			velocitaFisicaImpostataSX=MOTORE_SX_FORWARD.getPwmDutyCycle();
			velocitaFisicaImpostataDX=MOTORE_DX_FORWARD.getPwmDutyCycle();	
			direzioneSX=direzione;
		}else if(verso=='DX'){
			MOTORE_DX_FORWARD.pwmWrite(velocitaImpostata); 			
			velocitaFisicaImpostataSX=MOTORE_SX_FORWARD.getPwmDutyCycle();
			velocitaFisicaImpostataDX=MOTORE_DX_FORWARD.getPwmDutyCycle();						
		}else if(verso=='DRITTO'){
			MOTORE_SX_FORWARD.pwmWrite(velocitaImpostata); 	
			MOTORE_DX_FORWARD.pwmWrite(velocitaImpostata); 			
			velocitaFisicaImpostataSX=MOTORE_SX_FORWARD.getPwmDutyCycle();
			velocitaFisicaImpostataDX=MOTORE_DX_FORWARD.getPwmDutyCycle();			
		}
	}else if(direzione=='INDIETRO'){
		if(verso=='SX'){
			MOTORE_SX_BACKWARD.pwmWrite(velocitaImpostata);
			velocitaFisicaImpostataSX=MOTORE_SX_BACKWARD.getPwmDutyCycle();
			velocitaFisicaImpostataDX=MOTORE_DX_BACKWARD.getPwmDutyCycle();					
		}else if(verso=='DX'){
			MOTORE_DX_BACKWARD.pwmWrite(velocitaImpostata);
			velocitaFisicaImpostataSX=MOTORE_SX_BACKWARD.getPwmDutyCycle();
			velocitaFisicaImpostataDX=MOTORE_DX_BACKWARD.getPwmDutyCycle();					
		}else if(verso=='DRITTO'){
			MOTORE_SX_BACKWARD.pwmWrite(velocitaImpostata);
			MOTORE_DX_BACKWARD.pwmWrite(velocitaImpostata);
			velocitaFisicaImpostataSX=MOTORE_SX_BACKWARD.getPwmDutyCycle();
			velocitaFisicaImpostataDX=MOTORE_DX_BACKWARD.getPwmDutyCycle();		
		}	
	}
	esito.stepManetta=DELTA_VELOCITA;
	esito.velocitaFisicaMotoreSX=velocitaFisicaImpostataSX;
	esito.velocitaFisicaMotoreDX=velocitaFisicaImpostataDX;	  
	esito.direzioneMotoreSX = ultimaDirezioneSX;
	esito.direzioneMotoreDX = ultimaDirezioneDX;
	logger.debug('muoviMotore END');
	return esito;
}
/**
	Memorizza le azioni del carro armato
	motore pu? assumere i seguenti valori:
		SX;
		DX;
		DRITTO.
**/
function registraAzioniCarro(motore,velocita,direzione){
	if(LISTA_AZIONI_CARRO){
		if(LISTA_AZIONI_CARRO.length>0){
			LISTA_AZIONI_CARRO[LISTA_AZIONI_CARRO.length-1].fine=Date.now();
		}		
		var azioneCarro={};
		azioneCarro.motore=motore;
		azioneCarro.velocita=velocita;
		azioneCarro.direzione=direzione;
		azioneCarro.inizio=Date.now();
		LISTA_AZIONI_CARRO.push(azioneCarro);		
	}
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
  var esito ={};
  if(!REGISTRAZIONE){
	var azioneCorrente = popAzione();
	if(azioneCorrente){
		if(azioneCorrente.motore=='DRITTO'  && azioneCorrente.velocita==STOP){
			//sto chiedendo di fermare il carro
			spegniMotore('DRITTO');
		}else{
		    muoviMotore(azioneCorrente.velocita,azioneCorrente.direzione,azioneCorrente.motore);
		}
		clearTimeout(TIMER_REGISTRAZIONE);
		if (!azioneCorrente.ultimaAzione){//esegue la prossima azione tra N millisecondi
		  TIMER_REGISTRAZIONE = setTimeout(esegueAzioni, (azioneCorrente.fine-azioneCorrente.inizio));	  		  			
		}		
	}	
  }
}


function accendiLuci(){
  var esito ={};
  LUCI_SX.pwmWrite(255);
  LUCI_DX.pwmWrite(255);
  esito.statoLuci='ACCESE';
  return esito;  
}

function spegniLuci(){
  var esito ={};
  LUCI_SX.pwmWrite(0);
  LUCI_DX.pwmWrite(0);
  esito.statoLuci='SPENTE';
  return esito;  
}


//===============================================

var server = http.createServer(app);

//Gestisco evento di shutdown del server nodejs..
/*server.on('close', function() {
  logger.debug(' spengo il carroMecucinu ...');
});*/

//con questo metodo forzo la chiusura di eventuali eventi (timer, ecc.)
process.on('SIGINT', function() {
  logger.debug(' spengo il Carro ...');
  spegniMotore('DRITTO');
  console.log(' eseguo il process.exit()..');
  process.exit(0);
});

server.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  logger.debug("rasppi3-gestione-carroarmato in ascolto su -> http://%s:%s", host, port);
});