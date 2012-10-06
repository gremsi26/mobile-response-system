/*
Create Session Functions
*/

function addChoice(lastChild, fieldSetID) {
	var text,
		lastChildText = "";

	if (lastChild.className == "ui-controlgroup-controls" || lastChild === undefined || lastChild === null) {
		text = "A";
	} else {
		lastChildText = lastChild.id;
		text = String.fromCharCode(lastChildText.charCodeAt(0) + 1);
	}

	var	newChoiceInput = $("<input>", {
			type: "radio",
			name: fieldSetID,
			value: text,
			id: text+"-input"
		}),

		newChoiceLabel = $("<label>",{
			"for": text+"-input"
		}).append(text),

		newChoiceDiv = $("<div>", {
			id: text,
			"class": "choice-div"
		}).append(newChoiceInput,newChoiceLabel);

	choicesFieldSet = $("#" + fieldSetID);
	choicesFieldSet.append(newChoiceDiv);
	choicesFieldSet.trigger("create");
}

function removeLastChoice(fieldSetID) {
	if(document.getElementById(fieldSetID).lastChild.className!="ui-controlgroup-controls"){
		console.log($(".choice-div", "#" + fieldSetID).last())
		$(".choice-div", "#" + fieldSetID).last().remove();
	}
}

function removeQuestion(divName) {
	$("#" + divName).remove();
}

function addQuestion(questionNumber, divName) {
	if (questionNumber === undefined) {
		questionNumber = 'question-0';
	}

	var questionInt = parseInt(questionNumber.split("-")[1], 10) + 1,
		questionID = "question-" + questionInt,

		newQuestionHeader = $("<h2>", {
			text: "Question " + questionInt
		}),

		choicesID = "q" + questionInt + "-choices",

		newQuestionChoices = $("<fieldSet>", {
			id: choicesID,
			"data-role": "controlgroup"
		}),

		addChoiceBtn = $("<input>", {
			type: "button",
			"data-inline": "true",
			"data-theme": "b",
			"data-icon" : "plus",
			value: "Choice",
			click: function() {
				addChoice(document.getElementById(choicesID).lastChild, choicesID);
			}
		}),

		removeChoiceBtn = $("<input>", {
			type: "button",
			"data-inline": "true",
			"data-theme": "a",
			"data-icon" : "minus",
			value: "Choice",
			click: function() {
				removeLastChoice(choicesID);
			}
		}),

		/*
		removeQuestionBtn = $("<input>", {
			type: "button",
			"data-inline": "true",
			"data-theme": "b",
			"data-icon" : "plus",
			value: "Remove Question",
			click: function() {
				removeQuestion(questionID);
			}
		}),
		*/

		newQuestionDiv = $("<div>", {
			id: questionID,
			"class": "ui-body ui-body-c"
		}).append(newQuestionHeader, newQuestionChoices, addChoiceBtn, removeChoiceBtn);
	
	$("#" + divName).append(newQuestionDiv);
	
	newQuestionDiv.trigger("create");
}

function saveSession(){
	console.log("HEY");
	/* */
	var questions_div = document.getElementById("questions");
	var questions_nodes = questions_div.childNodes;
	var num_of_questions = questions_div.childNodes.length;
	var questions_json_object = {};
	questions_json_object.questions_size = num_of_questions;
	questions_json_object.questions = [];
	questions_json_object.questions.push({});
	
	//start at 1 because some random obj is in position 0
	var position = 0;
	for(i=1; i<num_of_questions; i++)
	{
		//0 has the question heading. 1 gets the field set.
		//questions_nodes[i].childNodes[1].childNodes.length; 
		var radiobuttons_id = questions_nodes[i].childNodes[1].id; 
		var radio_buttons_array = document.getElementsByName(radiobuttons_id); 
		
		var choices = "";
		for(j = 0; j<radio_buttons_array.length; j++)
		{
			choices += radio_buttons_array[j].value + " ";
		
		console.log("I EQUALS: "+i);
		console.log(questions_json_object.questions[i-1]);
		
		questions_json_object.questions[i-1].correctChoice = 'A';
		questions_json_object.questions[i-1].choices = choices;
		position++;
		//pos
		}
	}
	
	$.ajax({
		url: "api/sessions/"+document.getElementById("createSessionForm").elements["session_key"].value,
		context: document.body,
		type: 'POST',
		success: function(data){
			$('#studentPageContent').html(data);
		}
	});
}

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


function professors(){
	$.ajax({
		url: "api/pagetype/professors",
		context: document.body,
		success: function(data){
			$('#formcontent').html(data);
		}
	});
}
function students(){
	$.ajax({
		url: "api/pagetype/students",
		context: document.body,
		success: function(data){
			$('#formcontent').html(data);
		}
	});
}
function simpleIndex(){
	$.ajax({
		url: "api/simple",
		context: document.body,
		success: function(data){
			$('#IndexResult').html(data);
		}
	});
}
function simpleGet(){
	$.ajax({
		url: "api/simple/testItemValue",
		context: document.body,
		success: function(data){
			$('#GetResult').html(data);
		}
	});
}
function simplePost(){
	$.ajax({
		url: "api/simple",
		data: {'itemValue': 'testItemValue'},
		context: document.body,
		type: 'POST',
		success: function(data){
			$('#PostResult').html(data);
		}
	});
}
function simplePut(){
	$.ajax({
		url: "api/simple/testItemValue",
		context: document.body,
		data: {'itemValue': 'testItemNewValue'},
		headers: {'X-HTTP-Method-Override': 'PUT'},
		type: 'POST',
		success: function(data){
			$('#PutResult').html(data);
		}
	});
}
function simpleDelete(){
	$.ajax({
		url: "api/simple/testItem",
		context: document.body,
		type: 'DELETE',
		success: function(data){
			$('#DeleteResult').html(data);
		}
	});
}
