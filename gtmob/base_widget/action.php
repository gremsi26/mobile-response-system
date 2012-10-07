<?php

include 'db_helper.php';

function putSession($name, $postvar)
{
	 global $_USER;
	 $username = $_USER['uid'];

	 $sql = sprintf("INSERT INTO  Sessions (
			name,
			creator,
			creationtimestamp,
			isopen
			)
			VALUES (
			'%s',  '%s', UTC_TIMESTAMP() ,  0
			);", mysql_real_escape_string($name), mysql_real_escape_string($username));
	 

	 $result = getDBResultInserted($sql, 'id');
	 header("Content-type: application/json");
	 $result["postvar"] = $postvar;

	 echo json_encode($result);
}

function deleteSession($sessionID){

	global $_USER;
	$username = $_USER['uid'];
	

	$sql = sprintf("DELETE FROM Sessions WHERE id=%s AND creator=%s",
				mysql_real_escape_string($sessionID), mysql_real_escape_string($username));
					
	$results = getDBResultAffected($sql);
	header("Content-type: application/json");
	echo json_encode($results);
}


//Gets all session metadata and all questions for the session with id=sessionID
function getSession($sessionID)
{
	global $_USER;
	$username = $_USER['uid'];

	$sql = sprintf("SELECT * FROM Sessions WHERE id = %s", mysql_real_escape_string($sessionID));
	$sessionresult = getDbResultRecord($sql);


	$sql = sprintf("SELECT * FROM Questions WHERE sessionid = %s", mysql_real_escape_string($sessionID));
	$questions = getDbResultsArray($sql);

	$sql = sprintf("SELECT * FROM Questions WHERE sessionid = %s AND ispolling = 1", mysql_real_escape_string($sessionID));
	$pollingquestion = getDbResultRecord($sql);

	$results = array("session" => $sessionresult, "questions" => array_values($questions), "pollingquestion" => $pollingquestion);
	header("Content-type: application/json");
	return json_encode($results);

}

//This function returns the sessions owned by the current user
//Returns ID's, names
function getSessions()
{
	global $_USER;
	$username = $_USER['uid'];
	header("Content-type: application/json");

	$sql = sprintf("SELECT id, name FROM Sessions WHERE creator = \"%s\"", mysql_real_escape_string($username));
	$sessions = getDbResultsArray($sql);
			
	return json_encode($sessions);
}

//Overwrite an existing session with the given name.  Overwrites the isOpen if that is set, and questions if that is set.
function postSession($sessionID, $name, $isOpen)
{
	global $_USER;
	$username = $_USER['uid'];

	$sql = "UPDATE Sessions SET name = \"%s\", isopen=%s WHERE creator = \"%s\" AND id=%s";
	$sql = sprintf($sql, $name, $isOpen, $username, $sessionID);

	$result = getDBResultAffected($sql);
	echo json_encode($result);
}

//Add a response to the response table for a question on behalf of a particular user
//If the question is not the currently polling question, don't update
//If the response already exists, overwrite instead of adding another response

function putResponse($questionID, $answer)
{
	global $_USER;
	$username = $_USER['uid'];

	$isPollingSQL = sprintf("SELECT * FROM Questions WHERE id=%s AND ispolling=1",
				mysql_real_escape_string($questionID));
		
	$pollingArray = getDBResultsArray($isPollingSQL);

	if(count($pollingArray) == 0)
	{
		header("Content-type: application/json");
		echo json_encode(array("success" => 0));
		return;
	}

	$sql = sprintf("DELETE FROM Responses WHERE questionid=%s AND responder=\"%s\"",
				mysql_real_escape_string($questionID),
				mysql_real_escape_string($username));

	$newResults = getDBResultAffected($sql);

	$sqlAdd = sprintf("INSERT INTO Responses
				(questionid,
				responder,
				choice,
				answertime)
				VALUES ('%s','%s','%s',UTC_TIMESTAMP())",
				mysql_real_escape_string($questionID),
				mysql_real_escape_string($username),
				mysql_real_escape_string($answer));

	$results = getDBResultInserted($sqlAdd,'id');


	header("Content-type: application/json");

	echo json_encode($results);
}


//Returns the response results for a question if they exist and the question is not currently polling
function getResults($questionID)
{
	$sql = sprintf("SELECT * FROM Responses WHERE questionid = %s", mysql_real_escape_string($questionID));

	$results = getDbResultsArray($sql);
	
	header("Content-type: application/json");
	echo json_encode($results);
}

function getAggregateResults($questionID)
{
	$sql = sprintf("SELECT choice, COUNT(choice) FROM Responses WHERE questionid = %s GROUP BY choice", $questionID);
	$results = getDbResultsArray($sql);

	header("Content-type: application/json");
	echo json_encode($results);
}

function putQuestion($answerChoices, $correctAns, $incPoints, $corrPoints, $isPolling, $questiontype, $sessionID)
{

	$sql = sprintf("INSERT INTO Questions (sessionid, questiontype, numanswerchoices, correctanswerchoice, incorrectpoints, correctpoints, ispolling)
						VALUES(%s, %s, %s, %s, %s, %s, %s)", 
						mysql_real_escape_string($sessionID), 
						mysql_real_escape_string($questiontype), 
						mysql_real_escape_string($answerChoices), 
						mysql_real_escape_string($correctAns), 
						mysql_real_escape_string($incPoints), 
						mysql_real_escape_string($corrPoints), 
						mysql_real_escape_string($isPolling));

	$results = getDBResultInserted($sql, 'id');
	header("Content-type: application/json");

	echo json_encode($results);
}

function postQuestion($questionID, $answerChoices, $correctAns, $incPoints, $corrPoints, $isPolling, $questiontype, $sessionID){

	$sql = sprintf("UPDATE Questions SET sessionid = %s, questiontype = %s, numanswerchoices = %s, correctanswerchoice=%s, incorrectpoints=%s, correctpoints=%s, ispolling=%s)
						WHERE id=%s", 
						mysql_real_escape_string($sessionID), 
						mysql_real_escape_string($questiontype), 
						mysql_real_escape_string($answerChoices), 
						mysql_real_escape_string($correctAns), 
						mysql_real_escape_string($incPoints), 
						mysql_real_escape_string($corrPoints), 
						mysql_real_escape_string($isPolling),
						mysql_real_escape_string($questionID));

	$results = getDBResultAffected($sql);
	header("Content-type: application/json");

	echo json_encode($results);
}

?>
