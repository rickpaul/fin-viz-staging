/*
	TODO: Rename x_val and y_val to something else.
*/

'use strict'
var vizfin = vizfin || {};

(function(vizfin_){
	//////////////////////////////////////////////////////////////////////////////
	// CHART CONSTANTS
	//////////////////////////////////////////////////////////////////////////////
	var CHART_MARGINS = { top: 10, rght: 10, btm: 10, left: 26 };
	//////////////////////////////////////////////////////////////////////////////
	// CHART DEFINITION
	//////////////////////////////////////////////////////////////////////////////
	var LineChart = function(svg_) {
		var svg_width_ = svg_.attr('width') || 0;
		var svg_height_ = svg_.attr('height') || 0;
		this.svg_group = svg_
			.append('g')
				.classed('line_chart_g', true);
		this.chart_area = this.svg_group
			.append('g')
				.classed('chart_g', true)
				.attr('transform', 'translate('+CHART_MARGINS.left+','+CHART_MARGINS.top+')');
		this.chart_data = [];
		// Add Scales
		this.x_scale = d3.time.scale()
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
			.classed('axis', true)
			.attr('transform', 'translate('+CHART_MARGINS.left+','+CHART_MARGINS.top+')');
		// Add Line Holder
		this.line_metadata = {};
	};
	LineChart.prototype.add_line = function(dict_ref, css_id) {
		this.line_metadata[dict_ref] = {
			css_id: css_id
		};
	};
	LineChart.prototype.add_data = function(line_data_) {
		// Save Chart Data
		this.chart_data = line_data_;

		var data_keys = Object.keys(this.line_metadata);
		var extent = vizfin_.Help.extent_reduce_dict(this.chart_data, data_keys);
		// Redefine Scale Domains
		// Doing this here, and not in every re-draw, for efficiency reasons.
		// Can do the following because y_data is always above 0
		this.y_scale.domain([ round_down(extent[0], 1), round_up(extent[1], 1) ]);
		// data is time-sorted
		var l = this.chart_data.length;
		this.x_scale.domain([ this.chart_data[0].dt, this.chart_data[l-1].dt]);
		// Call Scale
		this.x_axis_svg
			.attr('transform', 'translate('+CHART_MARGINS.left+','+(this.y_scale(1)+CHART_MARGINS.top)+')')
			.call(this.x_axis);
		this.y_axis_svg
			.call(this.y_axis);
		this.draw();
	};
	LineChart.prototype.redefine_y_scale_domain = function() {
		// Do nothing. Here for calibrate_canvas function
		// Domain set in add_data for efficiency.
	};
	LineChart.prototype.redefine_translation = function() {
		// Do nothing. Here for calibrate_canvas function
	};
	LineChart.prototype.redefine_y_scale_range = function(svg_height_) {
		this.y_scale.range([svg_height_ - CHART_MARGINS.btm - CHART_MARGINS.top, 0]);
		this.y_axis_svg
			.call(this.y_axis);
		this.draw();
	};
	LineChart.prototype.redefine_location = function(x_loc, y_loc) {
		// Do nothing unique.
		this.svg_group.attr('transform', 'translate('+x_loc+','+y_loc+')');
	};
	LineChart.prototype.redefine_x_scale_domain = function() {
		// Do nothing. Here for calibrate_canvas function
		// Domain set in add_data for efficiency.
	};
	LineChart.prototype.redefine_x_scale_range = function(svg_width_) {
		this.x_scale.range([0, svg_width_ - CHART_MARGINS.rght - CHART_MARGINS.left]);
		this.x_axis_svg
			.attr('transform', 'translate('+CHART_MARGINS.left+','+(this.y_scale(1)+CHART_MARGINS.top)+')')
			.call(this.x_axis);
		this.draw();
	};
	LineChart.prototype.draw = function() {
		// Remove All Lines
		d3.selectAll('.chart_line').remove();
		// Draw Lines
		var this_ = this;
		var data_keys = Object.keys(this.line_metadata);
		data_keys.forEach(function(dict_ref){
			this_.chart_area.append('svg:path')
				.datum(this_.chart_data)
				.classed('chart_line', true)
				.attr('id', this_.line_metadata[dict_ref].css_id)
				.attr('d', d3.svg.line()
					.interpolate('linear')
					.x(function(d){ return this_.x_scale(d.dt); })
					.y(function(d, i){ return this_.y_scale( d[dict_ref] ); })
				);
		});
	};

	vizfin_.LineChart = LineChart;

})(vizfin);

