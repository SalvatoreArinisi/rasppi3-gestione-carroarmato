
/** 
	Gestisce animazione manetta SX e DX
*/
//alloggio manetta SX
canvas.rect(40,220).move(185, 120).fill('black').stroke({width:2, color:'orange'});
canvas.rect(20,200).move(195, 130).fill('black').stroke({width:1, color:'orange'});
//linea dello ZERO SX
canvas.rect(50,1).move(180, 230).fill('red').stroke({width:1, color:'red'});

//alloggio manetta DX
canvas.rect(40,220).move(305, 120).fill('black').stroke({width:2, color:'orange'});
canvas.rect(20,200).move(315, 130).fill('black').stroke({width:1, color:'orange'});

//linea dello ZERO DX
canvas.rect(50,1).move(300, 230).fill('red').stroke({width:1, color:'red'});


//memorizzo Posizione manetta SX
var ULTIMA_POS_MANETTA_SX=215;//215 è al centro manetta. Corrisponde allo ZERO
//memorizzo Posizione manetta DX
var ULTIMA_POS_MANETTA_DX=215;//215 è al centro manetta. Corrisponde allo ZERO
var deltaVariazioneManetta=20;
var STEP_SX=0;
var STEP_DX=0;




//manetta SX e DX
var manopolaSX=canvas.circle(30).fill('orange').stroke({width:3, color: 'blue',opacity: 1}).move(190, ULTIMA_POS_MANETTA_SX);
var manopolaDX=canvas.circle(30).fill('orange').stroke({width:3, color: 'blue',opacity: 1}).move(310, ULTIMA_POS_MANETTA_DX);

var labelAvantiSX = canvas.text('A');
labelAvantiSX.move(200,95).font({size: 20, fill: 'green', family: 'verdana' });
var labelIndietroSX = canvas.text('R');
labelIndietroSX.move(200,350).font({size: 20, fill: 'red', family: 'verdana' });

var labelAvantiDX = canvas.text('A');
labelAvantiDX.move(320,95).font({size: 20, fill: 'green', family: 'verdana' });
var labelIndietroDX = canvas.text('R');
labelIndietroDX.move(320,350).font({size: 20, fill: 'red', family: 'verdana' });


var labelManettaSX = canvas.text('Manetta SX');
labelManettaSX.move(135,220).font({size: 10, fill: 'orange', family: 'verdana' }).rotate(-90);
var labelManettaDX = canvas.text('Manetta DX');
labelManettaDX.move(255,220).font({size: 10, fill: 'orange', family: 'verdana' }).rotate(-90);

var labelValoreManettaDX = canvas.text(STEP_DX.toString()).move(320,390).font({size: 20, fill: 'white', family: 'verdana' });
var labelValoreManettaSX = canvas.text(STEP_SX.toString()).move(200,390).font({size: 20, fill: 'white', family: 'verdana' });

//Input al servizio remoto del motore
var inServizioRemotoMotore= canvas.text('nessuna input ancora inviato al server').move(420,100).font({size: 20, fill: 'white', family: 'verdana' });

//Output del servizio remoto del motore
var outServizioRemotoMotore= canvas.text('nessuna risposta dal server ancora').move(420,140).font({size: 20, fill: 'white', family: 'verdana' });

function alzaManettaSX(){
	if(ULTIMA_POS_MANETTA_SX<=115) {
		return;//sono gia al massimo alzata manetta sinistra
	}else{
		ULTIMA_POS_MANETTA_SX = ULTIMA_POS_MANETTA_SX-deltaVariazioneManetta;
		STEP_SX++;
		stampaValorePosizioneManettaSX();
		manopolaSX.animate(200, '<>').move(190,ULTIMA_POS_MANETTA_SX);
		var direzione='AVANTI';
		var statoManettaSX='AUMENTA';
		if(ULTIMA_POS_MANETTA_SX==215){//sono a meta quindi ZERO
			stopCarro();
			stampaDatiInputServizioMotore('STOP','','');
		}else{
			if(ULTIMA_POS_MANETTA_SX>215){//sto andando indietro diminuendi velocita
				direzione='INDIETRO';
				statoManettaSX='DIMINUISCI';
			}else if(ULTIMA_POS_MANETTA_SX<215){//sto andando avanti aumentando velocita
				direzione='AVANTI';
				statoManettaSX='AUMENTA';
			}
			stampaDatiInputServizioMotore(direzione,statoManettaSX,'SX');
			setManettaCarro(direzione,statoManettaSX,'SX').
				then(
					function (risposta) 
					{			
						stampaDatiOutServizioMotore(risposta);
					}, function (error) {
					   alert("Errore servizio remoto durante decelerazione "+errore);
					});					
		}		
	}
}

