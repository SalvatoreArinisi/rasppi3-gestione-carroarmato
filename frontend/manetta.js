/**
	Alza la sola manetta di Sinistra
**/
function alzaManettaSX(){
	if(!lockManettaSX && STEP_SX<5) {	
		toggleLockManetta('SX');
		ULTIMA_POS_MANETTA_SX = ULTIMA_POS_MANETTA_SX-deltaVariazioneManetta;
		STEP_SX++;
		stampaValorePosizioneManettaSX();
		manopolaSX.animate(200, '<>').move(190,ULTIMA_POS_MANETTA_SX);
		var direzione;
		var statoManettaSX;
		if(!raggiuntoLoZero(ULTIMA_POS_MANETTA_SX,'SX')){//se non ho ancora raggiunto lo zero
			if(ULTIMA_POS_MANETTA_SX>215){//sto andando indietro diminuendi velocita
				direzione='INDIETRO';
				statoManettaSX='DIMINUISCI';
			}else if(ULTIMA_POS_MANETTA_SX<215){//sto andando avanti aumentando velocita
				direzione='AVANTI';
				statoManettaSX='AUMENTA';
			}
			impostaManettaCarro(direzione,statoManettaSX,'SX',1);					
		}		
	}
}

/**
	Abbassa la sola manetta di Sinistra
**/
function abbassaManettaSX(){
	if(!lockManettaSX && STEP_SX>-5) {//massima posizione in basso della manetta
		toggleLockManetta('SX');
		ULTIMA_POS_MANETTA_SX = ULTIMA_POS_MANETTA_SX+deltaVariazioneManetta;
		STEP_SX--;
		stampaValorePosizioneManettaSX();
		manopolaSX.animate(200, '<>').move(190,ULTIMA_POS_MANETTA_SX);
		var direzione;
		var statoManettaSX;
		if(!raggiuntoLoZero(ULTIMA_POS_MANETTA_SX,'SX')){//se non ho ancora raggiunto lo zero
			if(ULTIMA_POS_MANETTA_SX>215){//sto andando indietro aumentando velocita
				direzione='INDIETRO';
				statoManettaSX='AUMENTA';
			}else if(ULTIMA_POS_MANETTA_SX<215){//sto andando avanti diminuendo velocita
				direzione='AVANTI';
				statoManettaSX='DIMINUISCI';
			}
			impostaManettaCarro(direzione,statoManettaSX,'SX',1);					
		}		
	}	
}

/**
	Alza la sola manetta di Destra
**/
function alzaManettaDX(){
	if(!lockManettaDX && STEP_DX<5) {
		toggleLockManetta('DX');
		ULTIMA_POS_MANETTA_DX = ULTIMA_POS_MANETTA_DX-deltaVariazioneManetta;
		STEP_DX++;
		stampaValorePosizioneManettaDX();
		manopolaDX.animate(200, '<>').move(310,ULTIMA_POS_MANETTA_DX);
		var direzione;
		var statoManettaDX;
		if(!raggiuntoLoZero(ULTIMA_POS_MANETTA_DX,'DX')){//se non ho ancora raggiunto lo zero
			if(ULTIMA_POS_MANETTA_DX>215){//sto andando indietro diminuendi velocita
				direzione='INDIETRO';
				statoManettaDX='DIMINUISCI';
			}else if(ULTIMA_POS_MANETTA_DX<215){//sto andando avanti aumentando velocita
				direzione='AVANTI';
				statoManettaDX='AUMENTA';
			}
			impostaManettaCarro(direzione,statoManettaDX,'DX',1);			
		}		
	}
}

/**
	Abbassa la sola manetta di Destra
**/
function abbassaManettaDX(){
	if(!lockManettaDX && STEP_DX>-5) {//massima posizione in basso della manetta
		toggleLockManetta('DX');
		ULTIMA_POS_MANETTA_DX = ULTIMA_POS_MANETTA_DX+deltaVariazioneManetta;
		STEP_DX--;
		stampaValorePosizioneManettaDX();
		manopolaDX.animate(200, '<>').move(310,ULTIMA_POS_MANETTA_DX);
		var direzione;
		var statoManettaDX;
		if(!raggiuntoLoZero(ULTIMA_POS_MANETTA_DX,'DX')){//se non ho ancora raggiunto lo zero
			if(ULTIMA_POS_MANETTA_DX>215){//sto andando indietro aumentando velocita
				direzione='INDIETRO';
				statoManettaDX='AUMENTA';
			}else if(ULTIMA_POS_MANETTA_DX<215){//sto andando avanti diminuendo velocita
				direzione='AVANTI';
				statoManettaDX='DIMINUISCI';
			}
			impostaManettaCarro(direzione,statoManettaDX,'DX',1);			
		}	
	}	
}

