/*
	This code has many inefficiencies that could be cleaned up.
		It's not a big deal, since we're still relatively lightweight and 
		not drawing a lot. It is ugly though.
	Inefficiencies:
		1) 	Every time you get a rectangle size, it makes a recursive call 
				down the stack of rectangles it depends on.
		2) 	We're re-drawing every time we resize. We should take advantage 
				of d3's update.
*/
'use strict'
var vizfin = vizfin || {};

(function(global_ref){

	var MARGINS = {
		top: 60,
		btm: 40,
		left: 60,
		rght: 300,
	};

	var width = 400;
	var brace_width = 28;
	var brace_space = 5;

	////////////////////////////////////////////////////////////////////////
	// FCFF_Display Constructor 
	////////////////////////////////////////////////////////////////////////
	function FCFF_Display(svg_) {
		////////////////////////////////////////////////////////////////////////
		// Call Super-Constructor
		////////////////////////////////////////////////////////////////////////
		vizfin.vizfin_Base.call(this, svg_);

		this.title_group
			.append('svg:text')
		.text('Free Cash Flow to the Firm (FCFF)')
		.classed('title_text', true);
		////////////////////////////////////////////////////////////////////////
		// Financial Variables 
		////////////////////////////////////////////////////////////////////////
		this._revenue = 800;
		this._cost_of_revenue = 300;
		this._depreciation_amortization = 100;
		this._interest_expense = 50; // Can be calculated?
		this._fixed_capital_inv = -10;
		this._working_capital_inv = 20;
		this.operating_expenses = 200; // Can be calculated?
		this.tax_rate = 30/100; // Can be calculated?
		////////////////////////////////////////////////////////////////////////
		// FCFF DISPLAY Property Definitions | Private Variables Access
		////////////////////////////////////////////////////////////////////////
		Object.defineProperty(this, 'revenue', {
			get: function() { return this._revenue; },
			set: function(value_) { 
				this._revenue = value_; 
				this.redefine_y_scale_domain();
				this.draw();
			},
		});
		Object.defineProperty(this, 'cost_of_revenue', {
			get: function() { return this._cost_of_revenue; },
			set: function(value_) { this._cost_of_revenue = value_; },
		});
		Object.defineProperty(this, 'depreciation_amortization', {
			get: function() { return this._depreciation_amortization; },
			set: function(value_) { this._depreciation_amortization = value_; },
		});
		Object.defineProperty(this, 'interest_expense', {
			get: function() { return this._interest_expense; },
			set: function(value_) { this._interest_expense = value_; },
		});
		Object.defineProperty(this, 'fixed_capital_inv', {
			get: function() { return this._fixed_capital_inv; },
			set: function(value_) { 
				this._fixed_capital_inv = value_; 
				this.redefine_y_scale_domain();
				this.draw();
			},
		});
		Object.defineProperty(this, 'working_capital_inv', {
			get: function() { return this._working_capital_inv; },
			set: function(value_) { 
				this._working_capital_inv = value_; 
				this.redefine_y_scale_domain();
				this.draw();
			},
		});
		////////////////////////////////////////////////////////////////////////
		// FCFF DISPLAY Property Definitions | Calculated Financial Values
		////////////////////////////////////////////////////////////////////////
		Object.defineProperty(this, 'gross_profit', {
			get: function() { return (this.revenue - this.cost_of_revenue); },
		});
		Object.defineProperty(this, 'EBITDA', {
			get: function() { return (this.gross_profit - this.operating_expenses); },
		});
		Object.defineProperty(this, 'EBIT', {
			get: function() { return (this.EBITDA - this.depreciation_amortization); },
		});
		Object.defineProperty(this, 'operating_profit', {
			get: function() { return (this.EBIT); },
		});
		Object.defineProperty(this, 'operating_income', {
			get: function() { return (this.EBIT); }, // Not identical, but close enough for now.
		});
		////////////////////////////////////////////////////////////////////////
		// FCFF DISPLAY Property Definitions | Display Values
		////////////////////////////////////////////////////////////////////////

		Object.defineProperty(this, 'EBITDA_pos', {
			get: function() { 
				return {
					top: this.revenue-this.EBITDA,
					btm: this.revenue,
					left: 0,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'EBIT_pos', {
			get: function() { 
				return {
					top: this.revenue-this.EBIT,
					btm: this.revenue,
					left: 0,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'revenue_pos', {
			get: function() { 
				return {
					top: 0,
					btm: this.revenue,
					left: 0,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'cost_of_revenue_pos', {
			get: function() { 
				return {
					top: 0,
					btm: this.cost_of_revenue,
					left: 0,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'operating_expenses_pos', {
			get: function() { 
				return {
					top: this.cost_of_revenue_pos.btm,
					btm: this.cost_of_revenue_pos.btm+this.operating_expenses,
					left: 0,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'depreciation_amortization_pos', {
			get: function() { 
				return {
					top: this.operating_expenses_pos.btm,
					btm: this.operating_expenses_pos.btm+this.depreciation_amortization,
					left: 0,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'interest_expense_pos', {
			get: function() { 
				return {
					top: this.depreciation_amortization_pos.btm,
					btm: this.depreciation_amortization_pos.btm+this.interest_expense,
					left: 0,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'interest_tax_shield_pos', {
			get: function() { 
				return {
					top: this.depreciation_amortization_pos.btm,
					btm: this.depreciation_amortization_pos.btm+this.interest_expense,
					left: this.rect_width*(1-this.tax_rate),
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'paid_taxes_pos', {
			get: function() { 
				return {
					top: this.interest_expense_pos.btm,
					btm: this.revenue_pos.btm,
					left: this.rect_width*(1-this.tax_rate),
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'net_income_pos', {
			get: function() { 
				return {
					top: this.interest_expense_pos.btm,
					btm: this.revenue_pos.btm,
					left: 0,
					rght: this.rect_width*(1-this.tax_rate)
				};
			},
		});
		Object.defineProperty(this, 'working_capital_inv_pos', {
			get: function() {
				var return_ = {
					left: (this.rect_width*(1-this.tax_rate))/2,
					rght: this.rect_width*(1-this.tax_rate)
				};
				if ( this.working_capital_inv < 0 ) {
					return_.top = this.revenue_pos.btm;
					return_.btm = this.revenue_pos.btm-(this.working_capital_inv/(1-this.tax_rate))*2;
				} else {
					return_.top = this.revenue_pos.btm-(this.working_capital_inv/(1-this.tax_rate))*2;
					return_.btm = this.revenue_pos.btm;
				}
				return return_;
				// var return_ = {
				// 	left: 0,
				// 	rght: this.rect_width*(1-this.tax_rate)
				// };
				// if ( this.working_capital_inv < 0 && this.fixed_capital_inv < 0 ) {
				// 	return_.top = this.revenue_pos.btm;
				// 	return_.btm = this.revenue_pos.btm-this.working_capital_inv/(1-this.tax_rate);
				// } else if ( this.working_capital_inv > 0 && this.fixed_capital_inv < 0 ) {
				// 	return_.top = this.revenue_pos.btm-this.working_capital_inv/(1-this.tax_rate);
				// 	return_.btm = this.revenue_pos.btm;
				// 	return_.text_offset_rght = -30;
				// 	return_.text_offset_down = -3;
				// } else if ( this.working_capital_inv < 0 && this.fixed_capital_inv > 0 ) {
				// 	return_.top = this.revenue_pos.btm;
				// 	return_.btm = this.revenue_pos.btm-this.working_capital_inv/(1-this.tax_rate);
				// 	return_.text_offset_rght = -30;
				// } else { // ( this.working_capital_inv > 0 && this.fixed_capital_inv > 0 )
				// 	return_.top = this.fixed_capital_inv_pos.top-this.working_capital_inv/(1-this.tax_rate);
				// 	return_.btm = this.fixed_capital_inv_pos.top;
				// }
				// return return_;
			},
		});
		Object.defineProperty(this, 'fixed_capital_inv_pos', {
			get: function() {
				var return_ = {
					left: 0,
					rght: (this.rect_width*(1-this.tax_rate))/2
				};
				if ( this.fixed_capital_inv < 0 ) {
					return_.top = this.revenue_pos.btm;
					return_.btm = this.revenue_pos.btm-(this.fixed_capital_inv/(1-this.tax_rate))*2;
				} else {
					return_.top = this.revenue_pos.btm-(this.fixed_capital_inv/(1-this.tax_rate))*2;
					return_.btm = this.revenue_pos.btm;
				}
				return return_;
				// var return_ = {
				// 	left: 0,
				// 	rght: this.rect_width*(1-this.tax_rate)
				// };
				// if ( this.working_capital_inv < 0 && this.fixed_capital_inv < 0 ) {
				// 	return_.top = this.working_capital_inv_pos.btm;
				// 	return_.btm = this.working_capital_inv_pos.btm-this.fixed_capital_inv/(1-this.tax_rate);
				// } else if ( this.working_capital_inv > 0 && this.fixed_capital_inv < 0 ) {
				// 	return_.top = this.working_capital_inv_pos.top
				// 	return_.btm = this.working_capital_inv_pos.top-this.fixed_capital_inv/(1-this.tax_rate);
				// 	return_.text_offset_rght = 30;
				// 	return_.text_offset_down = (return_.top-return_.btm)/2 + 4;
				// } else if ( this.working_capital_inv < 0 && this.fixed_capital_inv > 0 ) {
				// 	return_.top = this.working_capital_inv_pos.btm-this.fixed_capital_inv/(1-this.tax_rate);
				// 	return_.btm = this.working_capital_inv_pos.btm;
				// 	return_.text_offset_rght = 30;
				// } else { // ( this.working_capital_inv > 0 && this.fixed_capital_inv > 0 )
				// 	return_.top = this.revenue_pos.btm-this.fixed_capital_inv/(1-this.tax_rate);
				// 	return_.btm = this.revenue_pos.btm;
				// }
				// return return_;
			},
		// 	get: function() { 
		// 		return {
		// 			top: this.interest_expense_pos.btm,
		// 			btm: ,
		// 			left: 0,
		// 			rght: this.rect_width*(1-this.tax_rate)
		// 		};
		// 	},
		});

		Object.defineProperty(this, 'rect_width', {
			get: function() { return width; },
		});
	};
	////////////////////////////////////////////////////////////////////////
	// FCFF DISPLAY Prototype Functions 
	////////////////////////////////////////////////////////////////////////
	FCFF_Display.prototype.redefine_y_scale_domain = function() {
		this.y_scale.domain([0, 
			d3.max([
				this.revenue, 
				this.revenue-this.fixed_capital_inv/(1-this.tax_rate)*2, 
				this.revenue-this.working_capital_inv/(1-this.tax_rate)*2])
		]);
	}
	FCFF_Display.prototype.redefine_translation = function(width_, height) {
		this.svg_group
			.attr('transform', 'translate('+(MARGINS.left+this._left_offset*(brace_width + brace_space))+','+MARGINS.top+')');
		this.title_group
			.attr('transform', 'translate('+( width_ / 2 )+','+(MARGINS.top / 2)+')');
	};
	FCFF_Display.prototype.redefine_y_scale_range = function(height_) {
		this.y_scale
			.range([0, height_ - MARGINS.top - MARGINS.btm]);
	};
	FCFF_Display.prototype.draw_rects = function() {
		this.draw_rect_corners(this.svg_group, 'revenue', this.revenue_pos, 'revenue');
		this.draw_rect_corners(this.svg_group, 'cost_of_revenue', this.cost_of_revenue_pos,  'Cost of Revenue');
		this.draw_rect_corners(this.svg_group, 'operating_expenses', this.operating_expenses_pos,  'Operating Expenses');
		this.draw_rect_corners(this.svg_group, 'depreciation_amortization', this.depreciation_amortization_pos, 'Depreciation and Amortization');
		this.draw_rect_corners(this.svg_group, 'interest_expense', this.interest_expense_pos,  'Interest Expense');
		this.draw_rect_corners(this.svg_group, 'interest_tax_shield', this.interest_tax_shield_pos,  'Tax Shield');
		this.draw_rect_corners(this.svg_group, 'taxes_paid', this.paid_taxes_pos, 'Taxes Paid');
		this.draw_rect_corners(this.svg_group, 'net_income', this.net_income_pos, 'Net Income');
		this.draw_rect_corners(this.svg_group, 'net_income', this.net_income_pos, 'Net Income');
		this.draw_rect_corners(this.svg_group, 'fc_inv', this.fixed_capital_inv_pos, 'FCInv');
		this.draw_rect_corners(this.svg_group, 'wc_inv', this.working_capital_inv_pos, 'WCInv');
	};
	FCFF_Display.prototype.draw_buttons = function() {
		var count = 0;
		
		var position = {
			left: this.rect_width + this._left_offset * (brace_width + brace_space),
			top: ((button_height + button_space) * count) + MARGINS.top,
		};
		position.rght = position.left + button_width
		position.btm = position.top + button_height;

	}
	FCFF_Display.prototype.draw_labels = function() {
		this.draw_external_label(this.svg_group, this.revenue_pos, 'revenue', 'Revenue', true);
		this.draw_external_label(this.svg_group, this.EBIT_pos, 'EBIT', 'EBIT');
		this.draw_external_label(this.svg_group, this.EBITDA_pos, 'EBITDA', 'EBITDA');
	};
	FCFF_Display.prototype.draw_external_label = function(parent_element, rect_position, id_prefix, text, left) {
		// Retrieve Rect Positioning
		var l_ = rect_position.left;
		var t_ = rect_position.top;
		var b_ = rect_position.btm;
		// Translate Positioning For Call to Base Draw
		var o_ = (left ? this._left_offset++ : this._rght_offset++);
		var s_ = (left ? -1 : 1) * o_ * (brace_width + brace_space);
		var position = {
			x_: (left ? 0 : this.rect_width) + s_,
			y_: t_,
			h_: (b_-t_),
			w_: brace_width,
		};
		// Create Parent Group
		var group = parent_element
			.append('g')
				.classed('grouping', true)
				.attr('id', id_prefix+'_bracket_g');				
		this.draw_curly_brace(group, id_prefix, position, left);
		this.draw_curly_brace_label(group, id_prefix, position, text, left);
	};

	FCFF_Display.prototype.draw_curly_brace_label = function(parent_element, id_prefix, position, text, left) {
		var o_ = (brace_width + brace_space/2 + 2);
		var pos_ = {
			x_: this.x_scale(position.x_) + (left ? -o_ : o_),
			y_: this.y_scale(position.y_ + position.h_/2),
			r_: (left ? -90 : 90),
		};
		this.draw_text(parent_element, id_prefix, '', 'external_label', pos_, text);
	};
	FCFF_Display.prototype.draw_FCFF_path = function(parent_element) {
		var fc_inv_y_pos = (this.fixed_capital_inv >= 0 ? this.fixed_capital_inv_pos.top : this.fixed_capital_inv_pos.btm);
		var wc_inv_y_pos = (this.working_capital_inv >= 0 ? this.working_capital_inv_pos.top : this.working_capital_inv_pos.btm);
		var path_ = (
			'M '+this.x_scale(this.EBITDA_pos.left)+' '+this.y_scale(this.EBITDA_pos.top)+
			' L '+this.x_scale(this.fixed_capital_inv_pos.left)+' '+this.y_scale(fc_inv_y_pos)+
			' L '+this.x_scale(this.fixed_capital_inv_pos.rght)+' '+this.y_scale(fc_inv_y_pos)+
			' L '+this.x_scale(this.working_capital_inv_pos.left)+' '+this.y_scale(wc_inv_y_pos)+
			' L '+this.x_scale(this.working_capital_inv_pos.rght)+' '+this.y_scale(wc_inv_y_pos)+
			' L '+this.x_scale(this.interest_tax_shield_pos.left)+' '+this.y_scale(this.interest_tax_shield_pos.top)+
			' L '+this.x_scale(this.interest_tax_shield_pos.rght)+' '+this.y_scale(this.interest_tax_shield_pos.top)+
			' L '+this.x_scale(this.EBITDA_pos.rght)+' '+this.y_scale(this.EBITDA_pos.top)+
			' Z'
		);
		parent_element
			.append('g')
		.classed('grouping', true)
		.attr('id', 'FCFF_path_g')
			.append('svg:path')
		.attr('d', path_)
		.attr('stroke-dasharray', '10,5')
		.classed('FCFF_path', true);
	};
	FCFF_Display.prototype.draw = function() {
		d3.selectAll('.grouping').remove();
		this._rght_offset = 0;
		this._left_offset = 0;
		this.draw_rects();
		this.draw_labels();
		this.draw_FCFF_path(this.svg_group);
	};

	global_ref.FCFF_Display = FCFF_Display;

})(vizfin);
