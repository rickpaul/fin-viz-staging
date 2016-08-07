
	// var Citizen_Buy_Brain = function() {
	// 	'use strict'
	// 	this.num_raw_input = 5; // Input Layer
	// 	// price, income, food expenditure, food balance, bank balance
	// 	this.num_layer_1 = 8; // Hidden Layer 1
	// 	this.num_layer_2 = 10; // Hidden Layer 2
	// 	this.num_output = 1; // Output Layer
	// 	this.feedback = 0; // Use Feedback?
	// 	this.feedback_amplifier = 1;
	// 	this.num_actions = 1; // Buy or not. Really one of the neurons in Output Layer
	// 	this.num_recurrent_input = this.num_output - this.num_actions; // Output that is fed back.
	// 	this.num_input = this.num_recurrent_input*this.feedback + this.num_raw_input; // input is recurrent and raw

	// 	this.inputState = convnetjs.zeros(this.num_input);
	// 	this.convInputState = new convnetjs.Vol(1, 1, this.num_input); // A cube representation of this.inputState... compatible with convnetjs lib input.
	// 	this.outputState = convnetjs.zeros(this.num_output);

	// 	// Layer Definition
	// 	this.layer_defs = [];
	// 	// Layer Definition / Inputs
	// 	this.layer_defs.push({
	// 		type: 'input',
	// 		out_sx: 1,
	// 		out_sy: 1,
	// 		out_depth: this.num_input
	// 	});
	// 	// Layer Definition / Hidden Layer 1
	// 	this.layer_defs.push({
	// 		type: 'fc',
	// 		num_neurons: this.num_layer_1,
	// 		activation: 'tanh'
	// 	});
	// 	// Layer Definition / Hidden Layer 2
	// 	this.layer_defs.push({
	// 		type: 'fc',
	// 		num_neurons: this.num_layer_2,
	// 		activation: 'tanh'
	// 	});
	// 	// Layer Definition / Output
	// 	this.layer_defs.push({
	// 		type: 'regression',
	// 		num_neurons: this.num_output,
	// 	});

	// 	// Create Net
	// 	this.net = new convnetjs.Net();
	// 	this.net.makeLayers(this.layer_defs);
	// 	convnetjs.randomizeNetwork(this.net, 1.0);
	// };
	// Citizen_Buy_Brain.prototype = {
	// 	push_gene: function(gene_) {
	// 		var chromosome = new convnetjs.Chromosome(gene_);
	// 		chromosome.pushToNetwork(this.net);
	// 	},
	// 	get_gene: function() {
	// 		return convnetjs.getGeneFromNetwork(this.net);
	// 	},
	// 	set_input: function(price, income, food_expenditure, food_balance, bank_balance) {
	// 		var i = 0;
	// 		this.inputState[i++] = price;
	// 		this.inputState[i++] = income;
	// 		this.inputState[i++] = food_expenditure;
	// 		this.inputState[i++] = food_balance;
	// 		this.inputState[i++] = bank_balance;
	// 		// Add Feedback
	// 		if(this.feedback) {
	// 			for (var j = i; j < this.num_input; j++) {
	// 				this.inputState[j] = this.outputState[j-this.num_raw_input+1]*this.feedback_amplifier;
	// 			};
	// 		}
	// 		// Save into Convnet Cube 
	// 		for (i = 0; i < this.num_input; i++) { 
	// 			this.convInputState.w[i] = this.inputState[i];
	// 		}
	// 	},
	// 	forward: function(){
	// 		'use strict'
	// 		var a = this.net.forward(this.convInputState);
	// 		for (var i = this.num_output; i >= 0; i--) {
	// 			this.outputState[i] = a.w[i];
	// 		};
	// 	},
	// 	get_action: function(){
	// 		return this.outputState[0] > 0;
	// 	}
	// };