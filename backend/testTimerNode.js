var myTimer;
var LISTA_AZIONI_CARRO=[];

function riproduciAzioni(){
	console.log("START "+Date.now());
	myTimer = setTimeout(myFunc, 2000, 'funky');
}


function myFunc(arg) {
  console.log(`arg was => ${arg}`);
  console.log("END "+Date.now());
  clearTimeout(myTimer);
  myTimer = setTimeout(myFunc, 2000, 'ripeto funky');
}

function registraAzioniCarro(motore,velocita,direzione){
	if(LISTA_AZIONI_CARRO && LISTA_AZIONI_CARRO.length>0){
		console.log("lunghezza array ="+LISTA_AZIONI_CARRO.length);
		LISTA_AZIONI_CARRO[LISTA_AZIONI_CARRO.length-1].fine=Date.now();
		console.log("estraggo elemento "+LISTA_AZIONI_CARRO[LISTA_AZIONI_CARRO.length-1].motore);
	}
	var inizio = Date.now();
	console.log("aggiungo "+motore+ 'inizio '+inizio);
	
	var azioneCarro={};
	azioneCarro.motore=motore;
	azioneCarro.velocita=velocita;
	azioneCarro.direzione=direzione;
	azioneCarro.inizio=inizio;
	LISTA_AZIONI_CARRO.push(azioneCarro);
}


function mainFunzione(){
 	
 	registraAzioniCarro('SX',80,'AVANTI');
	var i=0;
	while(i<99900000){
		i++;
	}
 	registraAzioniCarro('DX',30,'AVANTI');
	i=0;
	while(i<99100000){
		i++;
	}
 	registraAzioniCarro('DRITTO',0,null);
	i=0;
	while(i<99100000){
		i++;
	}
	
	if(LISTA_AZIONI_CARRO && LISTA_AZIONI_CARRO.length>0){
		LISTA_AZIONI_CARRO[LISTA_AZIONI_CARRO.length-1].fine=Date.now();
	}
	
   for(var x = 0; x < LISTA_AZIONI_CARRO.length;x++){
        console.log(LISTA_AZIONI_CARRO[x].motore);
		console.log(LISTA_AZIONI_CARRO[x].velocita);
		console.log(LISTA_AZIONI_CARRO[x].direzione);
		console.log('inizio '+LISTA_AZIONI_CARRO[x].inizio);
		console.log('fine '+LISTA_AZIONI_CARRO[x].fine);		
   }
}

mainFunzione();