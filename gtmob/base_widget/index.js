/*
Create Session Functions
*/

function addChoice(lastChild, divName) {
	var text,
		lastChildText = "";

	if (lastChild === undefined || lastChild === null) {
		text = "A";
	} else {
		lastChildText = lastChild.id;
		text = String.fromCharCode(lastChildText.charCodeAt(0) + 1);
	}

	var	newChoiceInput = $("<input>", {
			type: "radio",
			name: divName,
			value: text
		}).after(text),

		newChoiceDiv = $("<div>", {
			id: text
		}).append(newChoiceInput);

	$("#" + divName).append(newChoiceDiv);
}

function removeLastChoice(divName) {
	$("#" + divName + " div:last-child").remove();
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

		newQuestionChoices = $("<ul>", {
			id: choicesID
		}),

		addChoiceBtn = $("<input>", {
			type: "button",
			"data-inline": "true",
			"data-theme": "b",
			"data-icon" : "plus",
			value: "Add Choice",
			click: function() {
				addChoice(document.getElementById(choicesID).lastChild, choicesID);
			}
		}),

		removeChoiceBtn = $("<input>", {
			type: "button",
			"data-inline": "true",
			"data-theme": "b",
			"data-icon" : "plus",
			value: "Remove Choice",
			click: function() {
				removeLastChoice(choicesID);
			}
		}),

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

		newQuestionDiv = $("<div>", {
			id: questionID
		}).append(newQuestionHeader, newQuestionChoices, addChoiceBtn, removeChoiceBtn, removeQuestionBtn);
	
	$("#" + divName).append(newQuestionDiv);
	
	newQuestionDiv.trigger("create");
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
