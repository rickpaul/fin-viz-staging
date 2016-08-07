var AXIS_MARGIN_LEFT = 25;
var AXIS_MARGIN_BOTTOM = 20;


var LinearSDChart = function(svg_){
	this.svg = svg_;
	var svg_width_ = this.svg.attr('width') || 0;
	var svg_height_ = this.svg.attr('height') || 0;
	// Create Supply Demand Display
	var svg_group = this.svg
		.append('g')
			.classed('sd_chart', true);

	// add Charting Area
	var chart_area = svg_group.append('g')
		.attr('class', 'chart_area')
		.attr('transform', 'translate('+AXIS_MARGIN_LEFT+',0)');

	// add (P)rice axis scale
	this.p_scale = d3.scale.linear()
		.range([svg_height_ - AXIS_MARGIN_BOTTOM, 0]);
	// add (P)rice axis
	this.p_axis = d3.svg.axis().orient('left').scale(this.p_scale);
	this.p_axis_svg = svg_group.append('g')
		.attr('class', 'axis')
		.attr('transform', 'translate('+AXIS_MARGIN_LEFT+',0)')
		.call(this.p_axis);
	// add (Q)uantity axis scale
	this.q_scale = d3.scale.linear()
		.domain([0, Math.max(num_shops, num_citizens)])
		.range([0, svg_width_ - AXIS_MARGIN_LEFT]);
	// add (Q)uantity axis
	this.q_axis = d3.svg.axis().orient('bottom').scale(this.q_scale);
	this.q_axis_svg = svg_group.append('g')
		.attr('class', 'axis')
		.attr('transform', 'translate('+AXIS_MARGIN_LEFT+','+(svg_height_-AXIS_MARGIN_BOTTOM)+')')
		.call(this.q_axis);
	// add Supply Line
	this.supply_line = chart_area.append('path')
		.classed('supply_line', true);
	// add Demand Line
	this.demand_line = chart_area.append('path')
		.classed('demand_line', true);

	this.supplier_data = null; // actual values of the supply/demand curve
	this.demander_data = null;
}

LinearSDChart.prototype = {
	define_p_scale_domain: function() {
		'use strict'
		console.log('Defining Price Domain.'); // DEBUG
		this.p_scale.domain(
			d3.extent(
				this.supplier_data.map(function(d){return d.sell_price;}).concat(
				this.demander_data.map(function(d){return d.buy_price;}))
			)
		);
		// Rescale Axis
		this.p_axis_svg.call(this.p_axis);
	},
	define_q_scale_domain: function() {
		'use strict'
		var max_val = Math.max(this.supplier_data.length, this.demander_data.length);
		this.q_scale.domain([0, max_val]);
		// Rescale Axis
		this.q_axis_svg.call(this.q_axis);
	},
	redefine_scales: function() {
		this.define_svg_width(this.svg.attr('width'));
		this.define_svg_height(this.svg.attr('height'));
	},
	define_svg_width: function(svg_width_) {
		// Redefine Scale Range
		this.q_scale.range([0, svg_width_ - AXIS_MARGIN_LEFT]);
		// Rescale Axis
		this.q_axis.scale(this.q_scale);
	},
	define_svg_height: function(svg_height_) {
		// Redefine Scale Range
		this.p_scale.range([svg_height_ - AXIS_MARGIN_BOTTOM, 0]);
		// Rescale Axis
		this.p_axis.scale(this.p_scale);
		this.q_axis_svg
			.attr('transform', 'translate('+AXIS_MARGIN_LEFT+','+(svg_height_-AXIS_MARGIN_BOTTOM)+')');
	},
	add_supplier_data: function(suppliers_) {
		this.supplier_data = suppliers_.sort(function(a,b){
			return a.sell_price - b.sell_price;
		});
	},
	add_demander_data: function(demanders_) {
		this.demander_data = demanders_.sort(function(a,b){
			return b.buy_price - a.buy_price;
		});
	},
	display: function() {
		if(!this.supplier_data || !this.demander_data) { 
			console.log('Data not found.');
			return; }
		// redefine scales
		this.define_p_scale_domain();
		this.define_q_scale_domain();
		var this_ = this;
		// draw demand line
		this.demand_line
			.datum(this.demander_data)
			.attr('d', d3.svg.line()
				.interpolate('linear')
				.x(function(d, i){return this_.q_scale(i);})
				.y(function(d){return this_.p_scale(d.buy_price);})
			);
		// draw supply line
		this.supply_line
			.datum(this.supplier_data)
			.attr('d', d3.svg.line()
				.interpolate('linear')
				.x(function(d, i){return this_.q_scale(i);})
				.y(function(d){return this_.p_scale(d.sell_price);})
			);
	},


}