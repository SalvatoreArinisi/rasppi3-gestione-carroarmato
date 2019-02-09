//es:
// http://192.168.1.10:8080/motore?direzione=AVANTI&manetta=AUMENTA&verso=SX'
var urlMotoreCarroArmato = "http://95.234.98.36:8080/motore?";
var urlStopCarroArmato = "http://95.234.98.36:8080/stopCarro?";



function setManettaCarro(direzione,statoManetta,verso){
	var response = jQuery.Deferred();
	var urlDaChiamare=urlMotoreCarroArmato+"direzione="+direzione+"&manetta="+statoManetta+"&verso="+verso;
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
