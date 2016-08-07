
	var Shop = function(x_, y_) {
		// Basic Setup
		this.id = shop_id++;
		this.dead = false;
		this.lifespan = 0;
		this.time_dead = null;
		this.score = 0;
		this.engaged = false;
		// Init Movement
		this.position = new Vector(x_ || random_(0, sim_p_width), y_ || random_(0, sim_p_height));
		// Init Behavior
		// this.bank_balance = 0;
		this.food_balance = SHOP_INIT_BALANCE;
		this.sell_price = round_(random_(100, 150), 2);
		this.cost = 0;
		// Init Behavior | Init Brain
		this.price_brain = new Shop_Price_Brain();
		this.transaction_history = new Queue([0,0,0,0,0,0,0,0]); // 8 long queue
	}

	Shop.prototype = {
		/*
		* update()
		* RETURNS: 
		* whether Shop is dead (so Simulation knows how to deal with it.)
		*	DOES: 
		* updates the Shop'ss position and lifespan
		* checks if this should die and kills accordingly.
		*/
		update: function() {
			if ( this.dead ) {
				this.time_dead++;
				return false;
			} else {
				this.update_price();
				this.lifespan++;
				if( this.should_die() ) {
					this.die();
				}
				return true;
			}
		},
		/*
		* update_price()
		* RETURNS: 
		* <nothing>
		*	DOES: 
		* puts input into brain and changes shop price accordingly
		*/
		update_price: function(){
			this.price_brain.set_input(
				this.transaction_history.list
			);
			this.price_brain.forward();
			this.sell_price += this.price_brain.get_action();
			this.sell_price = round_(this.sell_price, 2);
			this.sell_price = Math.max(this.sell_price, 0);
		},
		record_successful_sale: function(total_amount, total_price){
			this.score += (total_price - total_amount*this.cost);
			this.food_balance -= total_amount;
			// this.bank_balance += total_price;
			this.transaction_history.push(1);
		},
		record_failed_sale: function(total_amount, total_price){
			this.transaction_history.push(-1);
		},
		should_die: function() {
			return (this.food_balance <= 0 || this.lifespan > SHOP_LIFESPAN);
		},
		die: function(){
			this.dead = true;
		},
		push_gene: function(gene_){
			this.price_brain.push_gene(gene_);
		},
		get fill_color(){
			return shop_color_scale(this.score);
		},
		get stroke_color(){
			if(this.dead) {
				return '#000'
			} else {
				return shop_color_scale(this.score);
			}
		},
	};

