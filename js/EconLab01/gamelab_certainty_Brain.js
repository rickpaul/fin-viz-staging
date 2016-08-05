/*
	I am hoping to create a brain that prefers certainty.
*/
'use strict'
var gamelab = gamelab || {};

(function(global_ref){
	var Certainty_Brain = function() {
		/*
		Inputs: 
			input_active // In Allais case, only 3 states are possible (low, med, high)
			raw_probability
			log(probability)
			relative_wealth
			relative_gain
			log(relative_wealth)
			log(relative_gain)

		*/
		this.num_layer_1 = 30;
		this.num_layer_2 = 10;
		this.num_output = 2;

		this.num_raw_input = 7;
		
		this.num_output = 2;
		this.feedback = 0;
		this.feedback_amplifier = .9;
		this.num_recurrent_input = 0;

		this.num_input = this.num_recurrent_input*this.feedback + this.num_raw_input; // input is recurrent and raw

		this.inputState = convnetjs.zeros(this.num_input);
		this.convInputState = new convnetjs.Vol(1, 1, this.num_input); // A cube representation of this.inputState... compatible with convnetjs lib input.
		this.outputState = convnetjs.zeros(this.num_output);

		// Layer Definition
		this.layer_defs = [];
		this.layer_defs.push({
			type: 'input',
			out_sx: 1,
			out_sy: 1,
			out_depth: this.num_input
		});

		// Layer Definition / Hidden Layer 1
		this.layer_defs.push({
			type: 'fc',
			num_neurons: this.num_layer_1,
			activation: 'tanh'
		});

		// Layer Definition / Hidden Layer 2
		this.layer_defs.push({
			type: 'fc',
			num_neurons: this.num_layer_12
			activation: 'tanh'
		});
		// Layer Definition / Output
		this.layer_defs.push({
			type: 'regression',
			// type: 'regression',
			num_neurons: this.num_output,
		});

		this.net = new convnetjs.Net();
		this.net.makeLayers(this.layer_defs);
		convnetjs.randomizeNetwork(this.net, 1.0);
	};

	

	global_ref.Certainty_Brain = Certainty_Brain;
}(gamelab)