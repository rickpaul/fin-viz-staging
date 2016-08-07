init_shop_price_genes = [
	[-0.092,1.719,-1.15,0.227,0.23,0.213,0.441,-0.572,1.116,2.053,-1.515,1.426,-0.627,-0.693,1.355,-0.734,0.883,1.498,-1.113,-0.889,0.094,0.91,-0.073,1.327,-1.012,0.307,-1.901,-0.31,1.084,-0.533,-0.584,1.622,0.616,0.163,1.384,-0.855,-0.807,0.77,-0.338,-0.016,0.592],
	[-1.581,0.089,0.487,-1.356,-0.286,0.427,-0.095,3.016,-0.611,0.395,-0.598,2.42,-0.429,-0.359,-0.652,-2.283,-0.457,0.15,-0.61,-0.193,-0.735,0.361,-0.631,-0.15,0.833,0.7,0.066,-0.68,-0.302,-0.626,0.377,-0.659,-2.25,0.48,1.288,0.101,-0.431,-0.194,-0.362,-0.415,-0.061],
	[0.163,2.381,-0.483,-1.266,-0.078,1.072,0.098,1.455,0.093,-0.57,0.499,-0.429,0.333,-0.038,1.318,0.257,-0.331,0.248,0.659,0.638,0.719,-1.478,0.324,0.245,-0.239,0.217,0.297,-1.027,-0.382,0.402,0.743,-0.289,-0.232,0.586,2.377,-0.078,1.208,1.367,0.2,-1.223,-0.313],
	[-0.276,-0.362,-1.614,-0.865,2.134,-1.221,-1.218,1.381,-0.514,1.535,-0.834,-0.628,-0.879,0.33,0.276,0.693,0.025,0.622,-1.787,-0.53,-1.035,1.352,-0.327,0.282,-0.195,-0.95,-1.702,-1.465,-0.006,0.599,-0.708,-0.488,0.536,1.034,1.219,-0.362,-0.002,-0.039,0.167,-0.547,0.086],
	[-0.199,-0.161,0.412,0.418,-0.688,-0.67,0.279,-0.519,0.236,0.052,0.151,1.055,-1.048,-0.22,1.508,0.708,0.65,-1.878,-1.132,-0.253,0.957,0.738,0.145,0.804,0,-1.059,-0.702,-0.003,-2.539,0.15,-2.128,-1.682,1.455,-1.034,-0.403,0.951,-1.042,0.625,-0.081,-0.131,1.14]
];

