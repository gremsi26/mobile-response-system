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
		fieldset_legend = $("<legend>").append("Activate a Question:");
	fieldset_questions.html("").append(fieldset_legend);
	$.ajax({
		url: "api/sessions/" + session_id,
		type: "GET",
		dataType: "json",
		success: function(questions_data){
			$.each(questions_data.questions, function(index,question){
				console.log(question);
				var input_question = $("<input>",{
						type: "radio",
						name: "activatable_questions",
						id: index+1+"-input"
					}),

					label_question = $("<label>",{
						"for": index+1+"-input"
					}).append("Question #",index+1);

				fieldset_questions.append(input_question,label_question);
			});
			fieldset_questions.trigger("create");
		}
	});
}