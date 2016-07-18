'use strict'
var vizfin = vizfin || {};

(function(global_ref){

	function isArray_(object_) {
		return Object.prototype.toString.call( object_ ) === '[object Array]';
	}
	function isString_(object_) {
		return  typeof(object_) === 'string';
	}

	var text_size = 12 + 2; // Must Match HTML! (plus 2 for spacing)

	//////////////////////////////////////////////////////////////////////////
	// vizfin_Base Constructor
	//////////////////////////////////////////////////////////////////////////
	var vizfin_Base = function(svg_) {
		// Display Variables
		this.svg = svg_;
		this.svg_group = this.svg.append('g');
		this.x_scale = d3.scale.linear().domain([0,1]).range([0,1]);
		this.y_scale = d3.scale.linear().domain([0,1]).range([0,1]);

		this._rght_offset = 0;
		this._left_offset = 0;
	};
	//////////////////////////////////////////////////////////////////////////
	// vizfin_Base Prototype Functions
	//////////////////////////////////////////////////////////////////////////
	vizfin_Base.prototype.redefine_y_scale_domain = function() {
		return;
	};
	vizfin_Base.prototype.redefine_x_scale_domain = function() {
		return;
	};
	vizfin_Base.prototype.redefine_y_scale_range = function(height_) {
		return;
	};
	vizfin_Base.prototype.redefine_x_scale_range = function(width_) {
		return;
	};
	vizfin_Base.prototype.redefine_translation = function(width_, height_) {
		return; 
	};

	vizfin_Base.prototype.clear = function() {
		d3.selectAll('.grouping').remove();
	};

	vizfin_Base.prototype.draw_rect = function(parent_element, id_prefix, position, text) {
		var l_ = position.left;
		var t_ = position.top;
		var r_ = position.rght;
		var b_ = position.btm;
		position.y_ = (b_+t_)/2;
		position.x_ = (r_+l_)/2;
		position.h_ = (b_-t_);
		position.w_ = (r_-l_);
		this.draw_rect_center(parent_element, id_prefix, position, text);
	};

	vizfin_Base.prototype.draw_rect_center = function(parent_element, id_prefix, position, text) {
		var c_x = position.x_;
		var c_y = position.y_;
		var w_ = position.w_;
		var h_ = position.h_;
		var tor_ = position.text_offset_rght || 0;
		var tod_ = position.text_offset_down || 0;
		var group = parent_element
			.append('g')
				.classed('grouping', true)
				.attr('id', id_prefix+'_g')
				.attr('transform', 'translate('+this.x_scale(c_x-w_/2)+','+this.y_scale(c_y-h_/2)+')');
		group
			.append('svg:rect')
				.attr('width', this.x_scale(w_))
				.attr('height', this.y_scale(h_))
				.attr('x', 0)
				.attr('y', 0)
				.attr('id', id_prefix+'_rect');
		if ( text ) {
			if ( isString_(text) ) {
				var p_ = {
					x_: this.x_scale((w_)/2) + tor_,
					y_: this.y_scale((h_)/2) + tod_ + (text_size/2),
				}
				this.draw_text(group, id_prefix, '', 'internal_label', p_, text)
			} else if ( isArray_(text) ) {
				var o_ = -1 * (text.length - 1) * text_size / 2;
				var p_ = {
					x_: this.x_scale((w_)/2) + tor_,
					y_: this.y_scale((h_)/2) + tod_ - (text_size/2) - o_,
				}
				for (var i = 0; i <= text.length; i++) {
					this.draw_text(group, id_prefix, i, 'internal_label', p_, text[i])
					p_.y_ += text_size;
				};
			} else {
				console.log('Failed to understand text for ' + id_prefix + 'rect.');
			}
		}
	};

	vizfin_Base.prototype.draw_text = function(parent_element, id_prefix, id_suffix, class_name, position, text) {
		var x_ = position.x_; // This should be already scaled
		var y_ = position.y_; // This should be already scaled
		var r_ = position.r_ || 0;
		parent_element
			.append('svg:text')
				.attr('transform', 'translate('+x_+','+y_+') ' + (r_ ? 'rotate('+r_+')' : ''))
				.attr('id', id_prefix+'_text' + (id_suffix ? '_'+id_suffix : ''))
				.classed(class_name, true)
				.text(text);
	};



	global_ref.vizfin_Base = vizfin_Base;

})(vizfin);
