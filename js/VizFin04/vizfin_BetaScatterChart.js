'use strict'
var vizfin = vizfin || {};

(function(global_ref){
	//////////////////////////////////////////////////////////////////////////////
	// CHART CONSTANTS
	//////////////////////////////////////////////////////////////////////////////
	var CHART_MARGINS = { top: 20, right: 20, bottom: 20, left: 20 };
	//////////////////////////////////////////////////////////////////////////////
	// CHART DEFINITION
	//////////////////////////////////////////////////////////////////////////////
	var BetaScatterChart = function(svg_) {
		this.svg = svg_;
		var svg_width_ = this.svg.attr('width') || 0;
		var svg_height_ = this.svg.attr('height') || 0;
		var svg_group = this.svg
			.append('g')
				.classed('scatter_chart_g', true);
		this.chart_area = svg_group
			.append('g')
				.classed('chart_g', true)
				.attr('transform', 'translate('+CHART_MARGINS.left+','+CHART_MARGINS.top+')')
			;
		this.chart_data = [];
		// Add Scales
		this.x_scale = d3.scale.linear()
			.range([0, svg_width_ - CHART_MARGINS.right - CHART_MARGINS.left]);
		this.y_scale = d3.scale.linear()
			.range([svg_height_ - CHART_MARGINS.bottom - CHART_MARGINS.top, 0]);
		// Add Axes
		this.x_axis = d3.svg.axis()
			.orient('bottom')
			.scale(this.x_scale);
		this.y_axis = d3.svg.axis()
			.orient('left')
			.scale(this.y_scale);
		this.x_axis_svg = svg_group
			.append('g')
			.classed('axis', true);
		this.y_axis_svg = svg_group
			.append('g')
			.classed('axis', true);
		// Add Points Holder
		this.points = this.chart_area
			.append('g')
			.selectAll('g')
			.classed('point', true);
	};
	BetaScatterChart.prototype.add_data = function(raw_data_) {
		// this.chart_data = global_ref.Help.get_ScatterChart_testData(); // DEBUG
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
		this.y_scale.range([svg_height_ - CHART_MARGINS.bottom - CHART_MARGINS.top, 0]);
		this.x_axis_svg
			.attr('transform', 'translate('+CHART_MARGINS.left+','+(svg_height_/2)+')');
		this.x_axis_svg.call(this.x_axis);
		this.y_axis_svg.call(this.y_axis);
		this.draw();
	};
	BetaScatterChart.prototype.redefine_x_scale_domain = function() {
		// Do nothing. Here for calibrate_canvas function
	};
	BetaScatterChart.prototype.redefine_x_scale_range = function(svg_width_) {
		this.x_scale.range([0, svg_width_ - CHART_MARGINS.right - CHART_MARGINS.left]);
		this.y_axis_svg
			.attr('transform', 'translate('+(svg_width_/2)+','+CHART_MARGINS.top+')');
		this.x_axis_svg.call(this.x_axis);
		this.y_axis_svg.call(this.y_axis);
		this.draw();
	};
	BetaScatterChart.prototype.draw = function() {
		var this_ = this;
		this.points = this.points.data(this.chart_data);
		// Place Circle Locations
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

		this.points.exit().remove();
	};

	global_ref.BetaScatterChart = BetaScatterChart;

})(vizfin);

