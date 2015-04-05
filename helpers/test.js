var nodestalker = require('nodestalker');

var client = nodestalker.Client();
var client2 = nodestalker.Client();

var max = 1000;
var ids = [];


function buryJobs() {
	var completed = 0;

	function reserveJob() {
		client2.reserve().onSuccess(function(data) {
			console.log(data);

			client2.bury(data.id).onSuccess(function () {
				completed++;
				if(completed >= max) {
					client2.disconnect();
				} else {
					reserveJob();
				}
			});
		});
	}

	client2.watch('default').onSuccess(function() {
		reserveJob();
	});
}


client.use('default').onSuccess(function() {
	var completed = 0;
	for(var i =0; i<max; i++) {
		client.put("foo" + i, 10000, 0).onSuccess(function(data) {
			ids.push(data[0]);
			completed += 1;

			if(completed >= max) {
				client.disconnect();
				console.log(ids);
				buryJobs();
			}
		});
	}
});