/**
	Alza la sola manetta di Sinistra
**/
function alzaManettaSX(step){
	if(!lockManettaSX && (step==5 || (STEP_SX*step)<5)) {
		toggleLockManetta('SX');
		if(step==5){
			ULTIMA_POS_MANETTA_SX = 215-(deltaVariazioneManetta*step);
			STEP_SX = step;				
		}else if((STEP_SX*step)<5){
			ULTIMA_POS_MANETTA_SX = ULTIMA_POS_MANETTA_SX-(deltaVariazioneManetta*step);
			STEP_SX = STEP_SX+step;	
		}
		stampaValorePosizioneManettaSX();
		manopolaSX.animate(200, '<>').move(200,ULTIMA_POS_MANETTA_SX);
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
			impostaManettaCarro(direzione,statoManettaSX,'SX',step);					
		}		
	}
}

/**
	Abbassa la sola manetta di Sinistra.
	
	@param step 
		indica di quanti passi abbassare rispetto alla
		posizione attuale
		es: 
			la manetta si trova a STEP_SX = 3
			do un abbassa(2)
			significa che abbasso di ulteriori 2 step 
			quindi da 3 passo a 1
			
		uno step 5 abbasso al massimo.	
**/
function abbassaManettaSX(step){
	if(!lockManettaSX &&  (step==5 || (STEP_SX*step)>-5)) {//massima posizione in basso della manetta
		toggleLockManetta('SX');
		if(step==5){
			ULTIMA_POS_MANETTA_SX = 215+(deltaVariazioneManetta*step);
			STEP_SX = -step;				
		}else if((STEP_SX*step) >-5){
			ULTIMA_POS_MANETTA_SX = ULTIMA_POS_MANETTA_SX+(deltaVariazioneManetta*step);
			STEP_SX=STEP_SX-step;
		}				
		stampaValorePosizioneManettaSX();
		manopolaSX.animate(200, '<>').move(200,ULTIMA_POS_MANETTA_SX);
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
			impostaManettaCarro(direzione,statoManettaSX,'SX',step);					
		}		
	}	
}

/**
	Alza la sola manetta di Destra
**/
function alzaManettaDX(step){
	if(!lockManettaDX && (step==5 || (STEP_DX*step)<5)) {
		toggleLockManetta('DX');
		if(step==5){
			ULTIMA_POS_MANETTA_DX = 215-(deltaVariazioneManetta*step);
			STEP_DX = step;				
		}else if((STEP_DX*step)<5){
			ULTIMA_POS_MANETTA_DX = ULTIMA_POS_MANETTA_DX-(deltaVariazioneManetta*step);
			STEP_DX = STEP_DX+step;	
		}
		stampaValorePosizioneManettaDX();
		manopolaDX.animate(200, '<>').move(320,ULTIMA_POS_MANETTA_DX);
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
			impostaManettaCarro(direzione,statoManettaDX,'DX',step);			
		}		
	}
}

/**
	Abbassa la sola manetta di Destra
**/
function abbassaManettaDX(step){
	if(!lockManettaDX && (step==5 ||(STEP_DX*step)>-5)) {//massima posizione in basso della manetta
		toggleLockManetta('DX');
		if(step==5){
			ULTIMA_POS_MANETTA_DX = 215+(deltaVariazioneManetta*step);
			STEP_DX = -step;				
		}else if((STEP_DX*step)>-5){
			ULTIMA_POS_MANETTA_DX = ULTIMA_POS_MANETTA_DX+(deltaVariazioneManetta*step);
			STEP_DX=STEP_DX-step;
		}
		stampaValorePosizioneManettaDX();
		manopolaDX.animate(200, '<>').move(320,ULTIMA_POS_MANETTA_DX);
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
			impostaManettaCarro(direzione,statoManettaDX,'DX',step);			
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
		manopolaSX.animate(200, '<>').move(200,ULTIMA_POS_MANETTA_SX);
		manopolaDX.animate(200, '<>').move(320,ULTIMA_POS_MANETTA_DX);
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
	   manopolaSX.animate(200, '<>').move(200,ULTIMA_POS_MANETTA_SX);
	   manopolaDX.animate(200, '<>').move(320,ULTIMA_POS_MANETTA_DX);
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
	manopolaSX.animate(200, '<>').move(200,ULTIMA_POS_MANETTA_SX);
	manopolaDX.animate(200, '<>').move(320,ULTIMA_POS_MANETTA_DX);
}


