import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FinsembleCSS, FinsembleProvider } from "@finsemble/finsemble-core";
import { FEAGlobals } from "@finsemble/finsemble-core/";
import { FinsembleDialog } from "@finsemble/finsemble-core/dist/lib/ui/components/legacyControls/FinsembleDialog";

import Timer from "@finsemble/finsemble-core/dist/lib/ui/components/yesNoDialog/timer";

type ResponseOptions = "affirmative" | "negative" | "cancel" | "expired";

const DEFAULT_TITLE = "Yes or No Dialog";
const DEFAULT_COMPONENT_STATE = {
	question: "",
	negativeResponseLabel: "No",
	affirmativeResponseLabel: "Yes",
	cancelResponseLabel: "Cancel",
	showNegativeButton: true,
	showAffirmativeButton: true,
	showCancelButton: true,
};

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

interface ICustomYesNoDialogProps {
	title?: string;
}

const CustomYesNoDialog = (props: ICustomYesNoDialogProps) => {
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
		// This will detach the timer component from the dom. Next time the component comes up,
		// it'll have a fresh timer.
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
	 * When the opener requests that the dialog show itself, it also passes in initialization data.
	 * This function grabs that data, calls setState, and then fits the window to the contents of
	 * the DOM. Then we call `showDialog`, which will display the dialog on the proper monitor.
	 *
	 * @param {any} err
	 * @param {any} response
	 */
	const onShowRequested = (err, { data }: { data: YesNoDialogParams }) => {
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

	const sendAffirmativeResponse = () => sendResponse("affirmative");
	const sendNegativeResponse = () => sendResponse("negative");
	const sendCancelResponse = () => sendResponse("cancel");
	const sendExpiredResponse = () => sendResponse("expired")

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

ReactDOM.render(
	<FinsembleProvider>
		<FinsembleCSS />
		<CustomYesNoDialog />
	</FinsembleProvider>,
	document.getElementsByTagName("div")[0]
);
