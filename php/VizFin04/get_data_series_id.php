<?php
	require_once "../config.php";
	// require_once "../KLogger.php"; // DEBUG
	// $log = new KLogger ( "../../_logfiles/get_data_series_id.log" , KLogger::DEBUG ); // DEBUG
	// $log->logDebug('Log Initialized.'); // DEBUG
	$return = array();
	try {
		// Get POST Variables
		$data_ticker = $_POST["data_ticker"];
		// Create and Execute Query
		$query = "
		SELECT
			`int_data_series_ID`
		FROM
			`T_DATA_SERIES`
		WHERE
			`txt_data_ticker`='$data_ticker';
		";
		$query_result = $EMF_mysqli->query($query);
		// $log->logDebug($query); // DEBUG
		$return["results"] = $query_result->fetch_array(MYSQLI_NUM)[0];
		// Free Result
		$query_result->free();
	} catch (Exception $e) {
		$return["error"] = array("Unknown Error", $e);
	}
	echo json_encode($return);
?>