
	var Citizen = function(x_, y_){
		// Basic Setup
		this.id = citizen_id++;
		this.dead = false;
		this.lifespan = 0;
		this.time_dead = null;
		this.score = 0;
		this.engaged = false;
		// Init Movement
		this.position = new Vector(sim_p_width-1, sim_p_height/2);
		this.velocity = new Vector(-1, 0);
		this.velocity.normalize();
		this.acceleration = new Vector(0, 0);
		// Init Behavior
		this.buy_price = random_(120,130);
	}

	Citizen.prototype = {
		/*
		* update_movement()
		* RETURNS: 
		* <nothing>
		*	DOES: 
		* update the citizen's position
		*/
		update_movement: function(){
			this.velocity.add(this.acceleration);
			this.velocity.limit(CITIZEN_MAX_SPEED);
			this.position.add(this.velocity);
			if(this.position.x >= sim_p_width || this.position.x <= 0){
				this.die();
			// 	this.velocity.x *= random_(-1.5,-0.5);
			// 	this.velocity.y *= random_(-1.5,1.5);
			// 	this.velocity.normalize();
			// } else if (this.position.y >= p_height || this.position.y <= 0){
			// 	this.velocity.y *= random_(-1.5,-0.5);
			// 	this.velocity.x *= random_(-1.5,1.5);
			// 	this.velocity.normalize();
			}
			// reset acceleration to 0
			// this.acceleration.mult(0); 
		},
		/*
		* update()
		* RETURNS: 
		* whether Citizen is dead (so Simulation knows how to deal with it.)
		*	DOES: 
		* updates the Citizen's position and lifespan
		* checks if this should die and kills accordingly.
		*/
		update: function() {
			if (this.dead){
				this.time_dead++;
				return false;
			} else {
				if( this.should_die() ){
					this.die();
					return false;
				} else {
					this.lifespan++;
					this.update_movement();
					return true;
				}
			}
		},
		/*
		* should_die()
		* RETURNS: 
		* whether Citizen should die
		*	DOES: 
		* checks if the Citizen is out of bounds and kills it if it is.
		*/
		should_die: function() {
			return this.lifespan>=CITIZEN_LIFESPAN;
		},
		should_cleanup: function() {
			return (this.time_dead >= 3);
		},
		die: function() {
			this.time_dead = 0;
			this.dead = true;
		},
		cleanup: function(){

		},
		push_gene: function(gene_) {
			this.buy_brain.push_gene(gene_);
		},
		make_purchase_decision: function(price_) {
			return price_ <= this.buy_price;
		},
		get heading_line(){
			var r = sim_p2w(0.5);
			return 'M0,0L'+this.velocity.x*r+','+this.velocity.y*r;
		},
		get fill_color(){
			if(!this.dead) { 
				return 'red';
			} else {
				return 'black';
			}
		},
		get stroke_color(){
			return 'black';
		},
		// get score(){
		// 	return this.lifespan + (Math.max(0, this.bank_balance) + Math.max(0, this.food_balance));
		// },
	}

