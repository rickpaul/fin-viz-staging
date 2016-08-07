	var Transaction = function(buyer_, seller_){
		this.buyer = buyer_;
		this.seller = seller_;
		this.buyer.engaged = true;
		this.seller.engaged = true;
		this.seller_desire = 1; // TODO: Make Programatic.
		this.buyer_desire = 1; // TODO: Make Programatic.
		this.seller_capacity = seller_.food_balance; 
		this.buyer_capacity = buyer_.bank_balance;
		this.outcome = null;
		this.dead = false;
		this.lifespan = 0;
		this.time_dead = 0;
	};

	Transaction.prototype = {
		update: function() {
			if( this.dead ) {
				this.time_dead++;
				return false;
			}
			else {
				if( this.should_die() ){
					this.die();
					return true;
				} else {
					this.lifespan++;
					this.attempt_transaction();
					return true;
				}
			}
		},
		should_die: function() {
			return (Vector.manhattan_dist(this.buyer.position, this.seller.position) > DISTANCE_THRESHOLD || this.outcome === 1);
		},
		die: function() {
			this.time_dead = 0;
			this.dead = true;
		},
		should_cleanup: function() {
			return (this.time_dead >= 3);
		},
		cleanup: function() {
			this.buyer.engaged = false;
			this.seller.engaged = false;
		},
		attempt_transaction: function() {
			if ( this.outcome === 1 ) { 
				this.time_dead++;
				return;
			} else {
				var trns_amount = Math.min(this.seller_capacity, this.seller_desire, this.buyer_desire);
				var seller_price = this.seller.sell_price;
				var trns_price = seller_price * trns_amount;
				if ( trns_amount === 0 ){
					// console.log('transaction impossible on quantity!');
					this.seller.record_failed_sale(trns_amount, trns_price);
					this.outcome = -1;
					return false;
				} else if ( trns_price > this.buyer_capacity ) {
					// console.log('transaction impossible on price!');
					this.seller.record_failed_sale(trns_amount, trns_price);
					this.outcome = -1;
					return false;
				} else if ( !this.buyer.make_purchase_decision(seller_price) ) {
					// console.log('transaction refused!');
					this.seller.record_failed_sale(trns_amount, trns_price);
					this.outcome = -1;
					return false;
				} else {
					// console.log('transaction made!');
					this.perform_transaction(trns_amount, trns_price);
					return true;
				}
			}
		},
		perform_transaction: function(trns_amount, trns_price) {
			this.seller.record_successful_sale(trns_amount, trns_price);
			this.buyer.bank_balance -= trns_price;
			this.buyer.food_balance += trns_amount;
			this.outcome = 1;
			// this.buyer.score += trns_amount; // TODO: Better metrics. Lifespan?
		},
		get stroke_color() {
			if(this.outcome === 1) {
				return 'green';
			} else if (this.outcome === -1) {
				return 'red';
			} else {
				return 'black';
			}
		},

	};