//es:
// http://192.168.1.10:8080/motore?direzione=AVANTI&manetta=AUMENTA&verso=SX'
var indirizzoIP="localhost";
var urlMotoreCarroArmato = "http://"+indirizzoIP+":8080/motore?";
var urlStopCarroArmato = "http://"+indirizzoIP+":8080/stopCarro?";
var urlRegistra = "http://"+indirizzoIP+":8080/registra";
var urlRiproduci = "http://"+indirizzoIP+":8080/riproduci";
var urlCancellaRegistrazione = "http://"+indirizzoIP+":8080/cancellaRegistrazione";

/**
	Imposta manetta del Carro
**/
function setManettaCarro(direzione,statoManetta,verso,step){
	var response = jQuery.Deferred();
	var urlDaChiamare=urlMotoreCarroArmato+"direzione="+direzione+"&manetta="+statoManetta+"&verso="+verso+"&step="+step;
	$.ajax({
		type: "GET",
		url: urlDaChiamare,
		success: function(risposta) {
			response.resolve(risposta);
		},
		error: function(e) {
			 var esito={};
			 esito.errore=e;
			 esito.url=urlDaChiamare;
			 response.reject(esito);
		}
	});
	return response.promise();
}

/**
	Ferma il Carro
	chiamata REST
*/

function stopCarro(verso){
	var response = jQuery.Deferred();
	$.ajax({
		type: "GET",
		url: urlStopCarroArmato+"verso="+verso,
		success: function(risposta) {
			response.resolve(risposta);
		},
		error: function(e) {
			 response.reject(e);
		}
	});
	return response.promise();
}

/**
	Avvia registrazione azioni
**/
function registraAzioni(){
	var response = jQuery.Deferred();
	$.ajax({
		type: "GET",
		url: urlRegistra,
		success: function(risposta) {
			response.resolve(risposta);
		},
		error: function(e) {
			 response.reject(e);
		}
	});
	return response.promise();
}

/**
	Riproduci azioni
**/
function riproduciAzioni(){
	var response = jQuery.Deferred();
	$.ajax({
		type: "GET",
		url: urlRiproduci,
		success: function(risposta) {
			response.resolve(risposta);
		},
		error: function(e) {
			 response.reject(e);
		}
	});
	return response.promise();
}

/**
	Cancella  azioni registrate
**/
function cancellaAzioni(){
	var response = jQuery.Deferred();
	$.ajax({
		type: "GET",
		url: urlCancellaRegistrazione,
		success: function(risposta) {
			response.resolve(risposta);
		},
		error: function(e) {
			 response.reject(e);
		}
	});
	return response.promise();
}