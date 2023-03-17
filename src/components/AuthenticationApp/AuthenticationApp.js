
const FSBLReady = () => {
	try {
		// The key for the spawn data app to launch
		const KEY_SPAWNDATA_APPNAME = "targetApp";

		// The channel to transmit a release command on
		const CHANNEL = "hfx-release";

		const APP_RELEASER_NAME = "Releaser";

		// The launch button
		const launchButton = document.getElementById("js-button-launch");
		launchButton.addEventListener("click", () => {
			const appInput = document.getElementById("js-input-launch");
			const app = appInput.value;
			const message = {
				data: {
					[KEY_SPAWNDATA_APPNAME]: APP_RELEASER_NAME
				}
			};
			console.log('spawning', message);
			FSBL.Clients.LauncherClient.spawn(app, message);
		});

		// The auth button
		const authButton = document.getElementById("js-button-publish_authorization");
		authButton.addEventListener("click", () => {
			const userInput = document.getElementById("js-input-user");
			const username = userInput.value;
			FSBL.Clients.AuthenticationClient.publishAuthorization(username);

			// TODO: Uncomment this to close the window after publishing authentication
			// finsembleWindow.close();
		});

		// The release button (for testing)
		const releaseButton = document.getElementById("js-button-release");
		releaseButton.addEventListener("click", () => {
			const message = { date: new Date().getTime() };
			console.log("sending release message", message);
			FSBL.Clients.RouterClient.transmit(CHANNEL, message);
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
