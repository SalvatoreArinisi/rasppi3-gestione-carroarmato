
/** 
	Gestisce animazione manetta SX e DX
*/
//alloggio manetta SX
canvas.rect(40,220).move(185, 120).fill('black').stroke({width:2, color:'orange'});
canvas.rect(20,200).move(195, 130).fill('black').stroke({width:1, color:'orange'});

//alloggio manetta DX
canvas.rect(40,220).move(305, 120).fill('black').stroke({width:2, color:'orange'});
canvas.rect(20,200).move(315, 130).fill('black').stroke({width:1, color:'orange'});


//memorizzo Posizione manetta SX
var ultimaPosizioneManettaSX=215;//215 è al centro manetta. Corrisponde allo ZERO
var deltaVariazioneManetta=10;

//memorizzo Posizione manetta DX
var ultimaPosizioneManettaDX=215;//215 è al centro manetta. Corrisponde allo ZERO


//manetta SX e DX
var manopolaSX=canvas.circle(30).fill('orange').stroke({width:3, color: 'blue',opacity: 1}).move(190, ultimaPosizioneManettaSX);
var manopolaDX=canvas.circle(30).fill('orange').stroke({width:3, color: 'blue',opacity: 1}).move(310, ultimaPosizioneManettaDX);

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


function alzaManettaSX(){
	if(ultimaPosizioneManettaSX<=115) {
		return;//sono gia al massimo alzata manetta sinistra
	}else{
		ultimaPosizioneManettaSX = ultimaPosizioneManettaSX-deltaVariazioneManetta;
		manopolaSX.animate(200, '<>').move(190,ultimaPosizioneManettaSX);
		var direzione='AVANTI';
		var statoManettaSX='AUMENTA';
		if(ultimaPosizioneManettaSX==215){//sono a meta quindi ZERO
			stopTreno();
		}else if(ultimaPosizioneManettaSX>215){//sto andando indietro diminuendi velocita
			direzione='AVANTI';
			statoManettaSX='DIMINUISCI';
		}else if(ultimaPosizioneManettaSX<215){//sto andando avanti aumentando velocita
			direzione='AVANTI';
			statoManettaSX='AUMENTA';
		}
		setManettaTreno(direzione,statoManettaSX,'SX').
			then(
				function (risposta) 
				{			
					// console.log(JSON.stringify(risposta));
				}, function (error) {
				   alert("Errore servizio remoto durante decelerazione "+errore);
				});		
	}
}

function abbassaManettaSX(){
	if(ultimaPosizioneManettaSX>=315) {//massima posizione in basso della manetta
		return;//sono gia al massimo abbassata manetta sinistra
	}else{
		ultimaPosizioneManettaSX = ultimaPosizioneManettaSX+deltaVariazioneManetta;
		manopolaSX.animate(200, '<>').move(190,ultimaPosizioneManettaSX);
		var direzione='AVANTI';
		var statoManettaSX='AUMENTA';
		if(ultimaPosizioneManettaSX==215){//sono a meta quindi ZERO
			stopTreno();
		}else if(ultimaPosizioneManettaSX>215){//sto andando indietro aumentando velocita
			direzione='INDIETRO';
			statoManettaSX='AUMENTA';
		}else if(ultimaPosizioneManettaSX<215){//sto andando avanti diminuendo velocita
			direzione='AVANTI';
			statoManettaSX='DIMINUISCI';
		}
		setManettaTreno(direzione,statoManettaSX,'SX').
			then(
				function (risposta) 
				{			
					// console.log(JSON.stringify(risposta));
				}, function (error) {
				   alert("Errore servizio remoto durante decelerazione "+errore);
				});
	}	
}
function alzaManettaDX(){
	if(ultimaPosizioneManettaDX<=115) {
		return;//sono gia al massimo alzata manetta sinistra
	}else{
		ultimaPosizioneManettaDX = ultimaPosizioneManettaDX-deltaVariazioneManetta;
		manopolaDX.animate(200, '<>').move(310,ultimaPosizioneManettaDX);
		var direzione='AVANTI';
		var statoManettaDX='AUMENTA';
		if(ultimaPosizioneManettaDX==215){//sono a meta quindi ZERO
			stopTreno();
		}else if(ultimaPosizioneManettaDX>215){//sto andando indietro diminuendi velocita
			direzione='AVANTI';
			statoManettaDX='DIMINUISCI';
		}else if(ultimaPosizioneManettaDX<215){//sto andando avanti aumentando velocita
			direzione='AVANTI';
			statoManettaDX='AUMENTA';
		}
		setManettaTreno(direzione,statoManettaDX,'DX').
			then(
				function (risposta) 
				{			
					// console.log(JSON.stringify(risposta));
				}, function (error) {
				   alert("Errore servizio remoto durante decelerazione "+errore);
				});				
	}
}

function abbassaManettaDX(){
	if(ultimaPosizioneManettaDX>=315) {//massima posizione in basso della manetta
		return;//sono gia al massimo abbassata manetta sinistra
	}else{
		ultimaPosizioneManettaDX = ultimaPosizioneManettaDX+deltaVariazioneManetta;
		manopolaDX.animate(200, '<>').move(310,ultimaPosizioneManettaDX);
		var direzione='AVANTI';
		var statoManettaDX='AUMENTA';
		if(ultimaPosizioneManettaDX==215){//sono a meta quindi ZERO
			stopTreno();
		}else if(ultimaPosizioneManettaDX>215){//sto andando indietro aumentando velocita
			direzione='INDIETRO';
			statoManettaDX='AUMENTA';
		}else if(ultimaPosizioneManettaDX<215){//sto andando avanti diminuendo velocita
			direzione='AVANTI';
			statoManettaDX='DIMINUISCI';
		}
		setManettaTreno(direzione,statoManettaDX,'DX').
			then(
				function (risposta) 
				{			
					// console.log(JSON.stringify(risposta));
				}, function (error) {
				   alert("Errore servizio remoto durante decelerazione "+errore);
				});		
	}	
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
	   alzaManettaSX();
	   alzaManettaDX();
  }else if(event.which=='83'){
	   abbassaManettaSX();
	   abbassaManettaDX();
  }
});