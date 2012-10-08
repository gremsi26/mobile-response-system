$("#reviewPage").live("pageshow",function(event){
	$.ajax({
		url: "http://m.cip.gatech.edu/developer/hkw/api/base_widget/sessions",
		type: "GET",
		dataType: "json",
		success: function(sessions){
			var reviewList = $("#reviewList","#reviewPage");
			reviewList.html("");
			$.each(sessions, function(index, session){
				var link_session = $("<a>",{
					href: "#resultsPage",
					click: function(){
						loadResultsPage(session.id,session.name);
					}
				}).append("ID: ",session.id,", Name: ",session.name),

				li_session = $("<li>").append(link_session);

				reviewList.append(li_session);
			});
			reviewList.listview("refresh");
		}
	})
});

function loadResultsPage(session_id,session_name){
	console.log("called");
	var ul_options = $("#optionsList"),
		ul_results = $("#resultsList"),
		link_byStudents = $("<a>",{
			href: "",
			text: "Student Grade Report",
			click: function(){
				results_legend = $("<legend>").append("Student Grade Report:"),
				ul_results.html("").append(results_legend);
				$.ajax({
					url: "api/results/" + session_id + "?reporttype=students",
					type: "GET",
					dataType: "json",
					async: true,
					success: function(results_data){
						$.each(results_data, function(index, student_results){
							var list_text = (index+1)+": " + student_results.responder + " --- " + student_results["COUNT( Responses.id )"] + " Questions Correct",
							li_student = $("<li>",{
								text: list_text
							})
							ul_results.append(li_student);
						})
						ul_results.listview("refresh");
					}
				})	
			}
		}),
		link_byQuestions = $("<a>",{
			href: "",
			text: "Question Response Report",
			click: function(){
				$.ajax({
					url: "api/sessions/" + session_id,
					type: "GET",
					dataType: "json",
					success: function(questions_data){
						results_legend = $("<legend>").append("Question Response Report:"),
						ul_results.html("").append(results_legend);

						$.each(questions_data.questions, function(index, question){
							$.ajax({
								url: "api/results/" + question.id + "?reporttype=questions",
								type: "GET",
								dataType: "json",
								async: false,
								success: function(results_data){
									var ul_responses = $("<ul>",{
										"data-role": "listview",
										"data-inset": "true",
										"data-theme": "b"
									});
									$.each(results_data, function(response_index, response){
										var response_text = "Name: " + response.responder + ", Choice: " + response.choice + ", Time: " + response.answertime;
										li_response = $("<li>",{
											text: response_text
										});
										ul_responses.append(li_response);
									});
									var list_text = "Question "+(index+1)+" (Correct Choice:"+question.correctanswerchoice+"): ",
									li_question = $("<li>",{
										text: list_text
									}).append(ul_responses);
									ul_results.append(li_question);
								}
							})
						})
					}
				});
			}
		}),
		li_byStudents = $("<li>").append(link_byStudents),
		li_byQuestions = $("<li>").append(link_byQuestions),
		reportType_legend = $("<legend>").append("Choose Report:");
		ul_options.html("").append(reportType_legend,li_byStudents,li_byQuestions);
		ul_results.html("").append("Waiting for user report choice.");
		ul_options.listview("refresh");
}