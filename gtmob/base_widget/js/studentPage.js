
function refreshSession(){
	$.ajax({
		url: "api/sessions/"+document.getElementById("studentPageForm").elements["sessionID"].value,
		context: document.body,
		type: 'GET',
		success: function(data){
			var d = new Date();
			if(data == null || data.success == "false")
				$('#studentPageContent').append("No Question Active. "+d.getTime());
			if(data.success == "true")
				$('#studentPageContent').html(data);
		}
	});
}


function joinSession(){
	$.ajax({
		url: "api/sessions/"+document.getElementById("studentPageForm").elements["sessionID"].value,
		context: document.body,
		type: 'GET',
		success: function(data){
			var d = new Date();
			if(data == null || data.success == "false")
				$('#studentPageContent').append("Session not found. Please try again. "+d.getTime());
			if(data.success == "true")
				$('#studentPageContent').html(data);
		}
	});
}