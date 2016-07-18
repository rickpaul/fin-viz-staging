'use strict'
var vizfin = vizfin || {};

(function(global_ref, d3){

	var MARGINS = {
		top: 100,
		btm: 100,
		left: 120,
		rght: 120,
	}

	var width = 400;
	var brace_width = 20; // measured in pixels
	var brace_space = .9; // measured in scaled units (width, height in 100's.)

	var FCInv_Display = function(svg_) {
		////////////////////////////////////////////////////////////////////////
		// Display Variables 
		////////////////////////////////////////////////////////////////////////
		this.svg = svg_;
		this.svg_group = this.svg
			.append('g')
				.classed('FCInv_Display', true);
		this.x_scale = d3.scale.linear()
			.domain([-50, 50]);
		this.y_scale = d3.scale.linear()
			.domain([-50, 50]);

		////////////////////////////////////////////////////////////////////////
		// Financial Variables 
		////////////////////////////////////////////////////////////////////////
		this._bgn_gross_PPE = 300;
		this._end_gross_PPE = 300;
		this._bgn_acc_depr = 300;
		this._end_acc_depr = 300;
		this._bgn_net_PPE = 300;
		this._end_net_PPE = 300;
		this._depr = 300;
		this._gain_on_asset_sales = 300;
		this._cap_ex = 300;
		Object.defineProperty(this, 'bgn_gross_PPE', {
			get: function() { return this._bgn_gross_PPE; },
			set: function(value_) { this._bgn_gross_PPE = value_; },
		});
		Object.defineProperty(this, 'end_gross_PPE', {
			get: function() { return this._end_gross_PPE; },
			set: function(value_) { this._end_gross_PPE = value_; },
		});
		Object.defineProperty(this, 'bgn_acc_depr', {
			get: function() { return this._bgn_acc_depr; },
			set: function(value_) { this._bgn_acc_depr = value_; },
		});
		Object.defineProperty(this, 'end_acc_depr', {
			get: function() { return this._end_acc_depr; },
			set: function(value_) { this._end_acc_depr = value_; },
		});
		Object.defineProperty(this, 'bgn_net_PPE', {
			get: function() { return this._bgn_net_PPE; },
			set: function(value_) { this._bgn_net_PPE = value_; },
		});
		Object.defineProperty(this, 'end_net_PPE', {
			get: function() { return this._end_net_PPE; },
			set: function(value_) { this._end_net_PPE = value_; },
		});
		Object.defineProperty(this, 'depr', {
			get: function() { return this._depr; },
			set: function(value_) { this._depr = value_; },
		});
		Object.defineProperty(this, 'cap_ex', {
			get: function() { return this._depr; },
			set: function(value_) { this._depr = value_; },
		});
		Object.defineProperty(this, 'gain_on_asset_sales', {
			get: function() { return this._gain_on_asset_sales; },
			set: function(value_) { this._gain_on_asset_sales = value_; },
		});
		Object.defineProperty(this, 'fxd_cap_inv_1', {
			get: function() { return this.end_gross_PPE - this.bgn_gross_PPE; },
		});
		Object.defineProperty(this, 'fxd_cap_inv_2', {
			get: function() { return this.cap_ex - this.gain_on_asset_sales; },
		});
	};
	FCInv_Display.prototype.redefine_translation = function(width_, height_){
		this.svg_group.attr('transform', 'translate('+(width_/2)+','+(height_/2)+')');
	};
	FCInv_Display.prototype.redefine_y_scale_domain = function(){
		return; // this.y_scale.domain([-50, 50]);
	};
	FCInv_Display.prototype.redefine_x_scale_domain = function(){
		return; // this.y_scale.domain([-50, 50]);
	};
	FCInv_Display.prototype.redefine_y_scale_range = function(height_){
		this.y_scale.range([-0.5*height_ + MARGINS.top, 0.5*height_ - MARGINS.btm]);
	};
	FCInv_Display.prototype.redefine_x_scale_range = function(width_){
		this.x_scale.range([-0.5*width_ + MARGINS.left, 0.5*width_ - MARGINS.rght]);
	};
	FCInv_Display.prototype.draw = function(){
		d3.selectAll('.grouping').remove();
		// d3.selectAll('rect').remove();
		// d3.selectAll('path').remove();
		// d3.selectAll('text').remove();
		var position = {
			h_: 10,
			w_: 16,
		};
		var x_loc_mult = 28;
		var y_loc_mult = 20;
		// Draw Middle Column
		position.x_ = 0;
		position.y_ = 0;
		this.draw_rect(this.svg_group, 'depreciation', position, 'Depreciation');
		position.y_ = -y_loc_mult;
		this.draw_rect(this.svg_group, 'bgn_acc_depr', position, 'Accum. Depr.');
		position.y_ = y_loc_mult;
		this.draw_rect(this.svg_group, 'end_acc_depr', position, 'Accum. Depr.');
		// Draw Middle Column Equation Symbols
		position.y_ = y_loc_mult/2;
		this.draw_equation_text(this.svg_group, 'equals', position, '=');
		position.y_ = -y_loc_mult/2;
		this.draw_equation_text(this.svg_group, 'plus', position, '+');
		// Draw Left Column
		position.x_ = -x_loc_mult;
		position.y_ = -y_loc_mult;
		this.draw_rect(this.svg_group, 'bgn_gross_PPE', position, 'Gross PPE');
		position.y_ = 0;
		this.draw_rect(this.svg_group, 'fixed_cap_inv', position, 'FC Investment');
		position.y_ = y_loc_mult;
		this.draw_rect(this.svg_group, 'end_gross_PPE', position, 'Gross PPE');
		// Draw Left Column Equation Symbols
		position.y_ = y_loc_mult/2;
		this.draw_equation_text(this.svg_group, 'equals', position, '=');
		position.y_ = -y_loc_mult/2;
		this.draw_equation_text(this.svg_group, 'plus', position, '+');
		// Draw Right Column
		position.x_ = x_loc_mult;
		position.y_ = -y_loc_mult;
		this.draw_rect(this.svg_group, 'bgn_net_PPE', position, 'Net PPE');
		position.y_ = 0;
		this.draw_rect(this.svg_group, 'fixed_cap_growth', position, 'FC Growth', '(FC Inv. - Depr.)');
		position.y_ = y_loc_mult;
		this.draw_rect(this.svg_group, 'end_net_PPE', position, 'Net PPE');
		// Draw Right Column Equation Symbols
		position.y_ = y_loc_mult/2;
		this.draw_equation_text(this.svg_group, 'equals', position, '=');
		position.y_ = -y_loc_mult/2;
		this.draw_equation_text(this.svg_group, 'plus', position, '+');

		// Draw First Row Equation Symbols
		position.y_ = -y_loc_mult;
		position.x_ = -x_loc_mult/2;
		this.draw_equation_text(this.svg_group, 'equals', position, '-');
		position.x_ = x_loc_mult/2;
		this.draw_equation_text(this.svg_group, 'plus', position, '=');
		// Draw Middle Row Equation Symbols
		position.y_ = 0;
		position.x_ = -x_loc_mult/2;
		this.draw_equation_text(this.svg_group, 'equals', position, '-');
		position.x_ = x_loc_mult/2;
		this.draw_equation_text(this.svg_group, 'plus', position, '=');
		// Draw Last Row Equation Symbols
		position.y_ = y_loc_mult;
		position.x_ = -x_loc_mult/2;
		this.draw_equation_text(this.svg_group, 'equals', position, '-');
		position.x_ = x_loc_mult/2;
		this.draw_equation_text(this.svg_group, 'plus', position, '=');

		// Draw Left Brackets
		position.h_ *= 1.5;
		position.y_ = -y_loc_mult - position.h_/2;
		position.x_ = -x_loc_mult - position.w_/2 - brace_space;
		// Draw First Row Left Bracket
		this.draw_external_label(this.svg_group, 'bgn_bracket_left', position, 'Begin', true);
		// Draw Last Row Left Bracket
		position.y_ = y_loc_mult - position.h_/2;
		this.draw_external_label(this.svg_group, 'end_bracket_left', position, 'End', true);
		// Draw Right Brackets
		// Draw First Row Right Bracket
		position.y_ = -y_loc_mult - position.h_/2;
		position.x_ = x_loc_mult + position.w_/2 + brace_space;
		this.draw_external_label(this.svg_group, 'bgn_bracket_left', position, '', false);
		// Draw Last Row Right Bracket
		position.y_ = y_loc_mult - position.h_/2;
		this.draw_external_label(this.svg_group, 'end_bracket_left', position, '', false);

	};
	FCInv_Display.prototype.draw_rect = function(parent_element, id_prefix, position, text, text2) {
		var c_x = position.x_;
		var c_y = position.y_;
		var w_ = position.w_;
		var h_ = position.h_;
		var group = parent_element.append('g')
			.classed('grouping', true)
			.attr('id', id_prefix+'_g')
			.attr('transform', 'translate('+this.x_scale(c_x-w_/2)+','+this.y_scale(c_y-h_/2)+')');
		group.append('rect')
			.attr('width', this.x_scale(w_))
			.attr('height', this.y_scale(h_))
			.attr('x', 0)
			.attr('y', 0)
			.attr('id', id_prefix+'_rect');
		if(text) {
			if(text2) {
				var o_ = 6;
				group.append('text')
					.attr('transform', 'translate('+this.x_scale(w_/2)+','+(this.y_scale(h_/2)+4+o_)+')')
					.attr('id', id_prefix+'_text')
					.classed('internal_label', true)
					.text(text2);
			} else {
				var o_ = 0;
			}
			group.append('text')
				.attr('transform', 'translate('+this.x_scale(w_/2)+','+(this.y_scale(h_/2)+4-o_)+')')
				.attr('id', id_prefix+'_text')
				.classed('internal_label', true)
				.text(text);
		}
	};
	FCInv_Display.prototype.draw_equation_text = function(parent_element, id_prefix, position, text) {
		var c_x = position.x_;
		var c_y = position.y_;
		parent_element.append('g')
			.classed('grouping', true)
		.append('svg:text')
			.attr('id', id_prefix+'_text')
			.attr('transform', 'translate('+this.x_scale(c_x)+','+(this.y_scale(c_y)+7)+')')
			.classed('equation_text', true)
			.text(text);
	};
	FCInv_Display.prototype.draw_external_label = function(parent_element, id_prefix, position, text, left) {
		var group = parent_element.append('g')
			.classed('grouping', true);
		this.draw_curly_brace(group, id_prefix, position, left);
		if( text !== '') {
			this.draw_curly_brace_label(group, id_prefix, position, text, left);
		}
	}
	FCInv_Display.prototype.draw_curly_brace_label = function(parent_element, id_prefix, position, text, left) {
		var x_pos = position.x_; // really just a vertical line, so c_x = x
		var y_pos = position.y_;
		var h_ = position.h_;
		if (left) {
			var x_ = (this.x_scale(x_pos) - brace_width - brace_space/2 - 10);
			var r_ = -90;
		} else {
			var x_ = (this.x_scale(x_pos) + brace_width + brace_space/2 + 10);
			var r_ = 90;
		}
		parent_element.append('svg:text')
			.attr('transform', 'translate('+x_+','+this.y_scale(y_pos + h_/2)+') rotate('+r_+')')
			.classed('curly_brace_label', true)
			.classed('active', true)
			.attr('id', id_prefix+'_bracket_text')
			.text(text);
	};
	FCInv_Display.prototype.draw_curly_brace = function(parent_element, id_prefix, position, left) {
		var x_pos = position.x_; // really just a vertical line, so c_x = x
		var y_pos = position.y_;
		var h_ = position.h_;
		if (left) {
			var d_ = global_ref.get_curly_brace_path(0, 0, 0, this.y_scale(h_), brace_width, .5);
		} else {
			var d_ = global_ref.get_curly_brace_path(0, this.y_scale(h_), 0, 0, brace_width, .5);
		}
		parent_element.append('svg:path')
			.attr('transform', 'translate('+this.x_scale(x_pos)+','+this.y_scale(y_pos)+')')
			.classed('curly_brace_path', true)
			.classed('active', true)
			.attr('id', id_prefix+'_bracket_path')
			.attr('d', d_);
	};

	global_ref.FCInv_Display = FCInv_Display;
})(vizfin, window.d3);