
	Trainer = function(brain_, population_size, init_gene_) {
		this.brain = brain_;
		// this.push_gene_fn = push_gene_fn_; // TODO: make push gene function anonymous
		this.net = this.brain.net;
		init_gene = init_gene_ || null;

		this.trainer = new convnetjs.GATrainer(this.net, {
			population_size: population_size,
			mutation_size: 1.00,
			mutation_rate: 0.05,
			init_weight_magnitude: 0.1,
			elite_percentage: 0.30
		}, init_gene);
		this.num_chromosomes = this.trainer.chromosomes.length;
	}
	Trainer.prototype = {
		populate: function(population_){
			if( population_.length != this.num_chromosomes ){
				throw new Error('Wrong population size for trainer');
			}
			this.population = population_;
		},
		// avoid doing this except at initialization
		populate_chromosomes: function(genes_) {
			if( genes_.length != this.num_chromosomes ){
				throw new Error('Wrong population size for trainer');
			}
			for (var i = this.num_chromosomes - 1; i >= 0; i--) {
				this.trainer.chromosomes[i].gene = genes_[i];
			}
		},
		// train: function() { // used to be named train
		// 	this.clear_fitness(); // reset current fitness
		// 	this.add_fitness(); // add current fitness
		// 	this.trainer.evolve(); // evolve (incorporate hall of fame, crossover, etc. )
		// 	this.push_genes(); // add current fitness
		// },
		save_fitness: function() { // used to be part of train
			this.clear_fitness(); // reset current fitness
			this.add_fitness(); // add current fitness
		},
		update: function() { // used to be part of train
			this.trainer.evolve(); // evolve (incorporate hall of fame, crossover, etc. )
			this.push_genes();
		},
		clear_fitness: function() {
			for (var i = this.num_chromosomes - 1; i >= 0; i--) {
				this.trainer.chromosomes[i].fitness = 0;
			};
		},
		add_fitness: function() {
			for (var i = this.num_chromosomes - 1; i >= 0; i--) {
				this.trainer.chromosomes[i].fitness += this.population[i].score;
			};
		},
		normalize_fitness: function(){
			var avg_ = 0;
			for (var i = this.num_chromosomes - 1; i >= 0; i--) {
				avg_ += this.population[i].score;
			}
			avg_ /= this.num_chromosomes;
			for (var i = this.num_chromosomes - 1; i >= 0; i--) {
				this.trainer.chromosomes[i].fitness -= avg_;
			}
		},
		push_genes:  function() { //push_all_genes, really
			for (var i = this.num_chromosomes - 1; i >= 0; i--) {
				this.population[i].push_gene(this.trainer.chromosomes[i].gene);
			};
		},
		push_best_genes: function() {
			var h;
			for (var i = this.num_chromosomes - 1; i >= 0; i--) {
				h = random_int(0, this.trainer.hall_of_fame_size);
				this.population[i].push_gene(this.get_best_chromosome(h).gene);
			};
		},
		// mutate: function() {
		// 	return;
		// 	for (var i = this.num_chromosomes - 1; i >= 0; i--) {
		// 		this.population[i].push_gene(this.trainer.chromosomes[i].mutate(0.05, 1));
		// 	};
		// },
		// crossover_genes: function() {
		// 	for (var i = this.num_chromosomes - 1; i >= 0; i--) {
		// 		h = random_int(0, this.trainer.hall_of_fame_size);
		// 		// could be optimized
		// 		var old_chrm = this.trainer.chromosomes[i];
		// 		var old_clne = old_chrm.clone();
		// 		var old_gene = old_chrm.gene;
		// 		var new_gene = this.get_best_chromosome(h).gene;
		// 		var new_chrm = new convnetjs.Chromosome(new_gene);
		// 		var new_clne = new_chrm.clone();
		// 		old_chrm.crossover(new_chrm,old_clne,new_clne);
		// 		this.population[i].push_gene(new_clne.gene);
		// 	};			
		// },
		get_chromosome: function(n){
			n = n || 0;
			return this.trainer.chromosomes[n].clone();
		},
		get_best_chromosome: function(n){
			n = n || 0;
			return this.trainer.hallOfFame[n].clone();
		},
	}