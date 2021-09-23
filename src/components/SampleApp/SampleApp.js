// Log prefix (for easy filtering)
const LOG_PREFIX = "sample-service:client";

const FSBLReady = () => {

	try {
		FSBL.Clients.Logger.info(LOG_PREFIX, "addListener.ready");

		// BEGIN[https://chartiq.freshdesk.com/a/tickets/14514]
		// Actual data sent via "transmit"
		// {
		// 	value1: 'Test val string',
		// 	value2: 123,
		// 	value3: true,
		// 	value4: new Date()
		// }

		// Actual data received in the listener
		// {
		// 	value1: 'Test val string',
		// 	value2: 123,
		// 	value3: true,
		// 	value4: '2021-09-23T15:00:51.391Z'
		// }

		// Desired data structure
		// {
		// 	value1: 'Test val string',
		// 	value2: 123,
		// 	value3: true,
		// 	value4: [Date instance],
		//  value5: [Function]
		// }

		// Add a listener
		FSBL.Clients.RouterClient.addListener("sample-service", (error, event) => {
			if (error) {
				// Log the error
				FSBL.Clients.Logger.error(LOG_PREFIX, "ERROR:subscribe", error);
			} else {
				// Get a reference to the event data
				var payload = event.data;
				//
				// Convert value4 into a Date instance (value4 is currently a string)
				payload.value4 = new Date(payload.value4);
				//
				// Add a function
				// Note that arrow function will work so long as "this" is not referenced
				//
				// If the intent is to access event.data.value1, these are two approaches:
				// // Use a traditional function with a reference to self
				// payload.value5 = function value5Fn() {
				// 	return this.value1;
				// }
				//
				// // Use an arrow function that references the payload value ("this" does not reference anything in this case)
				// payload.value5 = () => {
				// 	return payload.value5;
				// }
				payload.value5 = function value5Fn() {
					return 'Function return value';
				}

				FSBL.Clients.Logger.info(LOG_PREFIX, "received", payload, payload.value5());
			}
		});
		// END[https://chartiq.freshdesk.com/a/tickets/14514]
		FSBL.Clients.Logger.info(LOG_PREFIX, "addListener.complete");

	} catch (e) {
		FSBL.Clients.Logger.error(e);
	}
};

if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", FSBLReady);
} else {
	window.addEventListener("FSBLReady", FSBLReady);
}