function abbassaManettaSX(){
	if(ULTIMA_POS_MANETTA_SX>=315) {//massima posizione in basso della manetta
		return;//sono gia al massimo abbassata manetta sinistra
	}else{
		ULTIMA_POS_MANETTA_SX = ULTIMA_POS_MANETTA_SX+deltaVariazioneManetta;
		STEP_SX--;
		stampaValorePosizioneManettaSX();
		manopolaSX.animate(200, '<>').move(190,ULTIMA_POS_MANETTA_SX);
		var direzione='AVANTI';
		var statoManettaSX='AUMENTA';
		if(ULTIMA_POS_MANETTA_SX==215){//sono a meta quindi ZERO
			stopCarro();
			stampaDatiInputServizioMotore('STOP','','');
		}else{
			if(ULTIMA_POS_MANETTA_SX>215){//sto andando indietro aumentando velocita
				direzione='INDIETRO';
				statoManettaSX='AUMENTA';
			}else if(ULTIMA_POS_MANETTA_SX<215){//sto andando avanti diminuendo velocita
				direzione='AVANTI';
				statoManettaSX='DIMINUISCI';
			}
			stampaDatiInputServizioMotore(direzione,statoManettaSX,'SX');
			setManettaCarro(direzione,statoManettaSX,'SX').
				then(
					function (risposta) 
					{			
						stampaDatiOutServizioMotore(risposta);
					}, function (error) {
					   alert("Errore servizio remoto durante decelerazione "+errore);
					});			
		}		
	}	
}
function alzaManettaDX(){
	if(ULTIMA_POS_MANETTA_DX<=115) {
		return;//sono gia al massimo alzata manetta sinistra
	}else{
		ULTIMA_POS_MANETTA_DX = ULTIMA_POS_MANETTA_DX-deltaVariazioneManetta;
		STEP_DX++;
		stampaValorePosizioneManettaDX();
		manopolaDX.animate(200, '<>').move(310,ULTIMA_POS_MANETTA_DX);
		var direzione='AVANTI';
		var statoManettaDX='AUMENTA';
		if(ULTIMA_POS_MANETTA_DX==215){//sono a meta quindi ZERO
			stopCarro();
			stampaDatiInputServizioMotore('STOP','','');
		}else{
			if(ULTIMA_POS_MANETTA_DX>215){//sto andando indietro diminuendi velocita
				direzione='INDIETRO';
				statoManettaDX='DIMINUISCI';
			}else if(ULTIMA_POS_MANETTA_DX<215){//sto andando avanti aumentando velocita
				direzione='AVANTI';
				statoManettaDX='AUMENTA';
			}
			stampaDatiInputServizioMotore(direzione,statoManettaDX,'DX');
			setManettaCarro(direzione,statoManettaDX,'DX').
				then(
					function (risposta) 
					{			
						stampaDatiOutServizioMotore(risposta);
					}, function (error) {
					   alert("Errore servizio remoto durante decelerazione "+errore);
					});							
		}		
	}
}

