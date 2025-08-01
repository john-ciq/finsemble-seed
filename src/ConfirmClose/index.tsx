/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { createRoot } from "react-dom/client";

// This line imports type declarations for Finsemble's globals such as FSBL and fdc3. You can ignore any warnings that it is defined but never used.
// Please use global FSBL and fdc3 objects instead of importing from finsemble-core.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { types } from "@finsemble/finsemble-core";

const HelloWorld = () => {

	(async () => {
		// Get the FinsembleWindow instance
		//
		// NOTE: window.finsembleWindow is may not be available when this code is run, so we
		//       workaround the issue this way
		let { wrap: finwin } = await FSBL.FinsembleWindow.getInstance({ name: window.name })

		// Add the close listener
		finwin.addEventListener('close-requested', (event) => {

			// Immediately invoke wait() within 1 second
			event.wait();

			// Prompt the user to close
			FSBL.Clients.DialogManager.open(
				"YesNoDialog",
				{
					title: `Close`,
					question: `Do you really want to close?`,
					showCancelButton: false,
					negativeResponseLabel: "No",
				},
				(err, response) => {
					let { choice } = response;
					switch (choice) {
						case "affirmative":
							event.done();
							break;
						case "negative":
							event.cancel();
							break;
					}
				}
			);

			// Alternate approach using window.confirm, but this seems to work correctly in some cases
			//
			// // Prompt the user to close
			// const result = window.confirm("Are you sure you want to close?");
			//
			// // Handle the close
			// if (result) {
			// 	// User selected yes, close the window
			// 	event.done();
			// } else {
			// 	// User selected no, cancel the close event
			// 	event.cancel();
			// }
		});
	})();

	return (
		<div>Hello World!</div>
	);

};

const container = document.getElementsByTagName("div")[0];
createRoot(container).render(<HelloWorld />);
