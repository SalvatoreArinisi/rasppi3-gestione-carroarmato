/* libreria 
https://svgjs.com
 */
//Area di disegno SVG
var canvas = SVG('drawing').viewbox(0, 0,1000,500);
/* Titolo sopra il cruscotto */
var titolo = canvas.text('Cromwell tank');
titolo.move(500,40).font({ fill: 'orange', family: 'verdana' });
var image = canvas.image('pierino.png', 300, 400).move(500,0);

var labelRegistraAzione=canvas.text('REC OFF');
labelRegistraAzione.move(260,110).font({size: 8, fill: 'yellow', family: 'verdana' });
var statoRegistrazione=false;
var msgInputServizioMotore='';//in caso di registrazione attiva accodo i vari comandi in questa variabile

var labelAlzaManettaSX=canvas.text('e').move(175,120).font({size: 20, fill: 'gray', family: 'verdana' });
var labelAlzaManettaDX=canvas.text('q').move(360,120).font({size: 20, fill: 'gray', family: 'verdana' });
var labelAbbassaManettaSX=canvas.text('a').move(175,320).font({size: 20, fill: 'gray', family: 'verdana' });
var labelAbbassaManettaDX=canvas.text('d').move(360,320).font({size: 20, fill: 'gray', family: 'verdana' });

var VALORE_ALZA_MANETTA_SX='e';
var VALORE_ALZA_MANETTA_DX='q';

var rHelp=canvas.text('R: avvia/stoppa registra azioni');
var pHelp=canvas.text('P: riproduci registrazione');
var kHelp=canvas.text('K: elimina registrazioni');
var f1Help=canvas.text('F2: inverte comandi manette');

rHelp.move(0,10).font({size: 8, fill: 'white', family: 'verdana' });
pHelp.move(150,10).font({size: 8, fill: 'white', family: 'verdana' });
kHelp.move(280,10).font({size: 8, fill: 'white', family: 'verdana' });
f1Help.move(0,30).font({size: 8, fill: 'white', family: 'verdana' });

//Input al servizio remoto del motore
var mainInServizioRemotoMotore= canvas.text('').move(420,70).font({size: 5, fill: 'white', family: 'verdana' });
//Output del servizio remoto del motore
var mainOutServizioRemotoMotore= canvas.text('').move(500,300).font({size: 5, fill: 'white', family: 'verdana' });

var W_rilasciata=true;
var S_rilasciata=true;

function stampaDatiInputServizioMotore(direzione,statoManetta,verso){
	if(statoRegistrazione){
		msgInputServizioMotore=msgInputServizioMotore+direzione+"-"+statoManetta+"-"+verso+'\n';
		mainInServizioRemotoMotore.text(msgInputServizioMotore);
	}else{
		msgInputServizioMotore='';
		mainInServizioRemotoMotore.text(direzione+"-"+statoManetta+"-"+verso);
	}
	
}
function stampaDatiOutServizioMotore(risposta){
	var stepManetta='stepManettaMotore='+risposta.stepManetta+'\n';
	var velocitaFisicaMotoreSX='velocitaFisicaMotoreSX='+risposta.velocitaFisicaMotoreSX+'\n';
	var velocitaFisicaMotoreDX='velocitaFisicaMotoreDX='+risposta.velocitaFisicaMotoreDX+'\n';
	var direzioneMotoreSX='direzioneMotoreSX='+risposta.direzioneMotoreSX+'\n';
	var direzioneMotoreDX='direzioneMotoreDX='+risposta.direzioneMotoreDX+'\n';
	var stepImpostato='stepImpostato='+risposta.stepImpostato+'\n';
	var msg=stepManetta+velocitaFisicaMotoreSX+
			velocitaFisicaMotoreDX+
			direzioneMotoreSX+
			direzioneMotoreDX+
			stepImpostato+
			risposta.msg;
	mainOutServizioRemotoMotore.text(msg);
}

