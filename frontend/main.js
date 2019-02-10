/* libreria 
https://svgjs.com
 */
//Area di disegno SVG
var canvas = SVG('drawing').size('100%', '100%').viewbox(100, 60,1100,400);
/* Titolo sopra il cruscotto */
var titolo = canvas.text('Carro Armato');
titolo.move(210,40).font({ fill: 'orange', family: 'verdana' });
var labelRegistraAzione=canvas.text('REGISTRA AZIONI OFF');
labelRegistraAzione.move(210,70).font({size: 10, fill: 'red', family: 'verdana' });
//Input al servizio remoto del motore
var mainInServizioRemotoMotore= canvas.text('nessuna input ancora inviato al server').move(420,100).font({size: 10, fill: 'white', family: 'verdana' });
//Output del servizio remoto del motore
var mainOutServizioRemotoMotore= canvas.text('nessuna risposta dal server ancora').move(420,140).font({size: 10, fill: 'white', family: 'verdana' });

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
