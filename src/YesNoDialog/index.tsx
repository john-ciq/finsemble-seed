import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FinsembleCSS, FinsembleProvider } from "@finsemble/finsemble-core";
import { FEAGlobals } from "@finsemble/finsemble-core/";
import { FinsembleDialog } from "@finsemble/finsemble-core/dist/lib/ui/components/legacyControls/FinsembleDialog";

// The timer component for dialogs with expiration
import Timer from "@finsemble/finsemble-core/dist/lib/ui/components/yesNoDialog/timer";

// Response options for the dialog to return to the opening code
type ResponseOptions = "affirmative" | "negative" | "cancel" | "expired";

// The default title
const DEFAULT_TITLE = "Yes or No Dialog";

// The default component state
const DEFAULT_COMPONENT_STATE = {
	question: "",
	negativeResponseLabel: "No",
	affirmativeResponseLabel: "Yes",
	cancelResponseLabel: "Cancel",
	showNegativeButton: true,
	showAffirmativeButton: true,
	showCancelButton: true,
};

// Params sent in by the opener
interface YesNoDialogParams {
	title?: string;
	question?: string;
	negativeResponseLabel?: string;
	affirmativeResponseLabel?: string;
	cancelResponseLabel?: string;
	showNegativeButton?: boolean;
	showAffirmativeButton?: boolean;
	showCancelButton?: boolean;
	hideModalOnClose?: boolean;
	showTimer?: boolean;
	timerDuration?: number | null;
}

// React props
interface ICustomYesNoDialogProps {
	title?: string;
}

/**
 * A custom Yes/No dialog.
 *
 * @param props props for this React component
 * @returns a rendered component
 */
const CustomYesNoDialog = (props: ICustomYesNoDialogProps) => {
	// State information
	const [newRequest, setNewRequest] = useState(false);
	const [title, setTitle] = useState<string>(DEFAULT_TITLE);
	const [question, setQuestion] = useState<string>(DEFAULT_COMPONENT_STATE.question);
	const [negativeResponseLabel, setNegativeResponseLabel] = useState<string>(
		DEFAULT_COMPONENT_STATE.negativeResponseLabel
	);
	const [affirmativeResponseLabel, setAffirmativeResponseLabel] = useState<string>(
		DEFAULT_COMPONENT_STATE.affirmativeResponseLabel
	);
	const [cancelResponseLabel, setCancelResponseLabel] = useState<string>(DEFAULT_COMPONENT_STATE.cancelResponseLabel);
	const [showNegativeButton, setShowNegativeButton] = useState<boolean>(DEFAULT_COMPONENT_STATE.showNegativeButton);
	const [showAffirmativeButton, setShowAffirmativeButton] = useState<boolean>(
		DEFAULT_COMPONENT_STATE.showAffirmativeButton
	);
	const [showCancelButton, setShowCancelButton] = useState<boolean>(DEFAULT_COMPONENT_STATE.showCancelButton);
	const [hideModalOnClose, setHideModalOnClose] = useState<boolean>(false);
	const [showTimer, setShowTimer] = useState<boolean>(false);
	const [timerDuration, setTimerDuration] = useState<number | null>(null);

	/**
	 * Sends user input to the opener.
	 *
	 * @param {ResponseOptions} choice
	 */
	const sendResponse = (choice: ResponseOptions) => {
		FEAGlobals.FSBL.Clients.DialogManager.respondToOpener({
			choice,
			hideModalOnClose,
		});
		// Detach the timer component from the DOM; this causes a new timer for the next time this
		// dialog is requested
		setShowTimer(false);
		setNewRequest(false);
	};

	/**
	 * Handles escape and enter.
	 *
	 * @param {any} e
	 */
	const handleKeydownOnBody = (e: KeyboardEvent) => {
		if (e.code === "Enter" && e.shiftKey === false) {
			sendResponse("affirmative");
		} else if (e.code === "Escape") {
			sendResponse("cancel");
		}
	};

	/**
	 * Invoked when this dialog has been requested. The "data" is sent in from the opener.
	 *
	 * @param {any} err
	 * @param {any} response
	 */
	const onShowRequested = (err, { data }: { data: YesNoDialogParams }) => {
		// Set state from the passed in data
		setTitle(data.title ?? DEFAULT_TITLE);
		setHideModalOnClose(data.hideModalOnClose ?? true);
		setQuestion(data.question ?? DEFAULT_COMPONENT_STATE.question);
		setNegativeResponseLabel(data.negativeResponseLabel || "No");
		setAffirmativeResponseLabel(data.affirmativeResponseLabel || "Yes");
		setCancelResponseLabel(data.cancelResponseLabel || "Cancel");
		setShowNegativeButton(data.showNegativeButton ?? true);
		setShowAffirmativeButton(data.showAffirmativeButton ?? true);
		setShowCancelButton(data.showCancelButton ?? true);
		setShowTimer(data.showTimer ?? false);
		setTimerDuration(data.timerDuration ?? null);
		setNewRequest(true);
	};

	/**
	 * Fits the contents of the DOM to the window, then calls `showDialog`, which positions the
	 * dialog on the proper monitor and toggles the visibility of the window.
	 */
	const fitAndShow = () => {
		FEAGlobals.FSBL.Clients.WindowClient.fitToDOM(null, () => {
			FEAGlobals.FSBL.Clients.DialogManager.showDialog();
		});
	};

	// Helper functions for sending the response to the opener
	const sendAffirmativeResponse = () => sendResponse("affirmative");
	const sendNegativeResponse = () => sendResponse("negative");
	const sendCancelResponse = () => sendResponse("cancel");
	const sendExpiredResponse = () => sendResponse("expired")

	// Add the keydown listener (to handle Escape/Enter behavior)
	useEffect(() => {
		document.body.addEventListener("keydown", handleKeydownOnBody);
	}, []);

	useEffect(() => {
		fitAndShow();
	}, [
		title,
		question,
		negativeResponseLabel,
		cancelResponseLabel,
		affirmativeResponseLabel,
		showNegativeButton,
		showAffirmativeButton,
		showCancelButton,
		newRequest,
	]);

	// The component representation
	return (
		<FinsembleDialog
			userInputTimeout={10000}
			behaviorOnResponse="hide"
			onShowRequested={onShowRequested}
			isModal={true}
		>
			<div>{props.title ?? title}</div>
			<hr />
			<div>{question}</div>
			<div>{showTimer && typeof timerDuration === "number" && (
				<Timer ontimerDurationExpiration={sendExpiredResponse} timerDuration={timerDuration} />
			)}</div>
			<hr />
			<div>
				<button hidden={!showNegativeButton} onClick={sendNegativeResponse}>
					{negativeResponseLabel}
				</button>

				<button hidden={!showCancelButton} onClick={sendCancelResponse}>
					{cancelResponseLabel}
				</button>

				<button hidden={!showAffirmativeButton} onClick={sendAffirmativeResponse}>
					{affirmativeResponseLabel}
				</button>
			</div>
		</FinsembleDialog>
	);
};

// Render the component
ReactDOM.render(
	<FinsembleProvider>
		<FinsembleCSS />
		<CustomYesNoDialog />
	</FinsembleProvider>,
	document.getElementsByTagName("div")[0]
);
