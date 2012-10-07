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
	var ul_results = $("#resultsList"),
		results_legend = $("<legend>").append("Student Responses:");
		ul_results.html("").append("Waiting for AJAX");
	$.ajax({
		url: "api/sessions/" + session_id,
		type: "GET",
		dataType: "json",
		success: function(questions_data){
			ul_results.html("").append(results_legend);

			$.each(questions_data.questions, function(index, question){
				$.ajax({
					url: "api/results/" + question.id,
					type: "GET",
					dataType: "json",
					success: function(results_data){
						console.log("INDEX: ",index,", RESULTS: ",results_data);
					}
				})

			})
			//url: "api/results"

			ul_results.trigger("create");
		}
	});
}