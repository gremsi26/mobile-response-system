<?php

include 'db_helper.php';

function putSession($name)
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

	 echo json_encode($result);
}

function deleteSession($sessionID){

	global $_USER;
	$username = $_USER['uid'];
	
	$sql = sprintf("DELETE FROM Sessions WHERE id=%s",
				$sessionID);
				
	$results = getDBResultAffected($sql);
	header("Content-type: application/json");
	echo json_encode($results);
}


//Gets all session metadata and all questions for the session with id=sessionID
function getSession($sessionID)
{
	global $_USER;
	$username = $_USER['uid'];

	$sql = sprintf("SELECT * FROM Sessions WHERE id = %s", $sessionID);
	$sessionresult = getDbResultRecord($sql);


	$sql = sprintf("SELECT * FROM Questions WHERE sessionid = %s", $sessionID);
	$questions = getDbResultsArray($sql);

	$sql = sprintf("SELECT * FROM Questions WHERE sessionid = %s AND ispolling = 1", $sessionID);
	$pollingquestion = getDbResultRecord($sql);

	$results = array("session" => $sessionresult, "questions" => array_values($questions), "pollingquestion" => $pollingquestion);
	return json_encode($results);

}

//This function returns the sessions owned by user id specified by creatorName
//Returns ID's, names
function getSessions($creatorName)
{
	$sql = sprintf("SELECT id, name FROM Sessions WHERE creator = \"%s\"", $creatorName);
	$sessions = getDbResultsArray($sql);
	return json_encode($sessions);
}

//Overwrite an existing session with the given name.  Overwrites the isOpen if that is set, and questions if that is set.
function postSession($name, $isOpen, $questions)
{


}

//Add a response to the response table for a question on behalf of a particular user
//If the question is not the currently polling question, don't update
//If the response already exists, overwrite instead of adding another response
function putResponse($userID, $questionID, $answer)
{

}

//Returns the response results for a question if they exist and the question is not currently polling
function getResults($questionID)
{

//traverse the response table to find responses corresponding to $questionID

}

?>