var shop_color_scale = d3.scale.linear()
	.range(['#F00', '#00F']);

	var Simulation = function(sim_svg_, sd_svg_){
		// Create Simulation Display
		this.sim_svg = sim_svg_;
		var sim_group = this.sim_svg
			.append('g')
				.classed('simulation', true);
		this.shops_display = sim_group.append('g').selectAll('g');
		this.citizens_display = sim_group.append('g').selectAll('g');
		this.transactions_display = sim_group.append('g').selectAll('g');
		this.shop_information_display = this.sim_svg.append('g')
			// .attr('width', 100)
			// .attr('height', 200)
			.attr('transform', 'translate('+(this.sim_svg.width-100)+','+(this.sim_svg.height-100)+')');
		this.shop_information_display
			.append('svg:text')
				.attr('id', 'shop_price')
				.attr('transform', 'translate(0,10)');
		this.shop_information_display
			.append('svg:text')
				.attr('id', 'shop_bank_balance')
				.attr('transform', 'translate(0,20)');
		this.shop_information_display
			.append('svg:text')
				.attr('id', 'shop_food_balance')
				.attr('transform', 'translate(0,30)');
		this.shop_information_display
			.append('svg:text')
				.attr('id', 'shop_score')
				.attr('transform', 'translate(0,40)');
		// Create Supply/Demand Graph Display
		this.sd_svg = sd_svg_;
		this.sd_chart = new LinearSDChart(this.sd_svg);
		// this.shop_chrm_display = d3.select('#shop_chrm_display').selectAll('div');
		// this.shop_brain_display = d3.select('#shop_brain_display').append('svg').select('svg');
		//
		this.Transactions = [];
		// Create Shop Price Brain Trainer
		var init_genes = [];
		for (var i = num_shops - 1; i >= 0; i--) {
			init_genes.push(init_shop_price_genes[random_int(0,init_shop_price_genes.length)]);
		};
		this.shop_price_trainer = new Trainer(new Shop_Price_Brain(), num_shops, null); // HACK!! How to pass population size?
		this.shop_price_trainer.populate_chromosomes(init_genes);
		//
		this.running = false; // DEPRECATED?
		this.step_num = 0;
		this.stop_num = -1; // DEPRECATED?
	};
	Simulation.prototype = {
		populate: function(num_citizens_, num_shops_) {
			this.Shops = [];
			this.Citizens = [];
			this.Transactions = [];
			var nc = num_citizens_ || num_citizens;
			var ns = num_shops_ || num_shops;
			for (var i = nc - 1; i >= 0; i--) {
				this.Citizens.push(new Citizen());
			};
			var f = sim_p_width/(ns+1);
			for (var i = ns - 1; i >= 0; i--) {
				this.Shops.push(new Shop((i+1)*f, sim_p_height/2-4));
			};
			this.shop_price_trainer.populate(this.Shops);
			this.shop_price_trainer.update(); // add old genes to new shops. Needs to have save_fitness called previously
		},
		run: function() {
			var this_ = this;
			this.running = true;
			this.runID = setInterval(function(){this_.step();}, 1000/frame_rate);
		},
		handle_keydown: function(){
			// console.log('Simulation:handle_keydown');
			if ( this.running ) {
				this.stop();
			} else {
				this.step();
			}
		},
		step: function() {
			this.step_num++;
			this.update();
			this.display();
		},
		check_reset: function(){
			var num_alive;
			num_alive = 0;
			this.Shops.forEach(function(d){
				num_alive += !d.dead;
			});
			return (num_alive === 0);
		},
		reset: function() {
			console.log('Simulation:reset');
			this.stop();
			this.populate();
		},
		stop: function() {
			this.running = false;
			clearInterval(this.runID);
			this.shop_price_trainer.save_fitness();
		},
		update: function() {
			// console.log('Simulation:update');
			var this_ = this;
			this.create_transactions();
			this.Transactions.forEach( function(d, i) { 
				d.update();
				if( d.should_cleanup() ) {
					d.cleanup();
					this_.Transactions.splice(i, 1);
				}
			})
			this.Shops.forEach( function(d){ d.update(); });
			this.Citizens.forEach( function(d, i) { 
				d.update();
				if( d.should_cleanup() ) {
					this_.Citizens.splice(i, 1);
				}
			})
			if(this.step_num%CITIZEN_BIRTH_RATE==0) {
				this.Citizens.push(new Citizen());
			}
			if (this.check_reset()) {this.stop();}
		},
		create_transactions: function(){
			var s_, c_;
			var live_Citizens = _.filter(this.Citizens, function(d){return (!d.dead && !d.engaged);});
			var live_Shops = _.filter(this.Shops, function(d){return (!d.dead && !d.engaged);});
			for (var i = live_Citizens.length - 1; i >= 0; i--) {
				c_ = live_Citizens[i];
				for (var j = live_Shops.length - 1; j >= 0; j--) {
					s_ = live_Shops[j];
					if(Vector.manhattan_dist(c_.position, s_.position) <= DISTANCE_THRESHOLD){
						this.Transactions.push(new Transaction(c_, s_));
						break;
					}
				}
			}
		},
		display: function() {
			// console.log('Simulation:display');
			this.display_shops();
			this.display_citizens();
			this.display_transactions();
			this.sd_chart.add_supplier_data(this.Shops);
			this.sd_chart.add_demander_data(this.Citizens);
			this.sd_chart.display();
		},
		display_transactions: function(){
			this.transactions_display = this.transactions_display.data(this.Transactions);
			this.transactions_display
				.attr('d', function(d){
					return (
						'M'+sim_p2w(d.buyer.position.x)+','+sim_p2w(d.buyer.position.y)+
						'L'+sim_p2w(d.seller.position.x)+','+sim_p2w(d.seller.position.y)
					);
				})
				.style('stroke', function(d){ return d.stroke_color; });

			this.transactions_display
			.enter()
				.append('svg:path')
				.style('stroke', function(d){ return d.stroke_color; })
				.style('stroke-width', .5)
				.attr('d', function(d){
					return (
						'M'+sim_p2w(d.buyer.position.x)+','+sim_p2w(d.buyer.position.y)+
						'L'+sim_p2w(d.seller.position.x)+','+sim_p2w(d.seller.position.y)
					);
				});
			this.transactions_display.exit().remove();
		},
		// display_shop_chromosomes: function(){
			// this.shope_chrm_display = this.shope_chrm_display.data(this.shop_price_trainer.trainer.chromosomes);
			// var chrm_enter = this.shope_chrm_display
			// .enter()
			// 	.append('div')
			// 	.attr('class','chromosome');
			// chrm_enter
			// 	.append('p')
			// 	.attr('class','fitness_display')
			// 	.text(function(d){
			// 		return d.fitness;
			// 	});
			// chrm_enter
			// 	.append('p')
			// 	.attr('class','gene_display')
			// 	.text(function(e){
			// 		var gene_string = '';
			// 		e.gene.forEach(function(e){
			// 			gene_string += round_(e,2)+'  |  ';
			// 		})
			// 		return '['+gene_string+']';
			// 	});
		// },
		// display_shop_genes: function(){
		// 	if (!this.selected_shop){return;}
		// 	var layer = null;
		// 	var bias = null;
		// 	var brain = this.selected_shop.price_brain;
		// 	for (var i = brain.net.layers.length - 1; i >= 0; i--) {
		// 		brain.net.layers[i]
		// 	};
		// },
		display_shops: function() {
			shop_color_scale.domain(
				d3.extent(this.Shops.map(function(d){return d.score;}))
			);
			this.shops_display = this.shops_display.data(this.Shops);
			var shops_update = this.shops_display
				.attr('transform', function(d){ return 'translate('+sim_p2w(d.position.x)+','+sim_p2w(d.position.y)+')'; })
			shops_update
			.select('text.price')
				.text(function(d, i){
					return d.sell_price;
				});
			shops_update
			.select('text.score')
				.text(function(d, i){
					return round_(d.score,2);
				});
			shops_update
			.select('text.transactions')
				.text(function(d, i){ return d.transaction_history.list; });
			shops_update
			.select('rect')
				.style('fill', function(d){ return d.fill_color; })
				.style('stroke', function(d){ return d.stroke_color; });

			var shops_enter = this.shops_display
			.enter()
				.append('g')
					.classed('shop_class', true)
					.attr('transform', function(d){ return 'translate('+sim_p2w(d.position.x)+','+sim_p2w(d.position.y)+')'; });
			shops_enter
				.append('svg:rect')
					.attr('width', sim_p2w(1))
					.attr('height', sim_p2w(1))
					.style('fill', function(d){ return d.fill_color; })
					.style('stroke', function(d){ return d.stroke_color; });
			shops_enter
				.append('svg:text')
				.classed('price', true)
				.attr('transform', 'translate(0,-20)');
			shops_enter
				.append('svg:text')
				.classed('score', true)
				.attr('transform', 'translate(0,-10)');
			shops_enter
				.append('svg:text')
				.classed('transactions', true)
				.attr('transform', 'translate(5,-30), rotate(-90)');

			this.shops_display.exit().remove();
		},
		display_citizens: function() {
			// console.log('Simulation:display_citizens');
			this.citizens_display = this.citizens_display.data(this.Citizens);

			var citizens_update = this.citizens_display
				.attr('transform', function(d){return 'translate('+sim_p2w(d.position.x)+','+sim_p2w(d.position.y)+')';})
			citizens_update
			.select('circle')
				.style('fill', function(d){ return d.fill_color; })
				.style('stroke', function(d){ return d.stroke_color; });
			citizens_update
				.select('path')
					.attr('d', function(d){return d.heading_line;});

			var citizens_enter = this.citizens_display
			.enter()
				.append('g')
					.classed(CITIZEN_CLASS, true)
					.attr('transform' , function(d){ return 'translate('+sim_p2w(d.position.x)+','+sim_p2w(d.position.y)+')'; });
			citizens_enter
			.append('svg:circle')
				.attr('r', sim_p2w(.5))
				.style('fill', function(d){ return d.fill_color; })
				.style('stroke', function(d){ return d.stroke_color; });
			citizens_enter
			.append('svg:text')
				.attr('transform','translate(-20,-6)');
			citizens_enter
			.append('svg:path')
				.style('stroke', function(d){ return d.stroke_color; })
				.style('stroke-width',0.5)
				.attr('d', function(d){return d.heading_line;});

			this.citizens_display.exit().remove();
		},
	};
