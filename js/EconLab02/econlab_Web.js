function WEB_run_simulation () {
	var s = Simulation_;
	return function(){
		if( s.running ){ return; }
		$('#btn_stop_sim_input').removeClass('disabled'); 
		$('#btn_run_sim_input').addClass('disabled'); 
		s.run();
		console.log('Running: Step ' + s.step_num);
	}
}

function WEB_stop_simulation () {
	var s = Simulation_;
	return function(){
		if( !s.running ){ return; }
		$('#btn_stop_sim_input').addClass('disabled'); 
		$('#btn_run_sim_input').removeClass('disabled'); 
		s.stop();
		console.log('Stopped: Step ' + s.step_num);
	}
}

function WEB_step_simulation () {
	var s = Simulation_;
	return function(){
		if(s.running){
			$('#btn_run_sim_input').removeClass('disabled'); 
			$('#btn_stop_sim_input').addClass('disabled'); 
			s.stop();
			console.log('Stopped: Step ' + s.step_num);
		}
		console.log('Stepping: Step ' + s.step_num);
		s.step();
	}
}

function WEB_reset_simulation() {
	var s = Simulation_;
	return function(){
		$('#btn_stop_sim_input').addClass('disabled'); 
		$('#btn_run_sim_input').removeClass('disabled'); 
		s.reset();
	}
}