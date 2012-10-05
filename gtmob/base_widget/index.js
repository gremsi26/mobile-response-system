/*
Create Session Functions
*/

function addChoice(lastChild, divName){	
	var text;
	var lastChildText = "";
	
	if(lastChild == undefined || lastChild==null)
		text = "A";
	else
	{
		lastChildText = lastChild.id;
		text = String.fromCharCode(lastChildText.charCodeAt(0)+1)
	}
	
	$("#"+divName).append("<div id="+text+"><input type='radio' name='"+divName+"' value='"+text+"'>"+text+"</div>");
	//$("#"+divName).append("<li>"+text+"</li>");
} 

function removeLastChoice(divName)
{
	$("#"+divName+" div:last-child").remove();
}
function removeQuestion(divName)
{
	$("#"+divName).remove();
}
function addQuestion(questionNumber, divName){
	if(questionNumber == undefined)
		questionNumber = 'question-0';
	var questionInt = parseInt(questionNumber.split("-")[1])+1;
	var questionID = "question-"+questionInt;
	
	$("#"+divName).append("<div id="+questionID+" data-role='content'><h2>Question "+questionInt+"</h2><ul id='q"+questionInt+"-choices'></ul><input type='button' data-inline='true' data-theme='b' data-icon='plus' value='Add Choice' onclick=\"addChoice(document.getElementById('q"+questionInt+"-choices').lastChild, 'q"+questionInt+"-choices')\"><input type='button' data-inline='true' data-theme='b' data-icon='plus' value='Remove Choice' onclick=\"removeLastChoice('q"+questionInt+"-choices')\"> <input type='button' data-inline='true' data-theme='b' data-icon='plus' value='Remove Question' onclick=\"removeQuestion('"+questionID+"')\"></div>");
	
	//$("#"+questionID).trigger("create");
} 


/*
Functions
*/
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
