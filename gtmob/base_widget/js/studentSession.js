$("#studentPage").live("pageshow",function(event){
	//document.getElementById("studentPageContent").innerHTML("");
});


function refresh(){
	console.log('Refresh Session');
	console.log(document.getElementsByName('sessionHeaderDiv'));
	
	if(document.getElementsByName('sessionHeaderDiv').length>0){
		
		var sessionHeader = document.getElementsByName('sessionHeaderDiv');
		var sessionID = sessionHeader[0].id;
		console.log(sessionID);
		
		$.ajax({
		url: "api/sessions/"+sessionID,
		context: document.body,
		type: 'GET',
		dataType: 'json',
		success: function(data){
			if(data == null || data.session == false)
			{
				console.log('Could Not Find Session');
			}
			else if(data.pollingquestion == false)
			{			
				console.log("Question not active");
				var d = new Date();
				document.getElementById("studentSessionDiv").html("");
				document.getElementById("studentSessionDiv").append("No Question Active. Press Refresh to Get New Question. "+d.getHours()+":"+d.getMinutes());
			}
			else
			{
				console.log('Question Active');
			}
		}
	});
		
		
	}
}

function joinSession(){
	console.log('Join Session');
	
	$.ajax({
		url: "api/sessions/"+document.getElementById("studentPageForm").elements["sessionID"].value,
		context: document.body,
		type: 'GET',
		dataType: 'json',
		success: function(data){
			console.log(data);
			var d = new Date();
			if(data == null || data.session == false){
				console.log('Could Not Find Session');
				alert("Session not found. Please try again. "+d.getHours()+":"+d.getMinutes());
			}
			else if(data.session.isopen=="0"){
				console.log('Session Found: '+data.session.id);
				
				var sessionHeader = $("<h2>", {
					id: 'sessionheader',
					text: "Session Joined: "+data.session.name+" [ID: "+data.session.id+"]"
				});


				
				var sessionHeaderDiv = $("<div>", {
					id: data.session.id,
					name: 'sessionHeaderDiv',
					"class": "ui-body ui-body-c"
				}).append(sessionHeader);
				
				var sessionDiv = $("<div>", {
					id: 'studentSessionDiv',
					"class": "ui-body ui-body-c",
					text: "Press Refresh to get new question."
				});
				
				
				$('#studentPageContent').html(sessionHeaderDiv);
				$('#studentPageContent').append(sessionDiv);
			}
			else
			{
				alert("Session has not been opened yet. "+d.getHours()+":"+d.getMinutes());
			}
		}
	});
}