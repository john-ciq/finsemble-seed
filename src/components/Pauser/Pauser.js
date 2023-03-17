
const FSBLReady = () => {
	// The channel to transmit a release command on
	const CHANNEL = "hfx-release";

	try {
		// Listen to the release channel and release when a message is received
		FSBL.Clients.RouterClient.addListener(CHANNEL, (event) => {
			// Listen to transmitted events and publish ready when a message is received
			console.log("event", event);
			FSBL.publishReady();
		});
	} catch (e) {
		FSBL.Clients.Logger.error(e);
	}
};

if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", FSBLReady);
} else {
	window.addEventListener("FSBLReady", FSBLReady);
}
