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
		return 'SEC_'+sec_ticker+'_PRICE_CLOSE'
	}

	function StockStats(beta_svg){
		this.periodicity = periodicity_consts.daily;
		this.period_diff = 30;
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
				vizfin_.get_data_series_id(value, function(error, source_id){
					if(error) { this_._errors.push(['load x_source_id', error]); }
					if(source_id === null) { 
						this_._errors.push(['load x_source_id', 'source id not found']); 
					} else {
						this_._x_source_id = +source_id;	
					}
				})
			},
		});
		Object.defineProperty(this, 'y_ticker', {
			set: function(value) {
				this._y_ticker = value;
				this._y_db_ticker = convert_ticker(value);
				var this_ = this;
				vizfin_.get_data_series_id(value, function(error, source_id){
					if(error) { this_._errors.push(['load y_source_id', error]); }
					if(source_id === null) { 
						this_._errors.push(['load y_source_id', 'source id not found']); 
					} else {
						this_._y_source_id = +source_id;	
					}
				})
			},
		});
	};
	StockStats.prototype.constructor = StockStats;
	StockStats.prototype.get_negative_trend_line = function(start_y, end_y) {

	};
	StockStats.prototype.get_positive_trend_line = function(start_y, end_y) {

	};
	StockStats.prototype.load_data = function() {
		// 1) Set x_ticker, y_ticker,
		this.x_ticker = 'SEC_SPY_PRICE_CLOSE'; // DEBUG
		this.y_ticker = 'SEC_AAPL_PRICE_CLOSE'; // DEBUG
		// 2) Load data into Matrix Dictionary
		this.data_ = new Matrix_Dictionary();
		var x_idx = this.data_.add_col('x');
		var y_idx = this.data_.add_col('y');
		vizfin_.get_data_series_history(this._x_source_id, function(d){
			
		})

		// 3) Achieve Data Differentiation over time
		// 3) (Any way to verify that the time has no gaps?)
		// 4) Send differentiated data to chart
		// 5) Create and draw trend lines
		// 6) Solve for option equivalence

	};
	StockStats.prototype.load_data = function() {

	};

	vizfin_.StockStats = StockStats;
})(vizfin);

