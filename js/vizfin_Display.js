'use strict'

var vizfin = vizfin || {};

(function(global_ref) {
	var navbar_height = 60; 

	var min_width = 900;
	var min_height = 500;

	var generate_path = function(path_array, x_scale, y_scale) {
		return 'M '.concat(
			path_array.map(function(point){
				return [x_scale(point[0]),' ',y_scale(point[1])].join('')
			}).join(' L ')
		).concat(' Z');
	}

	// Taken from http://bl.ocks.org/alexhornbake/6005176
	//returns path string d for <path d="This string">
	//a curly brace between x1,y1 and x2,y2, w pixels wide 
	//and q factor, .5 is normal, higher q = more expressive bracket 
	var get_curly_brace_path = function(x1,y1,x2,y2,w,q) {
		//Calculate unit vector
		var dx = x1-x2;
		var dy = y1-y2;
		var len = Math.sqrt(dx*dx + dy*dy);
		dx = dx / len;
		dy = dy / len;

		//Calculate Control Points of path,
		var qx1 = x1 + q*w*dy;
		var qy1 = y1 - q*w*dx;
		var qx2 = (x1 - .25*len*dx) + (1-q)*w*dy;
		var qy2 = (y1 - .25*len*dy) - (1-q)*w*dx;
		var tx1 = (x1 -  .5*len*dx) + w*dy;
		var ty1 = (y1 -  .5*len*dy) - w*dx;
		var qx3 = x2 + q*w*dy;
		var qy3 = y2 - q*w*dx;
		var qx4 = (x1 - .75*len*dx) + (1-q)*w*dy;
		var qy4 = (y1 - .75*len*dy) - (1-q)*w*dx;

		return ( "M " +  x1 + " " +  y1 +
						" Q " + qx1 + " " + qy1 + " " + qx2 + " " + qy2 + 
						" T " + tx1 + " " + ty1 +
						" M " +  x2 + " " +  y2 +
						" Q " + qx3 + " " + qy3 + " " + qx4 + " " + qy4 + 
						" T " + tx1 + " " + ty1 );
	};
	var CanvasHolder = function(svg_){
		this.canvas_id = 1;
		this.displays = {};

		this.fixed_width = null;
		this.fixed_height = null;

		this.w_ = min_width;
		this.h_ = min_height;	

		if (svg_ === undefined) { 
			this.svg = d3.select('#viz_holder')
				.append('svg')
					.attr('width', this.w_)
					.attr('height', this._h)
					.classed('background', true)
					.classed('margin-top', true);
			this._calibrate_svg();
		} else {
			this.svg = svg_;
		}

		Object.defineProperty(this, 'fixed_width', {
			set: function(value){ this.fixed_width = value; },
		});
		Object.defineProperty(this, 'fixed_height', {
			set: function(value){ this.fixed_height = value; },
		});
	}
	CanvasHolder.prototype.register_element = function(display_object, display_w, display_h, display_x, display_y, name_) {
		var name_ = name_ || this.canvas_id++;
		this.displays[name_] = {
			object_: display_object,
			width_: display_w || 1,
			height_: display_h || 1,
			x_loc: display_x || 0,
			y_loc: display_y || 0,
		};
	};
	CanvasHolder.prototype._calibrate_svg = function() {
		// Adjust Overall SVG Width and Height
		var document_ = document.documentElement;
		var body_ = document.getElementById('viz_holder');
		var w_, h_;
		if ( this.fixed_width ) {
			w_ = this.w_;
		} else {
			w_ = window.innerWidth || document_.clientWidth || body_.clientWidth;
			w_ = Math.max(w_, min_width);
		}
		if ( this.fixed_height ) {
			h_ = this.h_;
		} else {
			h_ =  window.innerHeight|| document_.clientHeight || body_.clientHeight;
			h_ = Math.max(h_, min_height);
			// Adjust Height so no scrolling happens
			var o_ = navbar_height || 0;
			h_ -= o_;
		}
		this.w_ = w_;
		this.h_ = h_;

		this.svg.attr('width', w_).attr('height', h_);
	};
	CanvasHolder.prototype._calibrate_subcanvases = function() {
		var d_o, d_, d_w, d_h;
		var this_ = this;
		Object.keys(this.displays).forEach(function(d){
			d_o = this_.displays[d];
			d_ = d_o.object_;
			d_w = d_o.width_ * this_.w_;
			d_h = d_o.height_ * this_.h_;
			// Move elements
			d_.redefine_location(this_.w_ * d_o.x_loc, this_.h_ * d_o.y_loc);
			// Rescale elements
			d_.redefine_y_scale_domain();
			d_.redefine_y_scale_range(d_h);
			d_.redefine_x_scale_domain();
			d_.redefine_x_scale_range(d_w);
			d_.redefine_translation(d_w, d_h);
			d_.draw();
		});
	};
	CanvasHolder.prototype.calibrate_canvases = function() {
		this._calibrate_svg();
		this._calibrate_subcanvases();
	};

	/*
	TODO:
		Deprecate this and move to the CanvasHolder Object 
	*/
	var calibrate_canvas = function(display_) {
		// get body and document elements
		var document_ = document.documentElement;
		// var body_ = document.getElementsByTagName('body')[0];
		var body_ = document.getElementById('viz_holder');
		// find appropriate width and height
		var w_ = window.innerWidth || document_.clientWidth || body_.clientWidth;
		var h_ =  window.innerHeight|| document_.clientHeight || body_.clientHeight;
		w_ = Math.max(w_, min_width);
		h_ = Math.max(h_, min_height);
		var o_ = navbar_height || 0;
		h_ -= o_;
		// Resize SVG
		display_.svg.attr('width', w_).attr('height', h_);
		// Rescale elements
		display_.redefine_y_scale_domain();
		display_.redefine_y_scale_range(h_);
		display_.redefine_x_scale_domain();
		display_.redefine_x_scale_range(w_);
		display_.redefine_translation(w_, h_);
		// Redraw
		display_.draw();	
	};

	global_ref.CanvasHolder = CanvasHolder;
	global_ref.calibrate_canvas = calibrate_canvas;
	global_ref.get_curly_brace_path = get_curly_brace_path;
	global_ref.generate_path = generate_path;

})(vizfin);
	