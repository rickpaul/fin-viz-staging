'use strict'

var vizfin = vizfin || {};

(function(global_ref) {
	var navbar_height = 60; 
	var min_width = 900;
	var min_height = 500;
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

	global_ref.calibrate_canvas = calibrate_canvas;
	global_ref.get_curly_brace_path = get_curly_brace_path;

})(vizfin);
	