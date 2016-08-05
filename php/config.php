<?php
	// Set Timezone
	date_default_timezone_set('UTC');
	// Set Up Logger
	// require_once "../KLogger.php"; // DEBUG
	// $log = new KLogger ( "../../_logfiles/config.log" , KLogger::DEBUG ); // DEBUG
	// MYSQL / Connect to becon_graph
	$graph_mysqli = new mysqli("localhost", "root", "[]{}[]", "becon_graph");
	if ($graph_mysqli->connect_errno) {
		// $log->logError("Failed to connect to Graph MySQL: (" . $graph_mysqli->connect_errno . ") " . $mysqli->connect_error);
	} else {
		// $log->logDebug("Graph MySQL Login Successful!");
	}
	// MYSQL / Connect to EMF (for data)
	$EMF_mysqli = new mysqli("localhost", "root", "[]{}[]", "EMF_TEST");
	if ($EMF_mysqli->connect_errno) {
		// $log->logError("Failed to connect to EMF MySQL: (" . $EMF_mysqli->connect_errno . ") " . $mysqli->connect_error);
	} else {
		// $log->logDebug("EMF MySQL Login Successful!");
	}
	ERROR_REPORTING(0);	
?>