function abbassaManettaDX(){
	if(ULTIMA_POS_MANETTA_DX>=315) {//massima posizione in basso della manetta
		return;//sono gia al massimo abbassata manetta sinistra
	}else{
		ULTIMA_POS_MANETTA_DX = ULTIMA_POS_MANETTA_DX+deltaVariazioneManetta;
		STEP_DX--;
		stampaValorePosizioneManettaDX();
		manopolaDX.animate(200, '<>').move(310,ULTIMA_POS_MANETTA_DX);
		var direzione='AVANTI';
		var statoManettaDX='AUMENTA';
		if(ULTIMA_POS_MANETTA_DX==215){//sono a meta quindi ZERO
			stopCarro();
			stampaDatiInputServizioMotore('STOP','','');
		}else{
			if(ULTIMA_POS_MANETTA_DX>215){//sto andando indietro aumentando velocita
				direzione='INDIETRO';
				statoManettaDX='AUMENTA';
			}else if(ULTIMA_POS_MANETTA_DX<215){//sto andando avanti diminuendo velocita
				direzione='AVANTI';
				statoManettaDX='DIMINUISCI';
			}
			stampaDatiInputServizioMotore(direzione,statoManettaDX,'DX');
			setManettaCarro(direzione,statoManettaDX,'DX').
				then(
					function (risposta) 
					{			
						stampaDatiOutServizioMotore(risposta);
					}, function (error) {
					   alert("Errore servizio remoto durante decelerazione "+errore);
					});					
		}	
	}	
}
/**
	Alza le manette insieme
**/
function alzaManette(){
	if(STEP_SX<STEP_DX){
		//incremento la manetta di SX fino ad arrivare 
		//in pari con la manetta di DX
		while(STEP_SX<STEP_DX){
			alzaManettaSX();
		}
	}else if(STEP_DX<STEP_SX){
		//incremento la manetta di DX fino ad arrivare 
		//in pari con la manetta di SX
		while(STEP_DX<STEP_SX){
			alzaManettaDX();
		}		
	}else if(STEP_DX==STEP_SX && ULTIMA_POS_MANETTA_DX==ULTIMA_POS_MANETTA_SX){
		//alzo tutte 2 le manette
		if(ULTIMA_POS_MANETTA_DX<=115 || ULTIMA_POS_MANETTA_SX<=115) {
			return;//sono gia al massimo alzata manette
		}else{
			ULTIMA_POS_MANETTA_DX = ULTIMA_POS_MANETTA_DX-deltaVariazioneManetta;
			ULTIMA_POS_MANETTA_SX = ULTIMA_POS_MANETTA_SX-deltaVariazioneManetta;
			STEP_DX++;
			STEP_SX++;
			stampaValorePosizioneManettaDX();
			stampaValorePosizioneManettaSX();
			manopolaSX.animate(200, '<>').move(190,ULTIMA_POS_MANETTA_SX);
			manopolaDX.animate(200, '<>').move(310,ULTIMA_POS_MANETTA_DX);
			var direzione='AVANTI';
			var statoManetta='AUMENTA';			
			if(ULTIMA_POS_MANETTA_DX==215){//sono a meta quindi ZERO ULTIMA_POS_MANETTA_SX è uguale
				stopCarro();
				stampaDatiInputServizioMotore('STOP','','');
			}else{
				if(ULTIMA_POS_MANETTA_DX>215){//sto andando indietro diminuendi velocita
					direzione='INDIETRO';
					statoManetta='DIMINUISCI';
				}else if(ULTIMA_POS_MANETTA_DX<215){//sto andando avanti aumentando velocita
					direzione='AVANTI';
					statoManetta='AUMENTA';
				}		
				stampaDatiInputServizioMotore(direzione,statoManetta,'DRITTO');
				setManettaCarro(direzione,statoManetta,'DRITTO').
					then(
						function (risposta) 
						{			
							stampaDatiOutServizioMotore(risposta);
						}, function (error) {
						alert("Errore servizio remoto durante decelerazione "+errore);
					});					
				
			}
		}
	}
}
/**
	abbassa le manette insieme
**/
function abbassaManette(){
	if(STEP_SX>STEP_DX){
		//decremento la manetta di SX fino ad arrivare 
		//in pari con la manetta di DX
		while(STEP_SX>STEP_DX){
			abbassaManettaSX();
		}
	}else if(STEP_DX>STEP_SX){
		//decremento la manetta di DX fino ad arrivare 
		//in pari con la manetta di SX
		while(STEP_DX>STEP_SX){
			abbassaManettaDX();
		}		
	}else if(STEP_DX==STEP_SX && ULTIMA_POS_MANETTA_DX==ULTIMA_POS_MANETTA_SX){
		//abbasso tutte 2 le manette
		if(ULTIMA_POS_MANETTA_DX>=315 || ULTIMA_POS_MANETTA_SX>=315) {
			return;//sono gia al massimo abbassata manette
		}else{
			   ULTIMA_POS_MANETTA_DX = ULTIMA_POS_MANETTA_DX+deltaVariazioneManetta;
			   ULTIMA_POS_MANETTA_SX = ULTIMA_POS_MANETTA_SX+deltaVariazioneManetta;
			   STEP_DX--;
			   STEP_SX--;
			   stampaValorePosizioneManettaDX();
			   stampaValorePosizioneManettaSX();
			   manopolaSX.animate(200, '<>').move(190,ULTIMA_POS_MANETTA_SX);
			   manopolaDX.animate(200, '<>').move(310,ULTIMA_POS_MANETTA_DX);
			   var direzione='AVANTI';
			   var statoManetta='AUMENTA';		
				if(ULTIMA_POS_MANETTA_DX==215){//sono a meta quindi ZERO ULTIMA_POS_MANETTA_SX è uguale
					stopCarro();
					stampaDatiInputServizioMotore('STOP','','');
				}else{
					if(ULTIMA_POS_MANETTA_DX>215){//sto andando indietro aumentando velocita
						direzione='INDIETRO';
						statoManetta='AUMENTA';
					}else if(ULTIMA_POS_MANETTA_DX<215){//sto andando avanti diminuendo velocita
						direzione='AVANTI';
						statoManetta='DIMINUISCI';
					}
					stampaDatiInputServizioMotore(direzione,statoManetta,'DRITTO');
					setManettaCarro(direzione,statoManetta,'DRITTO').
						then(
							function (risposta) 
							{			
								stampaDatiOutServizioMotore(risposta);
							}, function (error) {
							alert("Errore servizio remoto durante decelerazione "+errore);
						});					
				}
		}
	}
}
//Ferma il carro
function azzeraManetta(){
	stopCarro();
	STEP_DX=0;
	STEP_SX=0;
	stampaValorePosizioneManettaDX();
	stampaValorePosizioneManettaSX();
	ULTIMA_POS_MANETTA_SX = 215;
	ULTIMA_POS_MANETTA_DX = 215;
	manopolaSX.animate(200, '<>').move(190,ULTIMA_POS_MANETTA_SX);
	manopolaDX.animate(200, '<>').move(310,ULTIMA_POS_MANETTA_DX);
}

