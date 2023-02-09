import React from "react";
import ReactDOM from "react-dom";
import { FinsembleCSS, FinsembleProvider } from "@finsemble/finsemble-core";
import { FEAGlobals } from "@finsemble/finsemble-core/";


// TODO: Insert desired props here
export type NonDialogComponentProps = {};

/**
 * Implements a Finsemble dialog using API calls only.
 *
 * @param props the props for this component
 * @returns a rendered component
 */
export const NonDialogComponent: React.FunctionComponent<NonDialogComponentProps> = (props: any) => {

	/**
	 * Helper method used to send the opener the result of the dialog user choice.
	 *
	 * @param choice the user-selected choice to return to the opener
	 * @returns a Promise once complete
	 */
	const respondToOpener = (choice) => FEAGlobals.FSBL.Clients.DialogManager.respondToOpener({ choice });

	const respondNope = () => respondToOpener("Nope");
	const respondMaybe = () => respondToOpener("Maybe");
	const respondOK = () => respondToOpener("OK");

	// Invoked when this component is created and used to register with the DialogManager
	React.useEffect(() => {
		// The callback is invoked every time the DialogManagerClient is requested to open
		// this dialog.
		FEAGlobals.FSBL.Clients.DialogManager.registerDialogCallback((err, request) => {
			if (!err) {
				// Show this dialog
				FEAGlobals.FSBL.Clients.DialogManager.showDialog();
			}
		});
	}, []);

	// The dialog markup
	return <div>
		<div>Dialog text goes here</div>
		<button onClick={respondNope}>Nope</button>
		<button onClick={respondMaybe}>Maybe</button>
		<button onClick={respondOK}>OK</button>
	</div>;

};

// Render this component
ReactDOM.render(
	<FinsembleProvider>
		<FinsembleCSS />
		<NonDialogComponent />
	</FinsembleProvider>,
	document.getElementsByTagName("div")[0]
);
