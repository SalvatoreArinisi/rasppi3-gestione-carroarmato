//es:
// http://192.168.1.10:8080/motore?direzione=AVANTI&manetta=AUMENTA&verso=SX'
var urlMotoreCarroArmato = "http://192.168.1.10:8080/motore?";
var urlStopCarroArmato = "http://192.168.1.10:8080/stopCarro";



function setManettaCarro(direzione,statoManetta,verso){
	var response = jQuery.Deferred();
	$.ajax({
		type: "GET",
		url: urlMotoreCarroArmato+"direzione="+direzione+"&manetta="+statoManetta+"&verso="+verso,
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
	Ferma il Carro
	chiamata REST
*/

function stopCarro(){
	var response = jQuery.Deferred();
	$.ajax({
		type: "GET",
		url: urlStopCarroArmato,
		success: function(risposta) {
			response.resolve(risposta);
		},
		error: function(e) {
			 response.reject(e);
		}
	});
	return response.promise();
}