/**
	Alza entrambe le manette
**/
function alzaEntrambeManette(step){
	var stepCalcolato = step;
	if(STEP_SX!=STEP_DX){
		azzeraManette();//le parifico se sono diverse Portandole entrambe a zero
		stepCalcolato=2;//forzo lo step a 2
	}	
	if((!lockManettaDX && !lockManettaSX) && STEP_DX==STEP_SX && (STEP_DX*stepCalcolato)<5){
		//alzo tutte 2 le manette di TOT STEP
		toggleLockManetta('DX');
		toggleLockManetta('SX');
		ULTIMA_POS_MANETTA_DX = ULTIMA_POS_MANETTA_DX-(deltaVariazioneManetta*stepCalcolato);
		ULTIMA_POS_MANETTA_SX = ULTIMA_POS_MANETTA_SX-(deltaVariazioneManetta*stepCalcolato);
		STEP_DX = STEP_DX+stepCalcolato;
		STEP_SX = STEP_SX+stepCalcolato;
		stampaValorePosizioneManettaDX();
		stampaValorePosizioneManettaSX();
		manopolaSX.animate(200, '<>').move(190,ULTIMA_POS_MANETTA_SX);
		manopolaDX.animate(200, '<>').move(310,ULTIMA_POS_MANETTA_DX);
		var direzione;
		var statoManetta;			
		if(!raggiuntoLoZero(ULTIMA_POS_MANETTA_DX,'DRITTO')){//se non ho ancora raggiunto lo zero (la manetta a sinistra è uguale)
			if(ULTIMA_POS_MANETTA_DX>215){//sto andando indietro diminuendi velocita
				direzione='INDIETRO';
				statoManetta='DIMINUISCI';
			}else if(ULTIMA_POS_MANETTA_DX<215){//sto andando avanti aumentando velocita
				direzione='AVANTI';
				statoManetta='AUMENTA';
			}		
			impostaManettaCarro(direzione,statoManetta,'DRITTO',stepCalcolato);
		}
	}
}

function abbassaEntrambeManette(step){
	var stepCalcolato = step;
	if(STEP_SX!=STEP_DX){
		azzeraManette();//le parifico se sono diverse Portandole entrambe a zero
		stepCalcolato=2;//forzo lo step a 2
	}
	if((!lockManettaDX && !lockManettaSX) && STEP_DX==STEP_SX && (STEP_DX*stepCalcolato)>-5)
	{
	  toggleLockManetta('DX');
	   toggleLockManetta('SX');			
	   ULTIMA_POS_MANETTA_DX = ULTIMA_POS_MANETTA_DX+(deltaVariazioneManetta*stepCalcolato);
	   ULTIMA_POS_MANETTA_SX = ULTIMA_POS_MANETTA_SX+(deltaVariazioneManetta*stepCalcolato);
	   STEP_DX=STEP_DX-stepCalcolato;
	   STEP_SX=STEP_SX-stepCalcolato;
	   stampaValorePosizioneManettaDX();
	   stampaValorePosizioneManettaSX();
	   manopolaSX.animate(200, '<>').move(190,ULTIMA_POS_MANETTA_SX);
	   manopolaDX.animate(200, '<>').move(310,ULTIMA_POS_MANETTA_DX);
	   var direzione='AVANTI';
	   var statoManetta='AUMENTA';		
		if(!raggiuntoLoZero(ULTIMA_POS_MANETTA_DX,'DRITTO')){//se non ho ancora raggiunto lo zero (la manetta a sinistra è uguale)
			if(ULTIMA_POS_MANETTA_DX>215){//sto andando indietro aumentando velocita
				direzione='INDIETRO';
				statoManetta='AUMENTA';
			}else if(ULTIMA_POS_MANETTA_DX<215){//sto andando avanti diminuendo velocita
				direzione='AVANTI';
				statoManetta='DIMINUISCI';
			}
			impostaManettaCarro(direzione,statoManetta,'DRITTO',stepCalcolato);					
		}
	}
}
//Ferma il carro
function azzeraManette(){
	stopCarro('DRITTO');
	STEP_DX=0;
	STEP_SX=0;
	stampaValorePosizioneManettaDX();
	stampaValorePosizioneManettaSX();
	ULTIMA_POS_MANETTA_SX = 215;
	ULTIMA_POS_MANETTA_DX = 215;
	manopolaSX.animate(200, '<>').move(190,ULTIMA_POS_MANETTA_SX);
	manopolaDX.animate(200, '<>').move(310,ULTIMA_POS_MANETTA_DX);
}

 /*
	Gestione eventi della tastiera
*/
document.addEventListener("keydown", function(event) {
  if(event.which==Q){
	  alzaManettaDX();
  }else if(event.which==A){
	  abbassaManettaSX();
  }else if(event.which==E){
	  alzaManettaSX();
  }else if(event.which==D){
	  abbassaManettaDX();
  }else if(event.which==W){
	   alzaEntrambeManette(1);
  }else if(event.which==S){
	   abbassaEntrambeManette(1);
  }else if(event.which==SPAZIO){
	  azzeraManette();
  }
});