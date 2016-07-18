'use strict'
var vizfin = vizfin || {};

(function(global_ref){

	var MARGINS = {
		top: 100,
		btm: 100,
		left: 120,
		rght: 120,
	};
	var BOX_POS = {
		x_mult: 28,
		y_mult: 20,
		h_: 10,
		w_: 16,
	};

	var brace_width = 20; // measured in pixels
	var brace_space = .9; // measured in scaled units (width, height in 100's.)
	//////////////////////////////////////////////////////////////////////////
	// FCInv_Display Constructor
	//////////////////////////////////////////////////////////////////////////
	function FCInv_Display(svg_) {
		////////////////////////////////////////////////////////////////////////
		// Call Super-Constructor
		////////////////////////////////////////////////////////////////////////
		vizfin.vizfin_Base.call(this, svg_);
		////////////////////////////////////////////////////////////////////////
		// Display Variables 
		////////////////////////////////////////////////////////////////////////
		this.x_scale.domain([-50, 50]);
		this.y_scale.domain([-50, 50]);
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
	}
	FCInv_Display.prototype = Object.create(vizfin.vizfin_Base.prototype)
	FCInv_Display.prototype.constructor = FCInv_Display;
	//////////////////////////////////////////////////////////////////////////
	// FCInv_Display Prototype Functions
	//////////////////////////////////////////////////////////////////////////
	FCInv_Display.prototype.redefine_translation = function(width_, height_){
		this.svg_group.attr('transform', 'translate('+(width_/2)+','+(height_/2)+')');
	};
	FCInv_Display.prototype.redefine_y_scale_range = function(height_){
		this.y_scale.range([-0.5*height_ + MARGINS.top, 0.5*height_ - MARGINS.btm]);
	};
	FCInv_Display.prototype.redefine_x_scale_range = function(width_){
		this.x_scale.range([-0.5*width_ + MARGINS.left, 0.5*width_ - MARGINS.rght]);
	};
	FCInv_Display.prototype.draw = function(){
		this.clear();
		this.draw_equation_symbols();
		var position = {
			h_: BOX_POS.h_,
			w_: BOX_POS.w_,
		};

		// Draw Middle Column
		position.x_ = 0;
		position.y_ = 0;
		this.draw_rect_center(this.svg_group, 'depreciation', position, 'Depreciation');
		position.y_ = -BOX_POS.y_mult;
		this.draw_rect_center(this.svg_group, 'bgn_acc_depr', position, 'Accum. Depr.');
		position.y_ = BOX_POS.y_mult;
		this.draw_rect_center(this.svg_group, 'end_acc_depr', position, 'Accum. Depr.');

		// Draw Left Column
		position.x_ = -BOX_POS.x_mult;
		position.y_ = -BOX_POS.y_mult;
		this.draw_rect_center(this.svg_group, 'bgn_gross_PPE', position, 'Gross PPE');
		position.y_ = 0;
		this.draw_rect_center(this.svg_group, 'fixed_cap_inv', position, 'FC Investment');
		position.y_ = BOX_POS.y_mult;
		this.draw_rect_center(this.svg_group, 'end_gross_PPE', position, 'Gross PPE');

		// Draw Right Column
		position.x_ = BOX_POS.x_mult;
		position.y_ = -BOX_POS.y_mult;
		this.draw_rect_center(this.svg_group, 'bgn_net_PPE', position, 'Net PPE');
		position.y_ = 0;
		this.draw_rect_center(this.svg_group, 'fixed_cap_growth', position, ['FC Growth', '(FC Inv. - Depr.)']);
		position.y_ = BOX_POS.y_mult;
		this.draw_rect_center(this.svg_group, 'end_net_PPE', position, 'Net PPE');


		// Draw Left Brackets
		position.h_ *= 1.5;
		position.y_ = -BOX_POS.y_mult - position.h_/2;
		position.x_ = -BOX_POS.x_mult - position.w_/2 - brace_space;
		// Draw First Row Left Bracket
		this.draw_external_label(this.svg_group, 'bgn_bracket_left', position, 'Begin', true);
		// Draw Last Row Left Bracket
		position.y_ = BOX_POS.y_mult - position.h_/2;
		this.draw_external_label(this.svg_group, 'end_bracket_left', position, 'End', true);
		// Draw Right Brackets
		// Draw First Row Right Bracket
		position.y_ = -BOX_POS.y_mult - position.h_/2;
		position.x_ = BOX_POS.x_mult + position.w_/2 + brace_space;
		this.draw_external_label(this.svg_group, 'bgn_bracket_left', position, '', false);
		// Draw Last Row Right Bracket
		position.y_ = BOX_POS.y_mult - position.h_/2;
		this.draw_external_label(this.svg_group, 'end_bracket_left', position, '', false);
	};

	FCInv_Display.prototype.draw_equation_symbols = function() {
		var group = this.svg_group.append('g')
				.classed('grouping', true)
				.attr('id', 'equation_symbols_g');
		var i = 0;
		var l_ = this.x_scale(-BOX_POS.x_mult/2);
		var r_ = this.x_scale(BOX_POS.x_mult/2);
		var t_ = this.y_scale(-BOX_POS.y_mult/2);
		var b_ = this.y_scale(BOX_POS.y_mult/2);
		var position = {};
		// Draw First Row Equation Symbols
		position.y_ = this.y_scale(-BOX_POS.y_mult);
		position.x_ = l_;
		this.draw_text(group, 'symbol', i++, 'equation_text', position, '-');
		position.x_ = r_;
		this.draw_text(group, 'symbol', i++, 'equation_text', position, '=');
		// Draw Middle Row Equation Symbols
		position.y_ = this.y_scale(0);
		position.x_ = l_
		this.draw_text(group, 'symbol', i++, 'equation_text', position, '-');
		position.x_ = r_;
		this.draw_text(group, 'symbol', i++, 'equation_text', position, '=');
		// Draw Last Row Equation Symbols
		position.y_ = this.y_scale(BOX_POS.y_mult);
		position.x_ = l_
		this.draw_text(group, 'symbol', i++, 'equation_text', position, '-');
		position.x_ = r_;
		this.draw_text(group, 'symbol', i++, 'equation_text', position, '=');

		// Draw Right Column Equation Symbols
		position.x_ = this.x_scale(BOX_POS.x_mult);
		position.y_ = t_;
		this.draw_text(group, 'symbol', i++, 'equation_text', position, '+');
		position.y_ = b_;
		this.draw_text(group, 'symbol', i++, 'equation_text', position, '=');
		// Draw Left Column Equation Symbols
		position.x_ = this.x_scale(-BOX_POS.x_mult);
		position.y_ = t_;
		this.draw_text(group, 'symbol', i++, 'equation_text', position, '+');
		position.y_ = b_;
		this.draw_text(group, 'symbol', i++, 'equation_text', position, '=');
		// Draw Middle Column Equation Symbols
		position.x_ = this.x_scale(0);
		position.y_ = t_;
		this.draw_text(group, 'symbol', i++, 'equation_text', position, '+');
		position.y_ = b_;
		this.draw_text(group, 'symbol', i++, 'equation_text', position, '=');
	}

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
})(vizfin);


