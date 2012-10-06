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

?>
