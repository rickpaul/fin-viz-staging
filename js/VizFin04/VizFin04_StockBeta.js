'use strict'
var vizfin = vizfin || {};

(function(vizfin_){
	var periodicity_consts = {
		'any': 0,
		'daily': 365,
		'weekly': 52,
		'monthly': 12,
		'quarterly': 4,
		'annual': 1,
	};
	// TODO: Make sure syncs up with Quandl/Python
	var periodicity_rvrs_consts = {
		0: 'any',
		365: 'daily',
		52: 'weekly',
		12:'monthly',
		4: 'quarterly',
		1: 'annual',
	};
	// TODO: Make sure syncs up with YQL/Python
	function convert_ticker(sec_ticker){
		return 'SEC_'+sec_ticker+'_PRICE_ADJ_CLOSE'
	}
	function parse_epoch_date(epoch_date) {
		/*
			in: an epoch date
			ret: a Date Object
		*/
		return new Date(epoch_date*1000);
	}

	function StockStats(canvas_holder){
		this.async_tasks = 0;

		this.UpDownBetaChart = new vizfin_.BetaScatterChart(canvas_holder.svg);
		this.HistoricPriceChart = new vizfin_.LineChart(canvas_holder.svg);
		this.HistoricPriceChart.add_line('x_val', 'x_line');
		this.HistoricPriceChart.add_line('y_val', 'y_line');
		canvas_holder.register_element(this.UpDownBetaChart, .5, .5, 0, 0, 'BetaScatterChart');
		canvas_holder.register_element(this.HistoricPriceChart, 1, .5, 0, .5, 'HistoryLineChart');

		this.periodicity = periodicity_consts.daily;
		this.period_diff = 30;
		this.period_diff_stats = 30;
		this._x_ticker = null;
		this._x_db_ticker = null;
		this._y_ticker = null;
		this._y_db_ticker = null;
		this._x_source_id = null;
		this._y_source_id = null;
		this._errors = [];


		Object.defineProperty(this, 'x_ticker', {
			set: function(value) {
				this._x_ticker = value;
				this._x_db_ticker = convert_ticker(value);
				var this_ = this;
				queue()
					.defer(function(callback){this_.increment_task_count.call(this_, callback);})
					.defer(vizfin_.AJAX.get_data_series_id, this._x_db_ticker)
					.await(function(error, task_action, source_id){
						if(error) { this_._errors.push(['load x_source_id', error]); }
						if(source_id === null) { 
							this_._errors.push(['load x_source_id', 'source id not found']); 
						} else {
							this_._x_source_id = +source_id;	
						}
						this_.decrement_task_count.call(this_);
					})
				;
			},
		});
		Object.defineProperty(this, 'y_ticker', {
			set: function(value) {
				this._y_ticker = value;
				this._y_db_ticker = convert_ticker(value);
				var this_ = this;
				queue()
					.defer(function(callback){this_.increment_task_count.call(this_, callback);})
					.defer(vizfin_.AJAX.get_data_series_id, this._y_db_ticker)
					.await(function(error, task_action, source_id){
						if(error) { this_._errors.push(['load y_source_id', error]); }
						if(source_id === null) { 
							this_._errors.push(['load y_source_id', 'source id not found']); 
						} else {
							this_._y_source_id = +source_id;	
						}
						this_.decrement_task_count.call(this_);
					})
				;
			},
		});
	};
	StockStats.prototype.constructor = StockStats;
	StockStats.prototype.increment_task_count = function(callback) {
		if(this.async_tasks === 0){
			$('#txt-status').text('Loading...'); // Change this.
		}
		this.async_tasks+=1;
		console.log('++ASYNC TASKS: ' + this.async_tasks); // DEBUG
		if(callback){callback(null, 1);}
	};
	StockStats.prototype.decrement_task_count = function(callback) {
		this.async_tasks-=1;
		if(this.async_tasks === 0){
			$('#txt-status').text('Finished!');
		}
		console.log('--ASYNC TASKS: ' + this.async_tasks); // DEBUG
		if(callback){callback(null, -1);}
	};
	StockStats.prototype.get_negative_trend_line = function(start_y, end_y) {

	};
	StockStats.prototype.get_positive_trend_line = function(start_y, end_y) {

	};

	StockStats.prototype.set_tickers = function(y_ticker) {
		// 1) Set x_ticker, y_ticker,
		this.x_ticker = 'SPY'; // DEBUG
		this.y_ticker = y_ticker || 'MSFT'; // DEBUG
	};
	StockStats.prototype._create_chart_data = function(x_idx, y_idx) {
		var sorted_indices = this.raw_data.get_sorted_row_indices('n');
		var j = this.period_diff;
		var i = 0;
		var l = sorted_indices.length;
		var idx_1, idx_2, row_1, row_2, date_1, date_2;
		var x_0, y_0, x_val, y_val;
		this.diff_data = [];
		this.line_data = [];
		while ( i < l ) {
			// Retrieve Earlier Data Point
			idx_1 = this.raw_data._get_row_index(sorted_indices[i]);
			if ( this.raw_data.get_row_len_by_idx(idx_1) != 2 ) { i++; j++; continue; }
			row_1 = this.raw_data.get_row_by_idx(idx_1);
			// Add Line Data
			x_val = row_1[x_idx];
			y_val = row_1[y_idx];
			if ( x_0 === undefined ) { x_0 = x_val; }
			if ( y_0 === undefined ) { y_0 = y_val; }
			
			date_1 = parse_epoch_date(sorted_indices[i]);
			
			this.line_data.push({
				'dt': date_1,
				'x_val': x_val/x_0,
				'y_val': y_val/y_0
			});
			// If Difference Data is Valid
			if ( j < l ) {
				// If Difference Data is Valid | Retrieve Later Data Point
				idx_2 = this.raw_data._get_row_index(sorted_indices[j]);
				if ( this.raw_data.get_row_len_by_idx(idx_2) != 2 ) { i++; j++; continue; }
				row_2 = this.raw_data.get_row_by_idx(idx_2);
				date_2 = parse_epoch_date(sorted_indices[j]);
				// If Difference Data is Valid | Push Difference Data
				this.diff_data.push({
					dt_0: date_1,
					dt: date_2,
					x: row_2[x_idx]/row_1[x_idx] - 1,
					y: row_2[y_idx]/row_1[y_idx] - 1,
				});
			}
			// Advance Indices
			i++;
			j++;
		}
		// // Determine Trailing Stats. THIS IS HUGELY INEFFICIENT (Can be done better)!
		// var x_diff_series = this.diff_data.map(function(d){return d.x;});
		// var y_diff_series = this.diff_data.map(function(d){return d.y;});
		// var xy_covar = trailingCovariance(x_diff_series, y_diff_series, this.period_diff_stats);
		// var x_var = trailingVariance(x_diff_series, this.period_diff_stats);
		// this.trailingVol = trailingVariance(y_diff_series, this.period_diff_stats); // USELESS
		// this.trailingBeta = [];
		// this.trailingAlpha = [];
		// var beta, alpha, correlation;
		// [beta, alpha, correlation] = trailingCorrelation(x_diff_series, y_diff_series, this.period_diff_stats);
		// this.abc_data = []; // alpha, beta, correlation
		// var covariance = trailingCovariance()
		// for (var i = 0; i < x_diff_series.length; i++) {
		// 	x_diff_series[i]
		// };

	};
	StockStats.prototype.load_data = function() {
		if (this.async_tasks != 0) {return;}
		// 2) Load data into Matrix Dictionary
		this.raw_data = new becon_Graph.Matrix_Dictionary();
		var x_idx = this.raw_data.add_col('x');
		var y_idx = this.raw_data.add_col('y');
		var this_ = this;
		queue()
			.defer(vizfin_.AJAX.get_data_series_history, this._x_source_id)
			.defer(vizfin_.AJAX.get_data_series_history, this._y_source_id)
			.await(function(errors, x_data, y_data) {
				x_data.forEach(function(d){
					this_.raw_data.add_entry_by_name_idx(d[0], x_idx, +d[1]);
				});
				y_data.forEach(function(d){
					this_.raw_data.add_entry_by_name_idx(d[0], y_idx, +d[1]);
				});
				this_._create_chart_data(x_idx, y_idx);
				this_.UpDownBetaChart.add_data(this_.diff_data);
				this_.HistoricPriceChart.add_data(this_.line_data);
			});
		// vizfin_.AJAX.get_data_series_history(this._x_source_id, function(error, data){
		// 	data.forEach(function(d){
		// 		this_.raw_data.add_entry_by_name_idx(d[0], x_idx, d[1]);
		// 	});
		// });
		// vizfin_.AJAX.get_data_series_history(this._y_source_id, function(error, data){
		// 	data.forEach(function(d){
		// 		this_.raw_data.add_entry_by_name_idx(d[0], y_idx, d[1]);
		// 	});
		// });
		// 3) Do Data Differentiation over time

		// 3) (Any way to verify that the time has no gaps?)
		// 4) Send differentiated data to chart
		// 5) Create and draw trend lines
		// 6) Solve for option equivalence

	};

	vizfin_.StockStats = StockStats;
})(vizfin);

