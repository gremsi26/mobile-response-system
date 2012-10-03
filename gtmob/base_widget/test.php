<?php
function test(){
        global $_REST;
        print "REST: ";
        var_dump($_REST);
        print "<br>";
        
        print "GET: ";
        var_dump($_GET);
        print "<br>";
        
        print "POST: ";
        var_dump($_POST);
        print "<br>";
        
        print "FILES: ";
        var_dump($_FILES);
        print "<br>";
}
?>