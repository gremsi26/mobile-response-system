<?php
function getPagetypeContent($item) {
	//echo "testing".$item;
	if($item === "professors")
	{
	echo "<input type=\"button\" name=\"createsession\" value=\"Create Session\"  data-icon=\"arrow-r\" data-iconpos=\"right\" data-corners=\"false\" data-theme=\"b\" onclick=\"\">\n";
	}
	else //students
	{
			echo "<input type=\"button\" name=\"joinsession\" value=\"Join Session 2\"  data-icon=\"arrow-r\" data-iconpos=\"right\" data-corners=\"false\" data-theme=\"b\" onclick=\"\">\n";
	}
}
?>
