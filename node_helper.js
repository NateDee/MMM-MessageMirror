var NodeHelper = require('node_helper');
var PythonShell = require('python-shell');

module.exports = NodeHelper.create({
	start: function() {
		this.config = null;
	},
	
	socketNotificationReceived: function(notification, payload) { // Payload is 'request' from MMM-CTA
		var self = this;
		if (notification === "GET-EMAILS" ) {		
			// self.config = payload;
			self.getData();
			console.log("GOT notify in node_helper(Email)");
			}
	},

	getData: function() {
		console.log("Getting emails"); // for debugging
		var self = this;
		var resultSend = {};
		var options = {
			mode: 'json',
			pythonPath: '/usr/bin/python3',
			scriptPath: './modules/MMM-MessageMirror/python',
			// scriptPath: '/home/pi/MagicMirror/modules/MMM-MyFitnessPal',
			// args: [payload.user, payload.passw]
		}
		const mfpPyShell = new PythonShell('gmail_read.py', options);
		mfpPyShell.on('message', function(message) { 
				console.log(message);
				self.testvar = message;
				self.sendSocketNotification("EMAIL-MESSAGES", message);
		});
		mfpPyShell.end(function (err) {
			if (err) throw err;
			console.log('Finished getting emails');
		});
	},


//For python get data, send each dict value to stdout, receive as array and parse
// See:  https://www.npmjs.com/package/python-shell for python shell processing
});
