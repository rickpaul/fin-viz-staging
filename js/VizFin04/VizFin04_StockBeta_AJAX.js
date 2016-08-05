'use strict'
var vizfin = vizfin || {};

(function(vizfin_){
	var phpMySQLPrefix = '../../php/VizFin04/';
	//////////////////////////////////////////////////////////////////////////////
	// Helping Code
	//////////////////////////////////////////////////////////////////////////////
	function parse_epoch_date(epoch_date) {
		/*
			in: an epoch date
			ret: a Date Object
		*/
		return new Date(epoch_date*1000);
	}

	function AJAX_Simple_Call(url, data, callback) {
		$.ajax({
				url: url,
				data: data,
				type: 'POST',
				dataType: 'JSON',
				cache: false
			})
			.done(function(data){
				if(data.error){
					console.log(data.error);
					callback(data.error, null);
				} else if(typeof(data.results) !== 'undefined') {
					callback(null, data.results);
				} else if(typeof(data.results) === 'undefined') {
					console.log('Data Results not recognized');
					callback('Data Results not recognized', null);
				}
			})
			.fail(function(error){
				console.log(error);
				callback(error.responseText, null);
			})
		;
	}
	function AJAX_TrueFalse_Call(url, data, callback) {
		AJAX_Simple_Call(url, data, function(error, num_rows){
			callback(error, num_rows > 0); // data results is success is num rows affected. 0/1.
		});
	}
	//////////////////////////////////////////////////////////////////////////////
	// Specific Code
	//////////////////////////////////////////////////////////////////////////////
	var get_data_series_history = function(seriesID, callback) {
		$.ajax({
				url: phpMySQLPrefix + 'get_data_series_history.php',
				data: {
					seriesID: seriesID
				},
				type: 'POST',
				dataType: 'JSON',
				cache: false
			})
			.done(function(data){
				if(data.error){
					console.log(data.error);
					callback(data.error, null);
				} else if(typeof(data.results) !== 'undefined') {
					var chart_data = [];
					data.results.forEach(function(d) {
						chart_data.push({
							date: parse_epoch_date(d[0]),
							value: +d[1],
						});
					});
					callback(null, chart_data);
				} else if(typeof(data.results) === 'undefined') {
					console.log('Data Results not recognized');
					callback('Data Results not recognized', null);
				}
			})
			.fail(function(error){
				console.log(error);
				callback(error.responseText, null);
			})
		;
	}

	var get_data_series_id = function(seriesTicker, callback) {
		var url = phpMySQLPrefix + 'get_data_series_id.php';
		var data = {
			data_ticker: seriesTicker
		};
		AJAX_Simple_Call(url, data, callback);
	}

	vizfin_.AJAX = {
		get_data_series_history: get_data_series_history,
		get_data_series_id: get_data_series_id,
	};

})(vizfin);
