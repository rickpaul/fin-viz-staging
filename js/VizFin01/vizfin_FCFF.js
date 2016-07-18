'use strict'
var vizfin = vizfin || {};

(function(global_ref){

	var MARGINS = {
		top: 60,
		btm: 40,
		left: 60,
		rght: 300,
	}

	var width = 400;
	var brace_width = 28;
	var brace_space = 5;

	////////////////////////////////////////////////////////////////////////
	// FCFF DISPLAY Definition 
	////////////////////////////////////////////////////////////////////////
	function FCFF_Display(svg_) {
		////////////////////////////////////////////////////////////////////////
		// FCFF DISPLAY Variables 
		////////////////////////////////////////////////////////////////////////
		// Display Variables
		this.svg = svg_;
		this.svg_group = this.svg
			.append('g')
			.attr('transform', 'translate('+MARGINS.left+','+MARGINS.top+')')
			.classed('FCFF_Display', true);
		this.x_scale = d3.scale.linear().domain([0,1]).range([0,1]);
		this.y_scale = d3.scale.linear().domain([0,810]).range([0,800]);

		this._rght_offset = 0;
		this._left_offset = 0;

		// Financial Variables
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
	FCFF_Display.prototype.redefine_x_scale_domain = function() {
		return;
	};
	FCFF_Display.prototype.redefine_y_scale_range = function(height_) {
		this.y_scale.range([0, height_ - MARGINS.top - MARGINS.btm])
	};
	FCFF_Display.prototype.redefine_x_scale_range = function(width_) {
		return;
	};
	FCFF_Display.prototype.redefine_translation = function(width_, height_) {
		return; 
	};
	FCFF_Display.prototype.draw_rects = function() {
		this.draw_rect(this.svg_group, this.revenue_pos, 'revenue');
		this.draw_rect(this.svg_group, this.cost_of_revenue_pos, 'cost_of_revenue', 'Cost of Revenue');
		this.draw_rect(this.svg_group, this.operating_expenses_pos, 'operating_expenses', 'Operating Expenses');
		this.draw_rect(this.svg_group, this.depreciation_amortization_pos, 'depreciation_amortization', 'Depreciation and Amortization');
		this.draw_rect(this.svg_group, this.interest_expense_pos, 'interest_expense', 'Interest Expense');
		this.draw_rect(this.svg_group, this.interest_tax_shield_pos, 'interest_tax_shield', 'Tax Shield');
		this.draw_rect(this.svg_group, this.paid_taxes_pos, 'taxes_paid', 'Taxes Paid');
		this.draw_rect(this.svg_group, this.net_income_pos, 'net_income', 'Net Income');
		this.draw_rect(this.svg_group, this.net_income_pos, 'net_income', 'Net Income');
		this.draw_rect(this.svg_group, this.fixed_capital_inv_pos, 'fc_inv', 'FCInv');
		this.draw_rect(this.svg_group, this.working_capital_inv_pos, 'wc_inv', 'WCInv');
	};
	FCFF_Display.prototype.draw_labels = function() {
		this.draw_external_label(this.svg_group, this.revenue_pos, 'revenue', 'Revenue', true);
		this.draw_external_label(this.svg_group, this.EBIT_pos, 'EBIT', 'EBIT');
		this.draw_external_label(this.svg_group, this.EBITDA_pos, 'EBITDA', 'EBITDA');
	};
	FCFF_Display.prototype.draw_rect = function(parent_element, position_dict, id_prefix, text) {
		var l_ = position_dict.left;
		var t_ = position_dict.top;
		var r_ = position_dict.rght;
		var b_ = position_dict.btm;
		var tor_ = position_dict.text_offset_rght || 0;
		var tod_ = position_dict.text_offset_down || 0;
		var group = parent_element
			.append('g')
				.classed('grouping', true)
				.attr('id', id_prefix+'_g')
				.attr('transform', 'translate('+this.x_scale(l_)+','+this.y_scale(t_)+')');
		group.append('rect')
			.attr('width', this.x_scale(r_ - l_))
			.attr('height', this.y_scale(b_ - t_))
			.attr('x', 0)
			.attr('y', 0)
			.attr('id', id_prefix+'_rect');
		if(text) {
			group.append('text')
				.attr('transform', 'translate('+this.x_scale((r_ - l_)/2+tor_)+','+this.y_scale(7+(b_ - t_)/2+tod_)+')')
				.attr('id', id_prefix+'_text')
				.classed('internal_label', true)
				.text(text);
		}
	};
	FCFF_Display.prototype.draw_external_label = function(parent_element, position_dict, id_prefix, text, left) {
		var l_ = position_dict.left;
		var t_ = position_dict.top;	
		var b_ = position_dict.btm;
		if (left) {
			var o_ = this._left_offset++;
		} else {
			var o_ = this._rght_offset++;
		}
		var group = parent_element
			.append('g')
				.classed('grouping', true)
				.attr('id', id_prefix+'_bracket_g')
				.attr('transform', 'translate('+this.x_scale(l_)+','+this.y_scale(t_)+')');
		this.draw_curly_brace(group, id_prefix, (b_-t_), o_, left);
		this.draw_curly_brace_label(group, id_prefix, (b_-t_), o_, text, left);
	};
	FCFF_Display.prototype.draw_curly_brace = function(parent_element, id_prefix, height, offset, left) {
		if (left) {
			var x_ = -offset*brace_width - brace_space;
			var b_ = parent_element
				.append('path')
					.attr('d', vizfin.get_curly_brace_path(x_, 0, x_, this.y_scale(height), brace_width, .5))
		} else {
			var x_ = this.x_scale(this.rect_width) + offset*brace_width + brace_space;
			var b_ = parent_element
				.append('path')
					.attr('d', vizfin.get_curly_brace_path(x_, this.y_scale(height), x_, 0, brace_width, .5));
		}
		b_
			.classed('curly_brace_path', true)
			.classed('active', true)
			.attr('id', id_prefix+'_bracket_path');
	};
	FCFF_Display.prototype.draw_curly_brace_label = function(parent_element, id_prefix, height, offset, text, left) {
		if (left) {
			var x_ = -(1+offset)*brace_width - brace_space/2 - 7;
			var t_ = parent_element.append('text')
				.attr('transform', 'translate('+x_+','+this.y_scale(height/2)+') rotate(-90)');
		} else {
			var x_ = this.x_scale(this.rect_width) + (1+offset)*brace_width + brace_space/2 + 7;
			var t_ = parent_element.append('text')
				.attr('transform', 'translate('+x_+','+this.y_scale(height/2)+') rotate(90)');
		}
		t_
			.text(text)
			.classed('external_label', true)
			.classed('active', true)
			.attr('id', id_prefix+'_bracket_text');
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
		parent_element.append('path')
			.attr('d', path_)
			.attr('stroke-dasharray', '10,5')
			.classed('FCFF_path', true);
	};
	FCFF_Display.prototype.draw = function() {
		d3.selectAll('rect').remove();
		d3.selectAll('path').remove();
		d3.selectAll('text').remove();
		this._rght_offset = 0;
		this._left_offset = 0;
		this.draw_rects();
		this.draw_labels();
		this.draw_FCFF_path(this.svg_group);
	};

	global_ref.FCFF_Display = FCFF_Display;

})(vizfin);
