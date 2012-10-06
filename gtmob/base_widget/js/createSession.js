/*
Create Session Functions
*/

function addChoice(lastChild, fieldSetID) {
	var text,
		lastChildText = "";

	if (lastChild.className == "ui-controlgroup-controls" || lastChild === undefined || lastChild === null) {
		text = "1";
	} else {
		lastChildText = lastChild.id;
		text = parseInt(lastChildText) + 1;
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
	/* */
	var questions_div = document.getElementById("questions");
	var questions_nodes = questions_div.childNodes;
	//cast NodeList into Array
	questions_nodes = jQuery.makeArray(questions_nodes);
	//Remove first "Text" object of questions_nodes, leaving only the questions
	questions_nodes.shift();
	//The number of questions in the session
	var num_of_questions = questions_nodes.length;
	var questions_json_object = {};
	questions_json_object.questions_size = num_of_questions;
	questions_json_object.questions = [];
	
	for(i=0; i<num_of_questions; i++)
	{
		questions_json_object.questions.push({});
		//0 has the question heading. 1 gets the field set.
		//questions_nodes[i].childNodes[1].childNodes.length; 
		var radiobuttons_id = questions_nodes[i].childNodes[1].id; 
		var radio_buttons_array = document.getElementsByName(radiobuttons_id); 
		var choices = "";
		for(j = 0; j<radio_buttons_array.length; j++)
		{
			choices += radio_buttons_array[j].value + " ";	
		}
		var correctChoice = $("input[name*="+radiobuttons_id+"]:checked").attr("value");;
		questions_json_object.questions[i].correctChoice = correctChoice;
		questions_json_object.questions[i].choices = choices;
		console.log(questions_json_object.questions);
	}

	console.log(questions_json_object);
	
	$.ajax({
		url: "api/sessions/"+document.getElementById("createSessionForm").elements["session_key"].value,
		context: document.body,
		type: 'POST',
		success: function(data){
			$('#studentPageContent').html(data);
		}
	});
}
