/** 
	Costruzione manette sinista destra e rispettive label
*/

//alloggio manetta SX
canvas.rect(40,220).move(195, 120).fill('black').stroke({width:2, color:'orange'});
canvas.rect(20,200).move(205, 130).fill('black').stroke({width:1, color:'orange'});
//linea dello ZERO SX
canvas.rect(50,1).move(190, 230).fill('red').stroke({width:1, color:'red'});
//alloggio manetta DX
canvas.rect(40,220).move(315, 120).fill('black').stroke({width:2, color:'orange'});
canvas.rect(20,200).move(325, 130).fill('black').stroke({width:1, color:'orange'});
//linea dello ZERO DX
canvas.rect(50,1).move(310, 230).fill('red').stroke({width:1, color:'red'});
//memorizzo Posizione manetta SX
var ULTIMA_POS_MANETTA_SX=215;//215 è al centro manetta. Corrisponde allo ZERO
//memorizzo Posizione manetta DX
var ULTIMA_POS_MANETTA_DX=215;//215 è al centro manetta. Corrisponde allo ZERO
var deltaVariazioneManetta=20;
var STEP_SX=0;
var STEP_DX=0;
//variabili per la gestione del lock sulle 2 manette
var lockManettaSX=false;
var lockManettaDX=false;
//manopole SX e DX
var manopolaSX=canvas.circle(30).fill('orange').stroke({width:3, color: 'blue',opacity: 1}).move(200, ULTIMA_POS_MANETTA_SX);
var manopolaDX=canvas.circle(30).fill('orange').stroke({width:3, color: 'blue',opacity: 1}).move(320, ULTIMA_POS_MANETTA_DX);

var labelAvantiSX = canvas.text('A');
labelAvantiSX.move(210,95).font({size: 20, fill: 'green', family: 'verdana' });
var labelIndietroSX = canvas.text('R');
labelIndietroSX.move(210,350).font({size: 20, fill: 'red', family: 'verdana' });

var labelAvantiDX = canvas.text('A');
labelAvantiDX.move(330,95).font({size: 20, fill: 'green', family: 'verdana' });
var labelIndietroDX = canvas.text('R');
labelIndietroDX.move(330,350).font({size: 20, fill: 'red', family: 'verdana' });


var labelManettaSX = canvas.text('Manetta SX');
labelManettaSX.move(145,220).font({size: 10, fill: 'orange', family: 'verdana' }).rotate(-90);
var labelManettaDX = canvas.text('Manetta DX');
labelManettaDX.move(265,220).font({size: 10, fill: 'orange', family: 'verdana' }).rotate(-90);

var labelValoreManettaDX = canvas.text(STEP_DX.toString()).move(330,390).font({size: 20, fill: 'white', family: 'verdana' });
var labelValoreManettaSX = canvas.text(STEP_SX.toString()).move(210,390).font({size: 20, fill: 'white', family: 'verdana' });
  
/**
	Funzioni core per la gestione delle manette
**/

//Blocca/Sblocca una determinata manetta
function toggleLockManetta(manetta){
	var colore='gray';
	if(manetta=='SX'){
	  lockManettaSX=!lockManettaSX;
	  colore=lockManettaSX?'gray':'orange';
	  manopolaSX.fill(colore);
	}else if(manetta=='DX'){
		lockManettaDX=!lockManettaDX;
		colore=lockManettaDX?'gray':'orange';
		manopolaDX.fill(colore);
	}else if(manetta=='DRITTO'){
		lockManettaDX=!lockManettaDX;
		lockManettaSX=!lockManettaSX;
		colore=lockManettaDX?'gray':'orange';
		manopolaSX.fill(colore);
		manopolaDX.fill(colore);
	}
}

function stampaValorePosizioneManettaSX(){
	labelValoreManettaSX.text(STEP_SX.toString());
}

function stampaValorePosizioneManettaDX(){
	labelValoreManettaDX.text(STEP_DX.toString());
}

/**
	imposta il valore di una determinata manetta
	
	direzione:[AVANTI/INDIETRO]
	stato:[AUMENTA/DIMINUISCI]
	verso:[SX/DX/DRITTO]
	step:[da 1 a 5]
	
**/
function impostaManettaCarro(direzione,stato,verso,step){
	stampaDatiInputServizioMotore(direzione,stato,verso);
	if(step==null || step==undefined){
		step=1;
	}
	setManettaCarro(direzione,stato,verso,step).
	then(
		function (risposta) 
		{	
			toggleLockManetta(verso);
			stampaDatiOutServizioMotore(risposta);
		}, function (error) {
			toggleLockManetta(verso);
			mainOutServizioRemotoMotore.text('Errore chiamata\n'+error.url);
		});	
}
/**
	Verifica la posizione di una determinata manopola
	se viene raggiunta la posizione centrale
	viene stoppato il relativo motore
	
	La funzione restituisce true/false
**/
function raggiuntoLoZero(posizioneManopola,verso){
	var retVal=false;
	if(posizioneManopola==215){//sono a meta quindi ZERO
		stopCarro(verso);
		toggleLockManetta(verso);
		stampaDatiInputServizioMotore('studu i muturi','','');
		retVal=true;
	}	
	return retVal;
}
