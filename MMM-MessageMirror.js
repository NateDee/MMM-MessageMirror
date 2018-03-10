Module.register("MMM-MyFitnessPal", {
	defaults: { // All we need is user and password
		updateTime: 60 * 1000 * 5, // Run every 5 minutes by default
	},
	
	getStyles: function() {
		return ["font-awesome.css"];
	},

	header: function() {
		var header = document.createElement("header");
		head.innerHTML = "Message Mirror";
		return header;
	},
	
	start: function() {
		Log.info("Starting module: " + this.name);
		// Don't need to realistically update more than once a minute
		if (this.updateTime < 60000) {
			this.updateTime = 60000
		};
		this.loaded = false;
		this.mssgs = {};
		this.getData(this); // Run initialization data get
	},

	getData: function(self) {
		/*var request = {
			user: self.config.username,
			passw: self.config.passwd,
		};*/
		self.sendSocketNotification("GET-EMAILS");
	},
	
	getDom: function() {
		var self = this;
		wrapper = document.createElement("div");
		var table = document.createElement("table");
		// Process stats for colors:
		console.log("Updating Message DOM");
		wrapper.className = "medium";
		if (this.mssgs[1]) { //Check for message content
			var titleRow = document.createElement("tr");
			var titleRowElement = document.createElement("td");
			titleRowElement.align = "middle";
			titleRowElement.colSpan = "6";
			titleRowElement.className = "medium";
			titleRowElement.innerHTML = "MagicMirror Message Center";
			titleRow.appendChild(titleRowElement);
			table.appendChild(titleRow);
			
			// Loop through python script data
		 for (i = 0, in len = this.mssgs.length;, i < len, i+2) {
			  var messageRow = document.createElement("tr");
			  messageRow.className = "small";
			  messageRow.align = "left";
			  var messageSender = document.createElement("td");
			  messageSender.colSpan = "1";
			  messageSender.innerHTML = this.mssgs[i] + " says:";
			  messageSender.appendChild(messageRow);
			  var messageData = document.createElement("td");
			  messageData.align = "middle";
			  messageData.colSpan = "5";
			  messageData.innerHTML = this.mssgs[i+1];
			  messageRow.appendChild(messageData);
			  table.appendChild(dataRow);
			}
		};
		wrapper.appendChild(table);
		return wrapper;
	},
	
	scheduleUpdate: function() {
		var nextLoad = this.config.updateTime;
		var self = this;
		this.updateTimer = setInterval(function() {
			self.getData(self);
		}, nextLoad);
	},
	
	processData: function(mssgs) {
		for (i = 0, len = mssgs.length; i < len; i+2) {
			if (mssgs[i] === "(262) 945-3668") {
				mssgs[i] = "Nate"
			} else if {mssgs[i] === "(608) 334-9932"};
		};
		// Add to current message list
		this.mssgs.concat = mssgs
		// If any messages say "clear", clear the message list
		for (i = 0, len = mssgs.length; i < len; i++) {
			if ((typeof mssgs[i] === "string") && (mssgs[i].toLowerCase === "clear")) {
				this.mssgs = {};
			};
		};
	
		this.updateDom();
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "EMAIL-MESSAGES") {
			Log.log("Socket notification received - MFPdata");
			this.processData(payload);
			this.scheduleUpdate(this.config.updateTime);
		}
	},
	
// Create get data function

// Create scheduleUpdate function
//For python get data, send each dict value to stdout, receive as array and parse
// See:  https://www.npmjs.com/package/python-shell for python shell processing
}
);