/**
	Avvia registrazione azioni
**/
function registra(){
	registraAzioni().
	then(
		function (risposta) 
		{	
			labelRegistraAzione.text('REC '+risposta.registrazione);
			if (risposta.registrazione=='ON'){
				labelRegistraAzione.animate().attr({ fill: '#f06' }).loop();
				statoRegistrazione=true;
			}else{
				labelRegistraAzione.stop();
				labelRegistraAzione.attr({ fill: 'red' })
				statoRegistrazione=false;
			}
		}, function (error) {
			mainOutServizioRemotoMotore.text('Errore chiamata\n'+error.url);
		});	
}

/**
	Avvia riproduzione azioni
**/
function riproduci(){
	riproduciAzioni().
	then(
		function (risposta) 
		{	
			var msg ='staiu riproducennu. Vadditi i log su u Raspberry piffauri';
			var listaAzioni=risposta.listaAzioni;
			/* for(var x = 0; x < listaAzioni.length;x++){
				 msg = msg +'vado a '+listaAzioni[x].motore+
						  ' con velocita '+ listaAzioni[x].velocita+' '+listaAzioni[x].direzione+
						  'per '+((listaAzioni[x].fine-listaAzioni[x].inizio)/1000)+' secondi \n';
				
			}*/
			mainOutServizioRemotoMotore.text(msg);
		}, function (error) {
			mainOutServizioRemotoMotore.text('Errore chiamata\n'+error.url);
		});	
}

/**
 Canella registrazione di azioni
**/
function cancellaRegistrazione(){
	cancellaAzioni().
	then(
		function (risposta) 
		{	
			mainOutServizioRemotoMotore.text(risposta.messaggio);
		}, function (error) {
			mainOutServizioRemotoMotore.text('Errore chiamata\n'+error.url);
		});	
	
}

 /*
	Gestione eventi della tastiera
*/
document.addEventListener("keydown", function(event) {
  if(event.key==VALORE_ALZA_MANETTA_DX){
	  alzaManettaDX(1);
  }else if(event.key=='a'){
		if(W_rilasciata){
			abbassaManettaSX(1);
		}else{
			if(STEP_SX>2){
			   abbassaManettaSX(1);
			}
		}	  	  
  }else if(event.key==VALORE_ALZA_MANETTA_SX){
	  alzaManettaSX(1);
  }else if(event.key=='d'){
		if(W_rilasciata){
			abbassaManettaDX(1);
		}else{
			if(STEP_DX>2){
			   abbassaManettaDX(1);
			}
		}	  		  
  }else if(event.key=='w'){
	   W_rilasciata=false;
	   alzaEntrambeManette(1);
  }else if(event.key=='s'){
	   S_rilasciata=false;
	   abbassaEntrambeManette(1);
  }else if(event.key==' '){
	  azzeraManette();
  }else if(event.key=='r'){
	  registra();
  }else if(event.key=='p'){
	  riproduci();
  }else if(event.key=='k'){
	  cancellaRegistrazione();
  }else if(event.key=='F2'){
	  VALORE_ALZA_MANETTA_SX=VALORE_ALZA_MANETTA_SX=='q'?'e':'q';
	  VALORE_ALZA_MANETTA_DX=VALORE_ALZA_MANETTA_DX=='e'?'q':'e';
	  labelAlzaManettaSX.text(VALORE_ALZA_MANETTA_SX);
	  labelAlzaManettaDX.text(VALORE_ALZA_MANETTA_DX);
  }
});

document.addEventListener("keyup", function(event) {
 if(event.key=='w'){
	   W_rilasciata=true;
	   azzeraManette();
  }else if(event.key=='s'){
	   S_rilasciata=true;
	   azzeraManette();
  }else if(event.key=='a'){
	if(W_rilasciata){
		azzeraManette();
	}else{
		alzaManettaSX(5);
	}
  }else if(event.key=='d'){
	if(W_rilasciata){
		azzeraManette();
	}else{
		alzaManettaDX(5);
	}
  }
});