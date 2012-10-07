
$("#studentPage").live("pageshow", function (event) {
    //$("input[name=session_key]","#createSessionForm").val("");
    //console.log($("#questions").html());
    $("#studentPageContent").html("<form id='studentPageForm'><h3>Session ID:</h3><input type='text' name='sessionID'><input type='button' onclick='joinSession()' value='Join'></form>");
    $("#studentPageContent").trigger("create");
});



function refresh() {
    console.log('Refresh Session');
    console.log(document.getElementsByName('sessionHeaderDiv'));

    if (document.getElementsByName('sessionHeaderDiv').length > 0) {

        var sessionHeader = document.getElementsByName('sessionHeaderDiv');
        var sessionID = sessionHeader[0].id;
        console.log(sessionID);

        $.ajax({
            url: "api/sessions/" + sessionID,
            context: document.body,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log("Refreshing Session Data: " + JSON.stringify(data));
                if (data == null || data.session == false || data.isopen == "0") {
                    console.log('Could Not Find Session or Session not open.');
                } else if (data.pollingquestion == false) {
                    console.log("Question not active");
                    var d = new Date();
                    $('#studentSessionDiv').text("");
                    $('#studentSessionDiv').append("No question active. Press refresh to get active question. " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
                    $('#studentSessionMessageDiv').text("");
                    //$('#responsesDiv').empty();
                } else {
                    $('#studentSessionMessageDiv').text("");
                    $('#responsesDiv').empty();
                    console.log('Question Active');
                    var pollingQuestion = data.pollingquestion;
                    console.log('data ' + (data.questions[data.questions.length - 1]));
                    var lastQuestion = data.questions[data.questions.length - 1];
                    var questionNumber = data.questions.length - (lastQuestion.id - pollingQuestion.id);
                    var questionID = pollingQuestion.id;
                    var questionType = pollingQuestion.questiontype;
                    var numanswerchoices = pollingQuestion.numanswerchoices;

                    var pollingQuestionHeader = $("<h2>", {
                        id: pollingQuestionHeader,
                        "name": questionID,
                        text: "Question #" + questionNumber
                    });



                    var fieldSetID = "pollingQuestionChoices";
                    var pollingQuestionChoices = $("<fieldSet>", {
                        id: fieldSetID,
                        "data-role": "controlgroup"
                    });

                    //choicesFieldSet = $("#" + fieldSetID);
                    var i;
                    for (i = 0; i < numanswerchoices; i++) {
                        var text = '' + (i + 1);
                        var newChoiceInput = $("<input>", {
                            type: "radio",
                            name: fieldSetID,
                            value: text,
                            id: text + "-input"
                        });

                        var newChoiceLabel = $("<label>", {
                            "for": text + "-input"
                        }).append(text);

                        var newChoiceDiv = $("<div>", {
                            id: text,
                            "class": "choice-div"
                        }).append(newChoiceInput, newChoiceLabel);

                        pollingQuestionChoices.append(newChoiceDiv);
                        //choicesFieldSet.trigger("create");
                    }

                    var submitAnswer = $("<input>", {
                        type: "button",
                        "data-theme": "b",
                        "data-icon": "check",
                        value: "Submit Answer",
                        click: function () {
                            var choiceSelected = $("input[name*=" + fieldSetID + "]:checked").attr("value");

                            if (choiceSelected == null) {
                                var d = new Date();
                                $('#studentSessionMessageDiv').text("No Response Selected " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
                            } else {

                                console.log('Choice Selected: ' + choiceSelected);
                                console.log('Question Answering: ' + questionID);
                                $.ajax({
                                    url: "api/responses/",
                                    context: document.body,
                                    type: 'POST',
                                    async: false,
                                    dataType: "json",
                                    data: {
                                        'questionid': questionID,
                                        'answer': choiceSelected,
                                        '_method': 'put'
                                    },
                                    //header: {'X-HTTP-Method-Override': 'PUT'},
                                    success: function (data) {
                                    	
                                        console.log('Submit Response Data: ', JSON.stringify(data));
                                        //console.log(data); 
                                        //sessionID = data.id;
                                        var d = new Date();
                                        
                                        if(data.success!=null)
                                        {
                                        	if(data.success == false){
	                                      $('#studentSessionMessageDiv').text("Question has been closed. " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());  
	                                      $('#studentSessionDiv').empty();
	                                      }
                                        }
                                        $('#studentSessionMessageDiv').text("Response Submitted (" + choiceSelected + ") " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
                                        var responsesButton = $("<input>", {
                                            type: "button",
                                            id: "responsesButton",
                                            "data-theme": "b",
                                            "data-icon": "check",
                                            "data-mini": "true",
                                            value: "View Responses for Question "+questionNumber,
                                            click: function () {
												$.ajax({
													url: "api/sessions/"+sessionID,
													context: document.body,
													type: 'GET',
													async: false,
													dataType: "json",
													//header: {'X-HTTP-Method-Override': 'PUT'},
													success: function (data) {
														console.log("Session Data check for when you get responses: "+JSON.stringify(data));
														if(data.pollingquestion.id == '3423423')//questionID)
														{
															$('#studentSessionMessageDiv').html("Question is still active. Cannot get responses.");
														}
														else
														{
															console.log("Getting Results for "+questionID);
															$.ajax({
															url: "api/results/"+questionID,
															context: document.body,
															type: 'GET',
															async: false,
						                                    data: {
						                                        'aggregate': "1"
						                                    },
															dataType: "json",
															//header: {'X-HTTP-Method-Override': 'PUT'},
															success: function (data) {
																console.log("Responses Results: "+JSON.stringify(data));
																
																var options = {
																	bars: { show: true }
																	//xaxis: { tickDecimals: 0, tickSize: 1 }
																};
																
																var i;
																//for(i=0; i<data
																
																var data = [[0, 3], [4, 8], [8, 5], [9, 13]];
																var placeholder = $("#responsesDiv");
																//placeholder.height 
																$.plot(placeholder, data, options);
						                                       // $('#responsesDiv').trigger("create");
															}
															});
														}
													}
												});	
                                            }
                                        });

                                        var responsesDiv = $("<div>", {
                                            id: "responsesDiv",
                                            height: 300
                                        }).append(responsesButton);
                                        
                                        $('#responsesDiv').empty();
                                        $('#studentSessionMessageDiv').after(responsesDiv);
                                        $('#responsesDiv').trigger("create");
                                    }

                                });
                            }

                        }
                    });


                    $('#studentSessionDiv').text("");
                    $('#studentSessionDiv').append(pollingQuestionHeader, pollingQuestionChoices, submitAnswer);
                    $('#studentSessionDiv').trigger("create");

                }
            }
        });


    }
}




function joinSession() {
    console.log('Join Session');

    $.ajax({
        url: "api/sessions/" + document.getElementById("studentPageForm").elements["sessionID"].value,
        context: document.body,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log("Joining Session Data: " + JSON.stringify(data));
            var d = new Date();
            if (data == null || data.session == false) {
                console.log('Could Not Find Session');
                alert("Session not found. Please try again. " + d.getHours() + ":" + d.getMinutes());
            } else if (data.session.isopen == "1") {
                console.log('Session Found: ' + data.session.id);

                var sessionHeader = $("<h2>", {
                    id: 'sessionheader',
                    text: "Session Joined: " + data.session.name + " [ID: " + data.session.id + "]"
                });



                var sessionHeaderDiv = $("<div>", {
                    id: data.session.id,
                    name: 'sessionHeaderDiv',
                    //"class": "ui-body ui-body-a"
                }).append(sessionHeader);

                var sessionDiv = $("<div>", {
                    id: 'studentSessionDiv',
                    "class": "ui-body ui-body-c",
                    text: "Press refresh to get active question."
                });

                var messageDiv = $("<div>", {
                    id: 'studentSessionMessageDiv',
                    "class": "ui-body ui-body-a",
                    //text: "No Response Submitted"
                });

                $('#studentPageContent').html(sessionHeaderDiv);
                $('#studentPageContent').append(sessionDiv, messageDiv);

                refresh();
            } else {
                alert("Session has not been opened yet. " + d.getHours() + ":" + d.getMinutes());
            }
        }
    });
}