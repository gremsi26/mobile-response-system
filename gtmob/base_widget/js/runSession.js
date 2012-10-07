$("#runPage").live("pageshow",function(event){
	$.ajax({
		url: "http://m.cip.gatech.edu/developer/hkw/api/base_widget/sessions",
		type: "GET",
		dataType: "json",
		success: function(sessions){
			var runList = $("#runList","#runPage");
			runList.html("");
			$.each(sessions, function(index, session){

				var link_session = $("<a>",{
					href: "#sessionPage",
					click: function(){
						loadSessionPage(session.id,session.name);
					}
				}).append("ID: ",session.id,", Name: ",session.name),

				li_session = $("<li>").append(link_session);

				runList.append(li_session);
			});
			runList.listview("refresh");
		}
	})
});

function loadSessionPage(session_id,session_name){
	var fieldset_questions = $("#sessionQuestionsList"),
		span_session_id = $("<span>",{id: "span_session_id", text: session_id}),
		span_session_name = $("<span>",{id: "span_session_name", text: session_name}),
		fieldset_legend = $("<legend>").append("Session ID: ",span_session_id, " | Session Name: ",span_session_name," | Activate a Question:"),
		array_question_data = new Array();
	fieldset_questions.html("").append("Waiting for AJAX");
	$.ajax({
		url: "api/sessions/" + session_id,
		type: "GET",
		dataType: "json",
		success: function(questions_data){	
			$.ajax({
				url: "api/sessions/" + session_id,
				type: "POST",
				dataType: "json",
				data: {
					"name": session_name,
					"isOpen": 1
				},
				success: function(data){

				}
			});
			fieldset_questions.html("").append(fieldset_legend);
			$.each(questions_data.questions, function(index,question){
				var input_id = index+1+"-input";
				array_question_data.push(question);
				var input_question = $("<input>",{
						type: "radio",
						name: "activatable_questions",
						id: input_id,
						value: index,
						click: function(){
							array_previous_selection = $("input[alt=activated]",fieldset_questions);
							if(array_previous_selection.length !== 0){
								var input_previous_selection = $(array_previous_selection[0]);
								input_previous_selection.attr("alt","");
								var previous_index = input_previous_selection.attr("value");
								var previous_question_data = array_question_data[previous_index];

								$.ajax({
									url: "api/questions/"+previous_question_data.id,
									type: 'POST',
									async: false,
									dataType: "json",
									data: {
										"numanswerchoices": previous_question_data.numanswerchoices,
										"correctanswerchoice": previous_question_data.correctanswerchoice,
										"incorrectpoints": previous_question_data.incorrectpoints,
										"correctpoints": previous_question_data.correctpoints,
										"ispolling": 0,
										"questiontype": previous_question_data.questiontype,
										"sessionid": previous_question_data.sessionid
									},
									success: function(data){
										
									}
								})

							}
							$(this).attr("alt","activated");
							
							$.ajax({
								url: "api/questions/"+question.id,
								type: 'POST',
								async: false,
								dataType: "json",
								data: {
									"numanswerchoices": question.numanswerchoices,
									"correctanswerchoice": question.correctanswerchoice,
									"incorrectpoints": question.incorrectpoints,
									"correctpoints": question.correctpoints,
									"ispolling": 1,
									"questiontype": question.questiontype,
									"sessionid": question.sessionid
								},
								success: function(data){
								}
							})
						}
					}),

					label_question = $("<label>",{
						"for": input_id,
						text: "Question #"+(index+1)
					});

				fieldset_questions.append(input_question,label_question);
			});
			var stop_active_btn = $("<input>",{
					type: "radio",
					"data-theme": "r",
					name: "activatable_questions",
					id: "stop",
					value: -1,
					click: function(){
						array_previous_selection = $("input[alt=activated]",fieldset_questions);
							if(array_previous_selection.length !== 0){
								var input_previous_selection = $(array_previous_selection[0]);
								input_previous_selection.attr("alt","");
								var previous_index = input_previous_selection.attr("value");
								var previous_question_data = array_question_data[previous_index];

								$.ajax({
									url: "api/questions/"+previous_question_data.id,
									type: 'POST',
									async: false,
									dataType: "json",
									data: {
										"numanswerchoices": previous_question_data.numanswerchoices,
										"correctanswerchoice": previous_question_data.correctanswerchoice,
										"incorrectpoints": previous_question_data.incorrectpoints,
										"correctpoints": previous_question_data.correctpoints,
										"ispolling": 0,
										"questiontype": previous_question_data.questiontype,
										"sessionid": previous_question_data.sessionid
									},
									success: function(data){

									}
								})

							}
					}
				}),
				stop_active_lbl = $("<label>",{
					"for": "stop",
					text: "Stop Active Question"
				});

			fieldset_questions.append(stop_active_btn,stop_active_lbl);
			fieldset_questions.trigger("create");
		}
	});
}

function closeSession(){
	var session_id = $("#span_session_id").html(),
		session_name = $("#span_session_name").html(),
	session_id = Number(session_id);

	$.ajax({
		url: "api/sessions/" + session_id,
		type: "POST",
		dataType: "json",
		data: {
			"name": session_name,
			"isOpen": 0
		},
		success: function(data){

		}
	});
}