/*
	TODOS:
	1) Create rules for max beta line lengths
	2) Implement clustering so that outliers don't affect Beta
*/

'use strict'
var vizfin = vizfin || {};

(function(vizfin_){
	//////////////////////////////////////////////////////////////////////////////
	// CHART CONSTANTS
	//////////////////////////////////////////////////////////////////////////////
	var CHART_MARGINS = { top: 4, rght: 2, btm: 2, left: 6 };
	//////////////////////////////////////////////////////////////////////////////
	// CHART DEFINITION
	//////////////////////////////////////////////////////////////////////////////
	var BetaScatterChart = function(svg_) {
		var svg_width_ = svg_.attr('width') || 0;
		var svg_height_ = svg_.attr('height') || 0;
		this.svg_group = svg_
			.append('g')
				.classed('scatter_chart_g', true);
		this.chart_area = this.svg_group
			.append('g')
				.classed('chart_g', true)
				.attr('transform', 'translate('+CHART_MARGINS.left+','+CHART_MARGINS.top+')');
		this.chart_data = [];
		// Add Scales
		this.x_scale = d3.scale.linear()
			.range([0, svg_width_ - CHART_MARGINS.rght - CHART_MARGINS.left]);
		this.y_scale = d3.scale.linear()
			.range([svg_height_ - CHART_MARGINS.btm - CHART_MARGINS.top, 0]);
		// Add Axes
		this.x_axis = d3.svg.axis()
			.orient('bottom')
			.scale(this.x_scale);
		this.y_axis = d3.svg.axis()
			.orient('left')
			.scale(this.y_scale);
		this.x_axis_svg = this.svg_group
			.append('g')
			.classed('axis', true);
		this.y_axis_svg = this.svg_group
			.append('g')
			.classed('axis', true);
		// Add Points Holder
		this.points_group = this.chart_area
			.append('g')
			.attr('id', 'points_group');
		this.points = this.points_group
			.selectAll('circle');
		// Add Line Holder
		this.line_group = this.chart_area
			.append('g')
			.attr('id', 'line_group');
	};
	BetaScatterChart.prototype.add_data = function(raw_data_) {
		// this.chart_data = vizfin_.Help.get_ScatterChart_testData(); // DEBUG
		this.chart_data = raw_data_;
		// Redefine Scale Domains
		// Doing this here, and not in every re-draw, for efficiency reasons.
		var extent = d3.extent(this.chart_data.map(function(d){return d.x;}));
		this.x_scale.domain(
			[round_up(Math.min(extent[0], -extent[1]), 1), 
			 round_up(Math.max(-extent[0], extent[1]), 1)]
		);
		var extent = d3.extent(this.chart_data.map(function(d){return d.y;}));
		this.y_scale.domain(
			[round_up(Math.min(extent[0], -extent[1]), 1), 
			 round_up(Math.max(-extent[0], extent[1]), 1)]
		);
		this.x_axis_svg.call(this.x_axis);
		this.y_axis_svg.call(this.y_axis);
		this.draw();
	}
	BetaScatterChart.prototype.redefine_y_scale_domain = function() {
		// Do nothing. Here for calibrate_canvas function
	};
	BetaScatterChart.prototype.redefine_translation = function() {
		// Do nothing. Here for calibrate_canvas function
	};
	BetaScatterChart.prototype.redefine_y_scale_range = function(svg_height_) {
		this.y_scale.range([svg_height_ - CHART_MARGINS.btm - CHART_MARGINS.top, 0]);
		this.x_axis_svg
			.attr('transform', 'translate('+CHART_MARGINS.left+','+(svg_height_/2)+')');
		this.x_axis_svg.call(this.x_axis);
		this.y_axis_svg.call(this.y_axis);
		this.draw();
	};
	BetaScatterChart.prototype.redefine_location = function(x_loc, y_loc) {
		this.svg_group.attr('transform', 'translate('+x_loc+','+y_loc+')');
	};
	BetaScatterChart.prototype.redefine_x_scale_domain = function() {
		// Do nothing. Here for calibrate_canvas function
	};
	BetaScatterChart.prototype.redefine_x_scale_range = function(svg_width_) {
		this.x_scale.range([0, svg_width_ - CHART_MARGINS.rght - CHART_MARGINS.left]);
		this.y_axis_svg
			.attr('transform', 'translate('+(svg_width_/2)+','+CHART_MARGINS.top+')');
		this.x_axis_svg.call(this.x_axis);
		this.y_axis_svg.call(this.y_axis);
		this.draw();
	};
	BetaScatterChart.prototype.draw_points = function() {
		var this_ = this;
		this.points = this.points.data(this.chart_data);
		// Update Existing Points
		var point_update = this.points
			.attr('transform', function(d){
				return 'translate('+this_.x_scale(d.x)+','+this_.y_scale(d.y)+')';
			})
			.style('fill', function(d){
				if( d.x > 0 ){
					return 'blue';
				} else {
					return 'red';
				}
			});
		// Create New Points
		var point_enter = this.points
			.enter()
				.append('circle')
			.classed('point', true)
			.attr('transform', function(d){
				return 'translate('+this_.x_scale(d.x)+','+this_.y_scale(d.y)+')';
			})
			.attr('r', 3)
			.style('fill', function(d){
				if( d.x > 0 ){
					return 'blue';
				} else {
					return 'red';
				}
			})
			.on('mousedown', function(d){
				console.log(d.dt);
				console.log(d.x);
				console.log(d.y);
			});
		;
		// Remove Old Points
		this.points.exit().remove();
	};
	BetaScatterChart.prototype.draw_lines = function() {
		// Determine Equations
		var up_market = this.chart_data.filter(function(d){return d.x >= 0;});
		var dn_market = this.chart_data.filter(function(d){return d.x < 0;});
		var up_slp, up_int, up_crl;
		[up_slp, up_int, up_crl] = leastSquares(up_market.map(function(d){return d.x;}), up_market.map(function(d){return d.y;}))
		var dn_slp, dn_int, dn_crl;
		[dn_slp, dn_int, dn_crl] = leastSquares(dn_market.map(function(d){return d.x;}), dn_market.map(function(d){return d.y;}))
		// Draw
		// Draw | Remove All Lines
		d3.selectAll('.beta_line').remove();

		// Draw | Draw Up Line
		var up_mkt_path = vizfin_.generate_path(
			[[0, up_int],
			[this.x_scale.domain()[1], up_int + this.x_scale.domain()[1]*up_slp]], 
			this.x_scale, this.y_scale, false);
		this.line_group
			.append('svg:path')
				.classed('beta_line', true)
				.attr('id', 'up_mkt_line')
				.attr('d', up_mkt_path);
		// Draw | Draw Down Line
		var dn_mkt_path = vizfin_.generate_path(
			[[0, dn_int],
			[this.x_scale.domain()[0], dn_int + this.x_scale.domain()[0]*dn_slp]], 
			this.x_scale, this.y_scale, false);
		this.line_group
			.append('svg:path')
				.attr('class', 'beta_line')
				.attr('id', 'dn_mkt_line')
				.attr('d', dn_mkt_path)
		;
	};
	BetaScatterChart.prototype.draw = function() {
		if( this.chart_data.length > 0 ) {
			this.draw_points();
			this.draw_lines();
		}
	};

	vizfin_.BetaScatterChart = BetaScatterChart;

})(vizfin);

