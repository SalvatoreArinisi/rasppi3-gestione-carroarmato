var myTimer;
var LISTA_AZIONI_CARRO=[];
var REGISTRA=false;


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
  console.log("Start esegueAzioni ");
  if(!REGISTRA){
	  var azioneCorrente = popAzione();
	  
	  if(azioneCorrente.motore=='DRITTO'  && azioneCorrente.velocita==0){
		//sto chiedendo di fermare il carro
		fermaCarro();
		clearTimeout(myTimer);
	  }else if(azioneCorrente){
		  muoviCarro(azioneCorrente.motore,azioneCorrente.velocita,azioneCorrente.direzione);
		  clearTimeout(myTimer);
		  myTimer = setTimeout(esegueAzioni, (azioneCorrente.fine-azioneCorrente.inizio));	  		  
	  }else{
		console.log("Azioni terminate "+Date.now());  
	  }
  }else{
		console.log("stoppa prima la registrazione!");
  }
  console.log("End esegueAzioni");
}


function muoviCarro(motore,velocita,direzione){
	console.log("muovo carro "+motore+" "+velocita+" "+direzione+" -ISTANTE="+Date.now());
}

function fermaCarro(){
	console.log("FERMO il carro !");
}


function registraAzioniCarro(motore,velocita,direzione){
	if(LISTA_AZIONI_CARRO && LISTA_AZIONI_CARRO.length>0){
		LISTA_AZIONI_CARRO[LISTA_AZIONI_CARRO.length-1].fine=Date.now();
	}
	var inizio = Date.now();
	var azioneCarro={};
	azioneCarro.motore=motore;
	azioneCarro.velocita=velocita;
	azioneCarro.direzione=direzione;
	azioneCarro.inizio=inizio;
	LISTA_AZIONI_CARRO.push(azioneCarro);
}


function mainFunzione(){
 	REGISTRA=true;
 	registraAzioniCarro('SX',80,'AVANTI');
	var i=0;
	while(i<3996000000){
		i++;
	}
 	registraAzioniCarro('DX',30,'AVANTI');
	i=0;
	while(i<3996000000){
		i++;
	}
 	registraAzioniCarro('DRITTO',0,null);
	i=0;
	while(i<3996000000){
		i++;
	}
	
	if(LISTA_AZIONI_CARRO && LISTA_AZIONI_CARRO.length>0){
		LISTA_AZIONI_CARRO[LISTA_AZIONI_CARRO.length-1].ultimaAzione=true;
	}
	
   for(var x = 0; x < LISTA_AZIONI_CARRO.length;x++){
        var msg = 'motore '+LISTA_AZIONI_CARRO[x].motore+' velocita '+
				  LISTA_AZIONI_CARRO[x].velocita+' '+LISTA_AZIONI_CARRO[x].direzione+
				  ' inizio '+LISTA_AZIONI_CARRO[x].inizio+' fine '+
				  LISTA_AZIONI_CARRO[x].fine+' sec='+((LISTA_AZIONI_CARRO[x].fine-LISTA_AZIONI_CARRO[x].inizio)/1000)+
				  '(ultima azione='+(LISTA_AZIONI_CARRO[x].ultimaAzione?'si':'no')+')';
		
		console.log(msg);
   }
   REGISTRA=false;
   console.log("Play!!! "+Date.now());
   esegueAzioni();
}

mainFunzione();