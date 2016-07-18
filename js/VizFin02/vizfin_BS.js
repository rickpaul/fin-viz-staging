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
	var BS_Display = function(svg_) {
		////////////////////////////////////////////////////////////////////////
		// FCFF DISPLAY Variables 
		////////////////////////////////////////////////////////////////////////
		// Display Variables
		this.svg = svg_;
		this.svg_group = this.svg
			.append('g')
			.attr('transform', 'translate('+MARGINS.left+','+MARGINS.top+')')
			.classed('BS_Display', true);
		this.x_scale = d3.scale.linear().domain([0,1]).range([0,1]);
		this.y_scale = d3.scale.linear().domain([0,1]).range([0,1]);

		this._rght_offset = 0;
		this._left_offset = 0;

		// Financial Variables
		// Financial Variables / Assets
		// Financial Variables / Assets / Current Assets
		this._cash_and_cash_equivalents = 400;
		this._accounts_receivable = 100;
		this._inventory = 200;
		this._short_term_investments = 300;
		this._other_current_assets = 0;
		// Financial Variables / Assets / Non-Current Assets
		this._goodwill = 300;
		this._property_plant_equipment = 300;
		this._intangible_assets = 300;
		this._long_term_investments = 100;
		this._miscellaneous_assets = 0;
		this._deferred_long_term_asset_charges = 0;
		// Financial Variables / Assets / Non-Current Assets / Contra Accounts
		this._accumulated_depreciation = -300;
		// Financial Variables / Liabilities
		// Financial Variables / Liabilities / Current Liabilities
		this._accounts_payable = 300;
		this._short_term_debt = 300;
		this._current_long_term_debt = 0;
		this._other_current_liabilities = 0;
		// Financial Variables / Liabilities / Non-Current Liabilities
		this._long_term_debt = 0;
		this._other_liabilities = 0;
		this._negative_goodwill = 0;
		this._minority_interest = 0;
		this._deferred_long_term_liability_charges = 0;
		
		////////////////////////////////////////////////////////////////////////
		// FCFF DISPLAY Property Definitions | Private Variables Access
		////////////////////////////////////////////////////////////////////////
		// Assets / Current Assets
		Object.defineProperty(this, 'cash_and_cash_equivalents', {
			get: function() { return this._cash_and_cash_equivalents; },
			set: function(value_) { this._cash_and_cash_equivalents = value_; },
		});
		Object.defineProperty(this, 'accounts_receivable', {
			get: function() { return this._accounts_receivable; },
			set: function(value_) { this._accounts_receivable = value_; },
		});
		Object.defineProperty(this, 'inventory', {
			get: function() { return this._inventory; },
			set: function(value_) { this._inventory = value_; },
		});
		Object.defineProperty(this, 'other_current_assets', {
			get: function() { return this._other_current_assets; },
			set: function(value_) { this._other_current_assets = value_; },
		});
		Object.defineProperty(this, 'short_term_investments', {
			get: function() { return this._short_term_investments; },
			set: function(value_) { this._short_term_investments = value_; },
		});
		// ! Treat marketable securities as synonym for STI's !
		Object.defineProperty(this, 'marketable_securities', { 
			get: function() { return this._short_term_investments; },
			set: function(value_) { this._short_term_investments = value_; },
		});
		// Assets / Non-Current Assets
		Object.defineProperty(this, 'long_term_investments', {
			get: function() { return this._long_term_investments; },
			set: function(value_) { this._long_term_investments = value_; },
		});
		Object.defineProperty(this, 'property_plant_equipment', {
			get: function() { return this._property_plant_equipment; },
			set: function(value_) { this._property_plant_equipment = value_; },
		});
		Object.defineProperty(this, 'goodwill', {
			get: function() { return this._goodwill; },
			set: function(value_) { this._goodwill = value_; },
		});
		Object.defineProperty(this, 'accumulated_depreciation', {
			get: function() { return this._accumulated_depreciation; },
			set: function(value_) { this._accumulated_depreciation = value_; },
		});
		// ! Treat amortization as synonym for depreciation !
		Object.defineProperty(this, 'accumulated_amortization', { 
			get: function() { return this._accumulated_depreciation; },
			set: function(value_) { this._accumulated_depreciation = value_; },
		});
		Object.defineProperty(this, 'intangible_assets', {
			get: function() { return this._intangible_assets; },
			set: function(value_) { this._intangible_assets = value_; },
		});
		Object.defineProperty(this, 'miscellaneous_assets', {
			get: function() { return this._miscellaneous_assets; },
			set: function(value_) { this._miscellaneous_assets = value_; },
		});
		// What is this?
		Object.defineProperty(this, 'deferred_long_term_asset_charges', {
			get: function() { return this._deferred_long_term_asset_charges; },
			set: function(value_) { this._deferred_long_term_asset_charges = value_; },
		});
		// Liabilities / Current Liabilities
		Object.defineProperty(this, 'accounts_payable', {
			get: function() { return this._accounts_payable; },
			set: function(value_) { this._accounts_payable = value_; },
		});
		Object.defineProperty(this, 'short_term_debt', {
			get: function() { return this._short_term_debt; },
			set: function(value_) { this._short_term_debt = value_; },
		});
		Object.defineProperty(this, 'current_long_term_debt', {
			get: function() { return this._current_long_term_debt; },
			set: function(value_) { this._current_long_term_debt = value_; },
		});
		Object.defineProperty(this, 'other_current_liabilities', {
			get: function() { return this._other_current_liabilities; },
			set: function(value_) { this._other_current_liabilities = value_; },
		});
		// Liabilities / Non-Current Liabilities
		Object.defineProperty(this, 'long_term_debt', {
			get: function() { return this._long_term_debt; },
			set: function(value_) { this._long_term_debt = value_; },
		});
		Object.defineProperty(this, 'other_liabilities', {
			get: function() { return this._other_liabilities; },
			set: function(value_) { this._other_liabilities = value_; },
		});
		Object.defineProperty(this, 'minority_interest', {
			get: function() { return this._minority_interest; },
			set: function(value_) { this._minority_interest = value_; },
		});
		Object.defineProperty(this, 'negative_goodwill', {
			get: function() { return this._negative_goodwill; },
			set: function(value_) { this._negative_goodwill = value_; },
		});
		// What is this?
		Object.defineProperty(this, 'deferred_long_term_liability_charges', {
			get: function() { return this._deferred_long_term_liability_charges; },
			set: function(value_) { this._deferred_long_term_liability_charges = value_; },
		});
		// Equity
		Object.defineProperty(this, 'redeemable_preferred_stock', {
			get: function() { return this._redeemable_preferred_stock; },
			set: function(value_) { this._redeemable_preferred_stock = value_; },
		});
		Object.defineProperty(this, 'preferred_stock_par', {
			get: function() { return this._preferred_stock_par; },
			set: function(value_) { this._preferred_stock_par = value_; },
		});
		Object.defineProperty(this, 'common_stock_par', {
			get: function() { return this._common_stock_par; },
			set: function(value_) { this._common_stock_par = value_; },
		});
		Object.defineProperty(this, 'retained_earnings', {
			get: function() { return this._retained_earnings; },
			set: function(value_) { this._retained_earnings = value_; },
		});
		Object.defineProperty(this, 'treasury_stock', {
			get: function() { return this._treasury_stock; },
			set: function(value_) { this._treasury_stock = value_; },
		});
		Object.defineProperty(this, 'additional_paid_in_capital', {
			get: function() { return this._additional_paid_in_capital; },
			set: function(value_) { this._additional_paid_in_capital = value_; },
		});
		Object.defineProperty(this, 'capital_surplus', { // ! This is a synonym for APIC !
			get: function() { return this._additional_paid_in_capital; },
			set: function(value_) { this._additional_paid_in_capital = value_; },
		});
		Object.defineProperty(this, 'other_equity', {
			get: function() { return this._other_equity; },
			set: function(value_) { this._other_equity = value_; },
		});
		// What is this?
		Object.defineProperty(this, 'miscellaneous_stocks_options_warrants', {
			get: function() { return this._miscellaneous_stocks_options_warrants; },
			set: function(value_) { this._miscellaneous_stocks_options_warrants = value_; },
		});
		////////////////////////////////////////////////////////////////////////
		// FCFF DISPLAY Property Definitions | Calculated Financial Values
		////////////////////////////////////////////////////////////////////////
		Object.defineProperty(this, 'current_assets', {
			get: function() { 
				return (
					this.cash_and_cash_equivalents +
					this.accounts_receivable +
					this.inventory +
					this.short_term_investments +
					this.other_current_assets); 
			},
		});
		Object.defineProperty(this, 'total_assets', {
			get: function() { 
				return (
					this.current_assets +
					this.long_term_investments +
					this.property_plant_equipment +
					this.goodwill +
					this.intangible_assets +
					this.accumulated_depreciation +
					this.miscellaneous_assets +
					this.deferred_long_term_asset_charges); 
			},
		});
		Object.defineProperty(this, 'current_liabilities', {
			get: function() { 
				return (
					this.accounts_payable +
					this.short_term_debt +
					this.current_long_term_debt + 
					this.other_current_liabilities); 
			},
		});
		Object.defineProperty(this, 'total_liabilities', {
			get: function() { 
				return (
					this.current_liabilities +
					this.long_term_debt +
					this.other_liabilities +
					this.minority_interest +
					this.negative_goodwill +
					this.deferred_long_term_liability_charges); 
			},
		});
		Object.defineProperty(this, 'book_value', {
			get: function() { 
				return (
					this.total_assets -
					this.total_liabilities - 
					this.goodwill - 
					this.intangible_assets - 
					this.common_stock_par); 
			},
		});
		////////////////////////////////////////////////////////////////////////
		// FCFF DISPLAY Property Definitions | Display Values
		////////////////////////////////////////////////////////////////////////

		Object.defineProperty(this, 'total_assets_pos', {
			get: function() { 
				return {
					top: 0,
					btm: this.total_assets,
					left: 0,
					rght: this.rect_width/2
				};
			},
		});
		Object.defineProperty(this, 'total_liabilities_pos', {
			get: function() { 
				return {
					top: 0,
					btm: this.total_liabilities,
					left: this.rect_width/2,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'total_equities_pos', {
			get: function() { 
				return {
					top: this.total_liabilities,
					btm: this.total_assets, // Cheating a bit to use accounting A=L+E
					left: this.rect_width/2,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'cash_pos', {
			get: function() { 
				return {
					top: 0,
					btm: this.cash_and_cash_equivalents,
					left: 0,
					rght: this.rect_width/2
				};
			},
		});
		// Inefficient? You betcha.
		Object.defineProperty(this, 'short_term_investments_pos', {
			get: function() { 
				return {
					top: this.cash_pos.btm,
					btm: this.cash_pos.btm+this.short_term_investments,
					left: 0,
					rght: this.rect_width/2
				};
			},
		});
		Object.defineProperty(this, 'accts_receivable_pos', {
			get: function() { 
				return {
					top: this.short_term_investments_pos.btm,
					btm: this.short_term_investments_pos.btm+this.accounts_receivable,
					left: 0,
					rght: this.rect_width/2
				};
			},
		});
		Object.defineProperty(this, 'inventory_pos', {
			get: function() { 
				return {
					top: this.accts_receivable_pos.btm,
					btm: this.accts_receivable_pos.btm+this.inventory,
					left: 0,
					rght: this.rect_width/2
				};
			},
		});
		Object.defineProperty(this, 'other_current_assets_pos', {
			get: function() { 
				return {
					top: this.inventory_pos.btm,
					btm: this.inventory_pos.btm+this.other_current_assets,
					left: 0,
					rght: this.rect_width/2
				};
			},
		});
		Object.defineProperty(this, 'long_term_investments_pos', {
			get: function() { 
				return {
					top: this.other_current_assets_pos.btm,
					btm: this.other_current_assets_pos.btm+this.long_term_investments,
					left: 0,
					rght: this.rect_width/2
				};
			},
		});
		Object.defineProperty(this, 'property_plant_equipment_pos', {
			get: function() { 
				return {
					top: this.long_term_investments_pos.btm,
					btm: this.long_term_investments_pos.btm+this.property_plant_equipment,
					left: 0,
					rght: this.rect_width/2
				};
			},
		});
		Object.defineProperty(this, 'goodwill_pos', {
			get: function() { 
				return {
					top: this.property_plant_equipment_pos.btm,
					btm: this.property_plant_equipment_pos.btm+this.goodwill,
					left: 0,
					rght: this.rect_width/2
				};
			},
		}); 
		Object.defineProperty(this, 'accumulated_depreciation_pos', {
			get: function() { 
				return {
					top: this.goodwill_pos.btm,
					btm: this.goodwill_pos.btm+this.accumulated_depreciation,
					left: 0,
					rght: this.rect_width/2
				};
			},
		});
		Object.defineProperty(this, 'intangible_assets_pos', {
			get: function() { 
				return {
					top: this.accumulated_depreciation_pos.btm,
					btm: this.accumulated_depreciation_pos.btm+this.intangible_assets,
					left: 0,
					rght: this.rect_width/2
				};
			},
		});
		Object.defineProperty(this, 'miscellaneous_assets_pos', {
			get: function() { 
				return {
					top: this.intangible_assets_pos.btm,
					btm: this.intangible_assets_pos.btm+this.miscellaneous_assets,
					left: 0,
					rght: this.rect_width/2
				};
			},
		});
		Object.defineProperty(this, 'deferred_long_term_asset_charges_pos', {
			get: function() { 
				return {
					top: this.miscellaneous_assets_pos.btm,
					btm: this.miscellaneous_assets_pos.btm+this.deferred_long_term_asset_charges,
					left: 0,
					rght: this.rect_width/2
				};
			},
		});

		Object.defineProperty(this, 'accounts_payable_pos', {
			get: function() { 
				return {
					top: 0,
					btm: this.accounts_payable,
					left: this.rect_width/2,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'short_term_debt_pos', {
			get: function() { 
				return {
					top: this.accounts_payable_pos.btm,
					btm: this.accounts_payable_pos.btm+this.short_term_debt,
					left: this.rect_width/2,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'current_long_term_debt_pos', {
			get: function() { 
				return {
					top: this.short_term_debt_pos.btm,
					btm: this.short_term_debt_pos.btm+this.current_long_term_debt,
					left: this.rect_width/2,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'other_current_liabilities_pos', {
			get: function() { 
				return {
					top: this.current_long_term_debt_pos.btm,
					btm: this.current_long_term_debt_pos.btm+this.other_current_liabilities,
					left: this.rect_width/2,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'long_term_debt_pos', {
			get: function() { 
				return {
					top: this.other_current_liabilities_pos.btm,
					btm: this.other_current_liabilities_pos.btm+this.long_term_debt,
					left: this.rect_width/2,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'other_liabilities_pos', {
			get: function() { 
				return {
					top: this.long_term_debt_pos.btm,
					btm: this.long_term_debt_pos.btm+this.other_liabilities,
					left: this.rect_width/2,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'minority_interest_pos', {
			get: function() { 
				return {
					top: this.other_liabilities_pos.btm,
					btm: this.other_liabilities_pos.btm+this.minority_interest,
					left: this.rect_width/2,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'other_current_liabilities_pos', {
			get: function() { 
				return {
					top: this.other_current_liabilities_pos.btm,
					btm: this.other_current_liabilities_pos.btm+this.other_current_liabilities,
					left: this.rect_width/2,
					rght: this.rect_width
				};
			},
		});
		Object.defineProperty(this, 'other_current_liabilities_pos', {
			get: function() { 
				return {
					top: this.other_current_liabilities_pos.btm,
					btm: this.other_current_liabilities_pos.btm+this.other_current_liabilities,
					left: this.rect_width/2,
					rght: this.rect_width
				};
			},
		});
		// Object.defineProperty(this, 'other_current_assets_pos', {
		// 	get: function() { 
		// 		return {
		// 			top: this.inventory_pos.btm,
		// 			btm: this.inventory_pos.btm+this.other_current_assets,
		// 			left: 0,
		// 			rght: this.rect_width/2
		// 		};
		// 	},
		// });
		Object.defineProperty(this, 'rect_width', {
			get: function() { return width; },
		});

	};

	////////////////////////////////////////////////////////////////////////
	// FCFF DISPLAY Prototype Functions 
	////////////////////////////////////////////////////////////////////////
	BS_Display.prototype.redefine_y_scale_domain = function() {
		this.y_scale.domain([0, this.total_assets]);
	};
	BS_Display.prototype.redefine_x_scale_domain = function() {
		return;
	};
	BS_Display.prototype.redefine_y_scale_range = function(height_) {
		this.y_scale.range([0, height_ - MARGINS.top - MARGINS.btm])
	};
	BS_Display.prototype.redefine_x_scale_range = function(width_) {
		return;
	};
	BS_Display.prototype.redefine_translation = function(width_, height_) {
		return; 
	};
	BS_Display.prototype.draw_rects = function() {
		// Draw Backgrounds
		this.draw_rect(this.svg_group, this.total_assets_pos, 'total_assets');
		this.draw_rect(this.svg_group, this.total_liabilities_pos, 'total_liabilities');
		this.draw_rect(this.svg_group, this.total_equities_pos, 'total_equities');
		// Draw Assets
		if(this.cash_and_cash_equivalents > 0) { 
			this.draw_rect(this.svg_group, this.cash_pos, 'cash', 'Cash + Equivalents'); 
		}
		if(this.short_term_investments > 0) { 
			this.draw_rect(this.svg_group, this.short_term_investments_pos, 'short_term_investments', 'Short Term Investments');
		}
		if(this.accounts_receivable > 0) { 
			this.draw_rect(this.svg_group, this.accts_receivable_pos, 'accts_receivable', 'Accounts Rec.');
		}
		if(this.inventory > 0) { 
			this.draw_rect(this.svg_group, this.inventory_pos, 'inventory', 'Inventory');
		}
		if(this.other_current_assets > 0) { 
			this.draw_rect(this.svg_group, this.other_current_assets_pos, 'other_current_assets', 'Other Current Assets');
		}
		if(this.long_term_investments > 0) { 
			this.draw_rect(this.svg_group, this.long_term_investments_pos, 'long_term_investments', 'Long Term Investments');
		}
		if(this.property_plant_equipment > 0) { 
			this.draw_rect(this.svg_group, this.property_plant_equipment_pos, 'property_plant_equipment', 'PP&E');
		}
		if(this.goodwill > 0) { 
			this.draw_rect(this.svg_group, this.goodwill_pos, 'goodwill', 'Goodwill');
		}
		if(this.intangible_assets < 0) { 
			this.draw_rect(this.svg_group, this.intangible_assets_pos, 'intangible_assets', 'Intangible Assets');
		}
		if(this.miscellaneous_assets < 0) { 
			this.draw_rect(this.svg_group, this.miscellaneous_assets_pos, 'miscellaneous_assets', 'Misc. Assets');
		}
		if(this.deferred_long_term_liability_charges < 0) { 
			this.draw_rect(this.svg_group, this.deferred_long_term_liability_charges_pos, 'deferred_long_term_liability_charges', 'Deferred Liability Charges');
		}
	};
	BS_Display.prototype.draw_labels = function() {
		this.draw_external_label(this.svg_group, this.total_assets_pos, 'total_assets', 'Assets', true);
		this.draw_external_label(this.svg_group, this.total_liabilities_pos, 'liabilities', 'Liabilities', false);
		this.draw_external_label(this.svg_group, this.total_equities_pos, 'equity', 'Equity', false, true);
	};
	BS_Display.prototype.draw_rect = function(parent_element, position_dict, id_prefix, text) {
		var l_ = position_dict.left;
		var t_ = position_dict.top;
		var r_ = position_dict.rght;
		var b_ = position_dict.btm;
		var tor_ = position_dict.text_offset_rght || 0;
		var tod_ = position_dict.text_offset_down || 0;
		var group = parent_element.append('g')
			.attr('id', id_prefix+'_g')
			.attr('transform', 'translate('+this.x_scale(l_)+','+this.y_scale(t_)+')')
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
			group.append('title').text(text);
		}
	};
	BS_Display.prototype.draw_external_label = function(parent_element, position_dict, id_prefix, text, left, decrement_increment) {
		var l_ = position_dict.left;
		var t_ = position_dict.top;	
		var b_ = position_dict.btm;
		if (left) {
			if (decrement_increment) {
				this._left_offset--;
			}
			var o_ = this._left_offset++;
		} else {
			if (decrement_increment) {
				this._rght_offset--;
			}
			var o_ = this._rght_offset++;
		}
		var group = parent_element.append('g')
			.attr('id', id_prefix+'_bracket_g')
			.attr('transform', 'translate(0,'+this.y_scale(t_)+')');
		this.draw_curly_brace(group, id_prefix, (b_-t_), o_, left);
		this.draw_curly_brace_label(group, id_prefix, (b_-t_), o_, text, left);
	};
	BS_Display.prototype.draw_curly_brace = function(parent_element, id_prefix, height, offset, left) {
		if (left) {
			var x_ = -offset*brace_width - brace_space;
			var b_ = parent_element.append('svg:path')
				.attr('d', vizfin.get_curly_brace_path(x_, 0, x_, this.y_scale(height), brace_width, .5))
		} else {
			var x_ = this.x_scale(this.rect_width) + offset*brace_width + brace_space;
			var b_ = parent_element.append('svg:path')
				.attr('d', vizfin.get_curly_brace_path(x_, this.y_scale(height), x_, 0, brace_width, .5));
		}
		b_
			.classed('curly_brace_path', true)
			.classed('active', true)
			.attr('id', id_prefix+'_bracket_path');
	};
	BS_Display.prototype.draw_curly_brace_label = function(parent_element, id_prefix, height, offset, text, left) {
		if (left) {
			var x_ = -(1+offset)*brace_width - brace_space/2 - 7;
			var t_ = parent_element.append('svg:text')
				.attr('transform', 'translate('+x_+','+this.y_scale(height/2)+') rotate(-90)');
		} else {
			var x_ = this.x_scale(this.rect_width) + (1+offset)*brace_width + brace_space/2 + 7;
			var t_ = parent_element.append('svg:text')
				.attr('transform', 'translate('+x_+','+this.y_scale(height/2)+') rotate(90)');
		}
		t_
			.text(text)
			.classed('external_label', true)
			.classed('active', true)
			.attr('id', id_prefix+'_bracket_text');
	};
	// BS_Display.prototype.draw_FCFF_path = function(parent_element) {
	// 	var fc_inv_y_pos = (this.fixed_capital_inv >= 0 ? this.fixed_capital_inv_pos.top : this.fixed_capital_inv_pos.btm);
	// 	var wc_inv_y_pos = (this.working_capital_inv >= 0 ? this.working_capital_inv_pos.top : this.working_capital_inv_pos.btm);
	// 	var path_ = (
	// 		'M '+this.x_scale(this.EBITDA_pos.left)+' '+this.y_scale(this.EBITDA_pos.top)+
	// 		' L '+this.x_scale(this.fixed_capital_inv_pos.left)+' '+this.y_scale(fc_inv_y_pos)+
	// 		' L '+this.x_scale(this.fixed_capital_inv_pos.rght)+' '+this.y_scale(fc_inv_y_pos)+
	// 		' L '+this.x_scale(this.working_capital_inv_pos.left)+' '+this.y_scale(wc_inv_y_pos)+
	// 		' L '+this.x_scale(this.working_capital_inv_pos.rght)+' '+this.y_scale(wc_inv_y_pos)+
	// 		' L '+this.x_scale(this.interest_tax_shield_pos.left)+' '+this.y_scale(this.interest_tax_shield_pos.top)+
	// 		' L '+this.x_scale(this.interest_tax_shield_pos.rght)+' '+this.y_scale(this.interest_tax_shield_pos.top)+
	// 		' L '+this.x_scale(this.EBITDA_pos.rght)+' '+this.y_scale(this.EBITDA_pos.top)+
	// 		' Z'
	// 	);
	// 	parent_element.append('path')
	// 		.attr('d', path_)
	// 		.attr('stroke-dasharray', '10,5')
	// 		.classed('highlight_path', true);
	// };
	BS_Display.prototype.draw = function() {
		d3.selectAll('rect').remove();
		d3.selectAll('path').remove();
		d3.selectAll('text').remove();
		this._rght_offset = 0;
		this._left_offset = 0;
		this.draw_rects();
		this.draw_labels();
		// this.draw_FCFF_path(this.svg_group);
	};

	global_ref.BS_Display = BS_Display;

})(vizfin);
