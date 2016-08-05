
'use strict'
var vizfin = vizfin || {};

(function(global_ref){

	function get_ScatterChart_testData(n) {
		n = n || 100;
		var chart_data = [];
		for (var i = n - 1; i >= 0; i--) {
			chart_data.push({
				x: Math.random()/10 - Math.random()/10,
				y: Math.random()/10 - Math.random()/10,
				dt: i
			})
		};
		return chart_data;
	}

	/*
	Taken from 
	http://stackoverflow.com/questions/6715571/how-to-get-result-of-console-trace-as-string-in-javascript-with-chrome-or-fire
	To Use It:
	console.log(vizfin.Help.get_stack_trace().join('\n'));
	*/
	function get_stack_trace () {
		var stack;
		try {
			throw new Error('');
		}
		catch (error) {
			stack = error.stack || '';
		}
		stack = stack.split('\n').map(function (line) { return line.trim(); });
		return stack.splice(stack[0] == 'Error' ? 2 : 1);
	}


	global_ref.Help = {
		get_stack_trace: get_stack_trace,
		get_ScatterChart_testData: get_ScatterChart_testData,
	}

})(vizfin);