function stampaDatiInputServizioMotore(direzione,statoManetta,verso){
	inServizioRemotoMotore.text(direzione+"-"+statoManetta+"-"+verso);
}
function stampaDatiOutServizioMotore(risposta){
	var pwmCalcolatoSX='pwmCalcolatoSX='+risposta.pwmCalcolatoSX+'\n';
	var pwmCalcolatoDX='pwmCalcolatoDX='+risposta.pwmCalcolatoDX+'\n';
	var stepManetta='stepManetta='+risposta.stepManetta+'\n';
	var pwmMotoreFermo='pwmMotoreFermo='+risposta.pwmMotoreFermo+'\n';
	var msg=pwmCalcolatoSX+pwmCalcolatoDX+stepManetta+pwmMotoreFermo+risposta.msg;
	
	outServizioRemotoMotore.text(msg);
}
function stampaValorePosizioneManettaSX(){
	labelValoreManettaSX.text(STEP_SX.toString());
}

function stampaValorePosizioneManettaDX(){
	labelValoreManettaDX.text(STEP_DX.toString());
}

 /*
	Gestione eventi della tastiera
*/
document.addEventListener("keydown", function(event) {
  /*
	87 -> w
	81 -> q
	69 -> e
	83 -> s
	68 -> d
	65 -> a
	32 ->barra spaziatrice
  */
  if(event.which=='81'){
	  alzaManettaSX();
  }else if(event.which=='65'){
	  abbassaManettaSX();
  }else if(event.which=='69'){
	  alzaManettaDX();
  }else if(event.which=='68'){
	  abbassaManettaDX();
  }else if(event.which=='87'){
	   alzaManette();
  }else if(event.which=='83'){
	  abbassaManette();
  }else if(event.which=='32'){
	  azzeraManetta();
  }
});