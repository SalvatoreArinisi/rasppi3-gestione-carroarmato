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


const VELOCITA_MINIMA=50;
var VELOCITA_DRITTA=VELOCITA_MINIMA;
var VELOCITA_SX=VELOCITA_MINIMA;
var VELOCITA_DX=VELOCITA_MINIMA;
var deltaVelocita=20; //incremento/decremento di velocita per ogni AUMENTO/DIMINUISCO di manetta
var direzioneTreno;
//imposto frequenza a 2KHz
//MOTORE_SX_FORWARD.pwmFrequency(2000);
//MOTORE_SX_BACKWARD.pwmFrequency(2000);

// =======================
// Configurazione LOG4J ============
// =======================
log4js.configure({
    appenders: [
        {type: 'file', filename: 'carroMecucinu-server.log', category: 'carroMecucinu-server'}
    ],
    replaceConsole: false/* se true il console.log viene disabilitato.*/
});
var logger = log4js.getLogger('carroMecucinu-server');
logger.setLevel('DEBUG');
// ===================================
// Implementazione metodi REST =======
// ===================================

app.get('/motore', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
    var esito={};
  direzioneTreno = req.query.direzione;
	var checkDirezione=req.query.direzione=='AVANTI' || req.query.direzione=='INDIETRO';
	var checkVerso=req.query.verso=='SX' || req.query.verso=='DX'|| req.query.verso=='DRITTO';
	
	if(checkDirezione && checkVerso && req.query.manetta=='AUMENTA'){ 
		esito = aumentaManetta(req.query.direzione,req.query.verso);
		esito.codErr='200';	
		res.json(esito);
	}else if(checkDirezione && checkVerso && req.query.manetta=='DIMINUISCI'){ 
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

app.get('/stopTreno', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
    var esito={};
		esito = spegniMotore();
		esito.codErr='200';	
		res.json(esito);
})
// ==================================================
// Implementazione metodi per gestione MOTORE =======
// ==================================================
function aumentaManetta(direzione,verso){
  logger.debug('aumento manetta. Direzione='+direzione+' velocita SX='+VELOCITA_SX+' velocita DX='+VELOCITA_SX+' verso='+verso);
  var esito ={};
  var velocitaVerso;
  if(verso=='SX'){
	 velocitaVerso = VELOCITA_SX;
  }else if(verso=='DX'){
	 velocitaVerso = VELOCITA_DX; 
  }else if(verso=='DRITTO'){
	 velocitaVerso= VELOCITA_DRITTA; 
  }

  if (velocitaVerso >= 255 || (velocitaVerso + deltaVelocita >=255)) {
     esito=muoviMotore(255,direzione,verso);
     esito.msg='raggiunta velocita massima';
	   esito.direzione=direzione;
	   esito.verso=verso;
  }else{
	  velocitaVerso += deltaVelocita;
	  //aggiorna variabile globale con la nuova velocita
	  if(verso=='SX'){
		 VELOCITA_SX=velocitaVerso;
	  }else if(verso=='DX'){
		 VELOCITA_DX=velocitaVerso; 
	  }else if(verso=='DRITTO'){
		 VELOCITA_DRITTA=velocitaVerso; 
		 VELOCITA_SX=velocitaVerso;
		 VELOCITA_DX=velocitaVerso; 
	  }	  
	  esito=muoviMotore(velocitaVerso,direzione,verso);
	  esito.msg='aumentata la manetta';
  }
  return esito;
}
function diminuisciManetta(direzione,verso){
  logger.debug('diminuisco manetta. Direzione='+direzione+' velocita SX='+VELOCITA_SX+' velocita DX='+VELOCITA_SX+' verso='+verso);
  var esito ={};
  var velocitaVerso;
  if(verso=='SX'){
	 velocitaVerso = VELOCITA_SX;
  }else if(verso=='DX'){
	 velocitaVerso = VELOCITA_DX; 
  }else if(verso=='DRITTO'){
	 velocitaVerso= VELOCITA_DRITTA; 
  }
  
  if (velocitaVerso == VELOCITA_MINIMA || (velocitaVerso - deltaVelocita <=VELOCITA_MINIMA)) {
    velocitaVerso=VELOCITA_MINIMA;
	//aggiorna variabile globale con la nuova velocita
	if(verso=='SX'){
		 VELOCITA_SX=velocitaVerso;
	}else if(verso=='DX'){
		 VELOCITA_DX=velocitaVerso; 
	}else if(verso=='DRITTO'){
		 VELOCITA_DRITTA=velocitaVerso; 
		 VELOCITA_SX=velocitaVerso;
		 VELOCITA_DX=velocitaVerso;
	}	  	
    esito=muoviMotore(0,direzione,verso);
    esito.msg='motore fermo';
  }else{
	  velocitaVerso -= deltaVelocita;
	  //aggiorna variabile globale con la nuova velocita
	  if(verso=='SX'){
		 VELOCITA_SX=velocitaVerso;
	  }else if(verso=='DX'){
		 VELOCITA_DX=velocitaVerso; 
	  }else if(verso=='DRITTO'){
		 VELOCITA_DRITTA=velocitaVerso; 
		 VELOCITA_SX=velocitaVerso;
		 VELOCITA_DX=velocitaVerso;
	  }	  	  
	  esito=muoviMotore(velocitaVerso,direzione,verso);
	  esito.msg='diminuita la manetta';
  }
   return esito;	
}
function spegniMotore(){
	logger.debug('spengo il motore..'); 
	MOTORE_SX_FORWARD.pwmWrite(0); 
    MOTORE_SX_BACKWARD.pwmWrite(0);
	MOTORE_DX_FORWARD.pwmWrite(0); 
    MOTORE_DX_BACKWARD.pwmWrite(0);	
	logger.debug('spento.');
}
function muoviMotore(velocitaImpostata,direzione,verso){
	logger.debug('muoviMotore START-> direzione:'+direzione+' velocita SX='+VELOCITA_SX+' velocita DX='+VELOCITA_SX+' verso='+verso);
	logger.debug('..velocitaImpostata '+velocitaImpostata);
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
	
	if(velocitaImpostata==0){
		if(verso=='SX'){
		  esito.velocitaFisicaMotoreSX=0;
		  esito.pwmMotoreFermoSX='<='+VELOCITA_MINIMA;
		  esito.pwmCalcolatoSX=0; 	
          esito.velocitaFisicaMotoreDX=velocitaFisicaImpostataDX;		  
		}else if(verso=='DX'){
		  esito.velocitaFisicaMotoreDX=0;
		  esito.pwmMotoreFermoDX='<='+VELOCITA_MINIMA;
		  esito.pwmCalcolatoDX=0;   		  
		  esito.velocitaFisicaMotoreSX=velocitaFisicaImpostataSX;
		}else if(verso=='DRITTO'){
		  esito.velocitaFisicaMotoreSX=0;	
		  esito.velocitaFisicaMotoreDX=0;
		  esito.pwmMotoreFermo='<='+VELOCITA_MINIMA;
		  esito.pwmCalcolato=0;    		  
		}	
		  esito.stepManetta=deltaVelocita;
				
	}else{
		if(verso=='SX'){
		  esito.velocitaFisicaMotoreSX=velocitaFisicaImpostataSX;		
		}else if(verso=='DX'){
		  esito.velocitaFisicaMotoreDX=velocitaFisicaImpostataDX;	  						
		}else if(verso=='DRITTO'){
		  esito.velocitaFisicaMotoreSX=velocitaFisicaImpostataSX;
		  esito.velocitaFisicaMotoreDX=velocitaFisicaImpostataDX;	  
		}			
		
	  esito.stepManetta=deltaVelocita;
	  esito.pwmMotoreFermo='<='+VELOCITA_MINIMA;
	  //pwmCalcolato rappresenta il PWM - il PWM minimo (es: pwm 70->pwmCalcolato = 70-50 = 20)
	  esito.pwmCalcolatoSX=velocitaFisicaImpostataSX-VELOCITA_MINIMA;
	  esito.pwmCalcolatoDX=velocitaFisicaImpostataDX-VELOCITA_MINIMA;
	}			 
	logger.debug('muoviMotore END');
	return esito;
}

function stopTreno(){
  var esito ={};
  	logger.debug('stopTreno START');
   	logger.debug('direzioneTreno ='+direzioneTreno);
  if(direzioneTreno=='AVANTI' || direzioneTreno =='INDIETRO'){
    //acquisisco velocita di una ruota(l'altra è uguale)
     var velocitaFisicaImpostata;
     velocitaFisicaImpostata=MOTORE_SX_FORWARD.getPwmDutyCycle();
     	logger.debug('velocitaFisicaImpostata = '+velocitaFisicaImpostata);
     for (var i=velocitaFisicaImpostata-1; i>=0; i--){
       logger.debug('imposto velocita ='+i+' direzione '+direzioneTreno);
       muoviMotore(i,direzioneTreno);
       for (var pausa=5000000; pausa >=0; pausa--){
         //pausa
       }
     }
  }
  	logger.debug('stopTreno END');
  VELOCITA_DRITTA=VELOCITA_MINIMA;
  VELOCITA_SX=VELOCITA_MINIMA;
  VELOCITA_DX=VELOCITA_MINIMA;
  esito.msg='treno fermato';
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
  spegniMotore();
  console.log(' eseguo il process.exit()..');
  process.exit(0);
});

server.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  logger.debug("TreninoAndrea in ascolto su -> http://%s:%s", host, port)
});

