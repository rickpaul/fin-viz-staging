var Simulation_;

console.log('Starting Script');

var SHOP_CLASS = 'shop';
var CITIZEN_CLASS = 'citizen';
var CITIZEN_MAX_SPEED = 2;
var CITIZEN_BIRTH_RATE = 8;
var SHOP_LIFESPAN = 300;
var CITIZEN_LIFESPAN = 300;
var SHOP_INIT_BALANCE = 20;
var DISTANCE_THRESHOLD = 5;

var generation = 0;
var citizen_id = 0;
var shop_id = 0;
var init_gene = null;
var num_citizens = 1;
var num_shops = 20;

var frame_rate = 30;
var navbar_height = 60; 
var button_height = 10; 
var min_width = 900;
var min_height = 500;

// var sim_svg_width;
// var sim_svg_height;
function calibrate_canvases(){
	'use strict'
	// get body and document elements
	var document_ = document.documentElement;
	var body_ = document.getElementsByTagName('body')[0];
	// find appropriate width and height
	var w_ = window.innerWidth || document_.clientWidth || body_.clientWidth;
	var h_ =  window.innerHeight|| document_.clientHeight || body_.clientHeight;
	// adjust svg width and height for minima.
	w_ = Math.max(w_, min_width);
	h_ = Math.max(h_, min_height);
	var o_ = (navbar_height || 0) + (button_height || 0);
	h_ -= o_;
	// set svg width and height
	sim_p_factor = Math.min(w_/sim_p_width, h_/sim_p_height);
	Simulation_.sim_svg.attr('width', w_).attr('height', h_/2);
	sd_p_factor = Math.min(w_/sd_p_width/3, h_/sd_p_height/2);
	Simulation_.sd_svg.attr('width', w_/3).attr('height', h_/2);
	Simulation_.sd_chart.redefine_scales();
	Simulation_.display();
};
// create canvas calibration functions and variables
var sim_p_width = 100;
var sim_p_height = 50;
var sim_p_factor = null;
function sim_w2p(w){return w/sim_p_factor;}
function sim_p2w(p){return p*sim_p_factor;}
var sd_p_width = 100; // Deprecated ?
var sd_p_height = 100; // Deprecated ?
var sd_p_factor = null; // Deprecated ?
function sd_w2p(w){return w/sd_p_factor;} // Deprecated ?
function sd_p2w(p){return p*sd_p_factor;} // Deprecated ?
