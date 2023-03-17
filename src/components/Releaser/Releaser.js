const FSBLReady = () => {
	// The channel to transmit a release command on
	const CHANNEL = "hfx-release";

	try {
		// Release the pauser
		const doRelease = () => {
			const message = { date: new Date().getTime() };
			console.log("sending release message", message);
			FSBL.Clients.RouterClient.transmit(CHANNEL, message);

			// TODO: Uncomment this to close the window after releasing
			// finsembleWindow.close();
		}

		// Add a button click handler to release the pauser when clicked
		const releaseButton = document.getElementById("js-button-release");
		releaseButton.addEventListener("click", doRelease);

		// TODO: Uncomment to release when this app is spawned
		// doRelease();
	} catch (e) {
		FSBL.Clients.Logger.error(e);
	}
};

if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", FSBLReady);
} else {
	window.addEventListener("FSBLReady", FSBLReady);
}
