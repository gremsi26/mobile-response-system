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
	//questions_json_object.session = num_of_questions;
	questions_json_object.session = {};
	questions_json_object.session.name = document.getElementById("createSessionForm").elements["session_key"].value;
	questions_json_object.questions = [];
	
	for(i=0; i<num_of_questions; i++)
	{
		questions_json_object.questions.push({});
		//0 has the question heading. 1 gets the field set.
		//questions_nodes[i].childNodes[1].childNodes.length; 
		var radiobuttons_id = questions_nodes[i].childNodes[1].id; 
		var radio_buttons_array = document.getElementsByName(radiobuttons_id); 
		var correctChoice = $("input[name*="+radiobuttons_id+"]:checked").attr("value");
		
		
		questions_json_object.questions[i].id = questions_nodes[i].id.split("-")[1];
		questions_json_object.questions[i].numanswerchoices = radio_buttons_array[radio_buttons_array.length-1].value;
		questions_json_object.questions[i].correctanswerchoice = correctChoice;	
		questions_json_object.questions[i].incorrectpoints = '1';			
		questions_json_object.questions[i].correctpoints = '1';				
		questions_json_object.questions[i].ispolling = '0';		
		questions_json_object.questions[i].questionType = '0';
		/*
		var choices = "";
		for(j = 0; j<radio_buttons_array.length; j++)
		{
			choices += radio_buttons_array[j].value + " ";	
		}
		*/
		
		
		

		//console.log(questions_json_object.questions);
	} 

	console.log(questions_json_object);
	
	$.ajax({
		url: "api/sessions/"+document.getElementById("createSessionForm").elements["session_key"].value,
		context: document.body,
		type: 'PUT',
		data: questions_json_object,
		success: function(data){
			//$('#studentPageContent').html(data);
			alert('Session successfully saved');
		}
	});
}
