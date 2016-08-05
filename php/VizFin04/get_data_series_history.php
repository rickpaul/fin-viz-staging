<?php
	require_once "../config.php";
	// require_once "../KLogger.php"; // DEBUG
	// // Logger is sent from position of KLogger
	// $log = new KLogger ( "../../_logfiles/get_data_series_history.log" , KLogger::DEBUG ); // DEBUG
	// $log->logDebug('Log Initialized.'); // DEBUG
	$return = array();
	try {
		// Get POST Variables
		$seriesID = $_POST["seriesID"];
		// Create and Execute Query
		$query = "
		SELECT
			`dt_date_time`, `flt_data_value`
		FROM
			`T_DATA_HISTORY`
		WHERE
			`int_data_series_ID`=$seriesID;
		";
		$query_result = $EMF_mysqli->query($query);
		// Place Result in Array
		$results_array = array();
		while ($row = $query_result->fetch_array(MYSQLI_NUM)) {
			$results_array[] = $row;
		}
		$return["results"] = $results_array;
		// Free Result
		$query_result->free();
	} catch (Exception $e) {
		$return["error"] = array("Unknown Error", $e);
	}
	echo json_encode($return);
?>