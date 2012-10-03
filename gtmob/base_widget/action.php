<?php
function createSession()
{
	 global $_USER;
	 $mysqli = new mysqli('db.cip.gatech.edu', 'hkw', 'DxEibHZi', 'CONTRIB_hkw');
	 if ($mysqli->connect_error) {
   		 die('Connect Error (' . $mysqli->connect_errno . ') '
            . $mysqli->connect_error);
		}
	 $username = $_USER['uid'];
	 $sql = "INSERT INTO  `CONTRIB_hkw`.`Sessions` (
			`id` ,
			`name` ,
			`creator` ,
			`creationtimestamp` ,
			`isopen`
			)
			VALUES (
			NULL ,  '',  'wbarr3', UTC_TIMESTAMP( ) ,  '0'
			);"
	 $mysqli->query($sql);
	 printf("New record has id %d.\n", $mysqli->insert_id);
}

function deleteSession(){
	global $_USER;
	 $mysqli = new mysqli('db.cip.gatech.edu', 'hkw', 'DxEibHZi', 'CONTRIB_hkw');
	 if ($mysqli->connect_error) {
   		 die('Connect Error (' . $mysqli->connect_errno . ') '
            . $mysqli->connect_error);
		}
	 $username = $_USER['uid'];
	 $sessionId = $_GET['sessionid'];
	 $sql = "DELETE FROM Sessions WHERE Creator = $username AND id = $sessionId";
	 $deleted = $mysqli->query($sql);
	 printf("$deleted");

}

?>