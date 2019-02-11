/* libreria 
https://svgjs.com
 */
//Area di disegno SVG
var canvas = SVG('drawing').viewbox(0, 0,1000,500);
/* Titolo sopra il cruscotto */
var titolo = canvas.text('Carro Armato- BI MAZZU A TUTTI BASTADDI');
titolo.move(210,40).font({ fill: 'orange', family: 'verdana' });
var labelRegistraAzione=canvas.text('REGISTRA AZIONI OFF');
labelRegistraAzione.move(210,70).font({size: 8, fill: 'red', family: 'verdana' });

var rHelp=canvas.text('R: avvia/stoppa registra azioni');
var pHelp=canvas.text('P: riproduci registrazione');
var kHelp=canvas.text('K: elimina registrazioni');

rHelp.move(0,200).font({size: 10, fill: 'white', family: 'verdana' });
pHelp.move(0,220).font({size: 10, fill: 'white', family: 'verdana' });
kHelp.move(0,240).font({size: 10, fill: 'white', family: 'verdana' });

var image = canvas.image('pierino.png', 300, 400).move(500,0);


//Input al servizio remoto del motore
var mainInServizioRemotoMotore= canvas.text('').move(420,90).font({size: 10, fill: 'white', family: 'verdana' });
//Output del servizio remoto del motore
var mainOutServizioRemotoMotore= canvas.text('').move(420,300).font({size: 10, fill: 'white', family: 'verdana' });

function stampaDatiInputServizioMotore(direzione,statoManetta,verso){
	mainInServizioRemotoMotore.text(direzione+"-"+statoManetta+"-"+verso);
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
			labelRegistraAzione.text('REGISTRA AZIONI '+risposta.registrazione);
			if (risposta.registrazione=='ON'){
				labelRegistraAzione.animate().attr({ fill: '#f06' }).loop();
			}else{
				labelRegistraAzione.stop();
				labelRegistraAzione.attr({ fill: 'red' })
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
			mainOutServizioRemotoMotore.text(risposta.messaggio);
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
  if(event.key=='q'){
	  alzaManettaDX();
  }else if(event.key=='a'){
	  abbassaManettaSX();
  }else if(event.key=='e'){
	  alzaManettaSX();
  }else if(event.key=='d'){
	  abbassaManettaDX();
  }else if(event.key=='w'){
	   alzaEntrambeManette(1);
  }else if(event.key=='s'){
	   abbassaEntrambeManette(1);
  }else if(event.key==' '){
	  azzeraManette();
  }else if(event.key=='r'){
	  registra();
  }else if(event.key=='p'){
	  riproduci();
  }else if(event.key=='k'){
	  cancellaRegistrazione();
  }else if(event.key=='F1'){
	  cancellaRegistrazione();
  }
});