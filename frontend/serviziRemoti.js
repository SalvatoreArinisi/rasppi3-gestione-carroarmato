//es:
// http://192.168.1.10:8080/motore?direzione=AVANTI&manetta=AUMENTA&verso=SX'
var urlMotoreTreninoAndrea = "http://192.168.1.10:8080/motore?";
var urlStopTreninoAndrea = "http://192.168.1.10:8080/stopTreno";



function setManettaTreno(direzione,statoManetta,verso){
	var response = jQuery.Deferred();
	$.ajax({
		type: "GET",
		url: urlMotoreTreninoAndrea+"direzione="+direzione+"&manetta="+statoManetta+"&verso="+verso,
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
	Ferma il treno tramite 
	chiamata REST
*/

function stopTreno(){
	var response = jQuery.Deferred();
	$.ajax({
		type: "GET",
		url: urlStopTreninoAndrea,
		success: function(risposta) {
			response.resolve(risposta);
		},
		error: function(e) {
			 response.reject(e);
		}
	});
	return response.promise();
}
