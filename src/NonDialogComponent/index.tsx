import React from "react";
import ReactDOM from "react-dom";
import { FinsembleCSS, FinsembleProvider } from "@finsemble/finsemble-core";


// TODO: Insert any desired props here
export type NonDialogComponentProps = {};

/**
 * Implements a Finsemble dialog using API calls only. This component is a standard component which
 * uses DialogManager API calls in order to integrate and function as a dialog.
 *
 * It is important to note that this component works well when configured as a singleton (see the
 * entry in apps.json for more details).
 *
 * All required DialogManager API calls will be called out with a "NOTE: " comment
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
	const respond = (choice, selections: string[] = []) => {
		// NOTE: This call will resolve the promise created by the opener with the "choice" passed in
		FSBL.Clients.DialogManager.respondToOpener({ choice, selections });
	}

	/**
	 * Responds with a choice of "Nope" to the opener.
	 *
	 * @returns a promise once the response has been sent to the opener
	 */
	const respondNope = () => respond("Nope");

	/**
	 * Responds with a choice of "Maybe" to the opener.
	 *
	 * @returns a promise once the response has been sent to the opener
	 */
	const respondMaybe = () => respond("Maybe");

	/**
	 * Responds with the selected cheeses.
	 *
	 * @returns a promise once the response has been sent to the opener
	 */
	const respondOK = () => {
		const selections: string[] = Array.from(document?.getElementById("cheeses")?.["options"])
			.filter((opt: any) => opt.selected)
			.map((opt: any) => opt.value);

		respond("OK", selections);
	}

	// Invoked when this component is created and used to register with the DialogManager
	React.useEffect(() => {
		// NOTE: Any component acting as a dialog must register this callback exactly one time
		//
		// The callback is invoked every time the DialogManagerClient requests that this dialog
		// be displayed
		FSBL.Clients.DialogManager.registerDialogCallback((err, request) => {
			if (!err) {
				// NOTE: Invoking "showDialog" will inform the DialogManager to display this component
				//       as a dialog (which will be centered on the screen and visually different than
				//       a standard component).
				//
				// NOTE: request.data contains data passed in via the open call.
				//
				// Show this dialog
				FSBL.Clients.DialogManager.showDialog();
			}
		});
	}, []);

	// The dialog markup
	return <div>
		{/* // TODO: Update the dialog text */}
		<label htmlFor="cheeses">Choose your cheese:</label>

		<div>
			<select name="cheeses" id="cheeses" multiple>
				<option value="mozzarella">Mozzarella</option>
				<option value="ricotta">Ricotta</option>
				<option value="parmesan">Parmesan</option>
				<option value="swiss">Swiss</option>
			</select>
		</div>

		<div>
			<button onClick={respondNope}>Nope</button>
			<button onClick={respondMaybe}>Maybe</button>
			<button onClick={respondOK}>OK</button>
		</div>
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
