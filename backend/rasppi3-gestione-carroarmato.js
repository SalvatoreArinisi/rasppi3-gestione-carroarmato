//====Modulo NODEJS Per controllo GPIO 
//== il modulo che gestisce il PWM (Pulse-width modulation)
//== E' un wrapper della  pigpio C library(che deve essere installata prima)
//=== Un limite della  pigpio C library e' che 
//=== puo' essere usata solo da un singolo processo attivo.
//== la libreria C e quindi anche il wrapper nodejs richiedono privilegi di root
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
	var cambioDirezionePermesso=true;
	if(checkDirezione && checkVerso){
		if(req.query.verso=='SX'){
			if((req.query.direzione=='AVANTI' && ultimaDirezioneSX =='INDIETRO') &&
			   (req.query.direzione=='INDIETRO' && ultimaDirezioneSX =='AVANTI')
			){
				cambioDirezionePermesso=false;	
			}
		}else if(req.query.verso=='DX'){
			if((req.query.direzione=='AVANTI' && ultimaDirezioneDX =='INDIETRO') &&
			   (req.query.direzione=='INDIETRO' && ultimaDirezioneDX =='AVANTI')
			){
				cambioDirezionePermesso=false;	
			}
		}
	}
	
	if(cambioDirezionePermesso){
		if(req.query.manetta=='AUMENTA'){ 
			esito = aumentaManetta(req.query.direzione,req.query.verso);
			esito.codErr='200';	
			res.json(esito);
		}else if(req.query.manetta=='DIMINUISCI'){ 
			esito = diminuisciManetta(req.query.direzione,req.query.verso);
			esito.codErr='200';	
			res.json(esito);
		}else{
			res.json({
					  esito: 'KO',
					  codErr: 500,
					  messaggio: 
					  'specificare direzione:[AVANTI/INDIETRO] manetta:[AUMENTA/DIMINUISCI] e verso[SX/DX/DRITTO].'+
					  'esempio: /motore?direzione=AVANTI&manetta=AUMENTA&verso=SX'
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
function aumentaManetta(direzione,verso){
  logger.debug('aumento manetta. Direzione='+direzione+' verso='+verso);
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
	  if (velocitaVerso >= 255 || (velocitaVerso + DELTA_VELOCITA >=255)) {
		 esito=muoviMotore(255,direzione,verso);
		 esito.msg='raggiunta velocita massima';
	  }else{
		  velocitaVerso += DELTA_VELOCITA;
		  esito=muoviMotore(velocitaVerso,direzione,verso);
		  esito.msg='aumentata la manetta';
	  }	  
  }
  return esito;
}
function diminuisciManetta(direzione,verso){
  logger.debug('diminuisco manetta. Direzione='+direzione+' verso='+verso);
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
	  if (velocitaVerso == VELOCITA_ZERO || (velocitaVerso - DELTA_VELOCITA <=VELOCITA_ZERO)) {
		velocitaVerso=VELOCITA_ZERO;	  	
		esito=muoviMotore(STOP,direzione,verso);
		esito.msg='motore fermo';
	  }else{
		  velocitaVerso -= DELTA_VELOCITA;
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

function spegniMotore(verso){
	logger.debug('spengo il motore..'+verso);
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
function muoviMotore(velocitaImpostata,direzione,verso){
	logger.debug('muoviMotore START-> direzione:'+direzione+' verso='+verso);
	logger.debug('..velocitaImpostata '+ velocitaImpostata);
	var esito ={};
  var velocitaFisicaImpostataSX,velocitaFisicaImpostataDX;
	if(direzione=='AVANTI'){
		if(verso=='SX'){
			MOTORE_SX_FORWARD.pwmWrite(velocitaImpostata); 	
			velocitaFisicaImpostataSX=MOTORE_SX_FORWARD.getPwmDutyCycle();
			velocitaFisicaImpostataDX=MOTORE_DX_FORWARD.getPwmDutyCycle();						
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
	//pwmCalcolato rappresenta il PWM - il PWM minimo o VELOCITA_ZERO (es: pwm 70->pwmCalcolato = 70-55 = 15)
	esito.pwmCalcolatoSX=velocitaFisicaImpostataSX-VELOCITA_ZERO;
	esito.pwmCalcolatoDX=velocitaFisicaImpostataDX-VELOCITA_ZERO;	
	esito.direzione = direzione;
	esito.verso = verso;
	logger.debug('muoviMotore END');
	return esito;
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
  logger.debug(' spengo il Trenino Andrea ...');
  spegniMotore('DRITTO');
  console.log(' eseguo il process.exit()..');
  process.exit(0);
});

server.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  logger.debug("TreninoAndrea in ascolto su -> http://%s:%s", host, port)
});

