import React from "react";
import ReactDOM from "react-dom";

/**
 * This is an example of a component which is able to communicate with other components launched within the same launch group. Note that this
 * example communicates with any component in the launch group, regardless of which group the component is _currently_ in.
 *
 * To communicate with other components from the launch group:
 *   1.) Install the "launch-group-communicator" preload for any component which needs to communicate with launched peers
 *   2.) Override the "onLaunchGroupMessage" function of the bridge with a custom handler
 *   3.) Invoke "sendMessageToLaunchedGroup(string|Object)" to send messages to launched peers
 */


// This line imports type declarations for Finsemble's globals such as FSBL and fdc3. You can ignore any warnings that it is defined but never used.
// Please use global FSBL and fdc3 objects instead of importing from finsemble-core.
import { types } from "@finsemble/finsemble-core";

// Create a reference to the "launchGroupBridge" (this is for clarity and is optional)
// NOTE: The preload populates the functions for the launch group bridge
// NOTE: Adjust both the preload as well as this code in the event that the bridge resides elsewhere
const launchGroupBridge = (window as any);


/**
 * Launches a component by name.
 *
 * @param componentName the name of the component to launch
 */
const doLaunchComponent = (componentName: string) => {
	FSBL.Clients.AppsClient.spawn(componentName, {});
}


/**
 * Sends a message to the launch group. The message is the text from the
 * text field "message-source".
 */
const doSendMessageToLaunchGroup = () => {
	const textField = (document.getElementById("message-source") as any);

	// This is the API call which sends the message to other components in the launch group
	launchGroupBridge.sendMessageToLaunchedGroup(textField.value);
}

/**
 * Handles incoming messages from a component within this launch group.
 * // NOTE: This is the handler which is overridden in order to handle messages from launched peers
 *
 * @param payload payload from the launch group component
 */
launchGroupBridge.onLaunchGroupMessage = (payload) => {
	const textArea = (document.getElementById("message-display") as any);
	textArea.value = `${textArea.value}\n${payload}`.trim();
}


// Render this component
ReactDOM.render(
	<div>
		<div>{document.title = window.name.split('-')[0]}</div>
		<div><button onClick={() => doLaunchComponent("ChartIQ Example App")} >Launch ChartIQ Example App</button></div>
		<div><button onClick={() => doLaunchComponent("AG-Grid Example Blotter")} >Launch AG-Grid Example Blotter</button></div>
		<div><button onClick={() => doLaunchComponent("App One")} >Launch App One</button></div>
		<div><button onClick={() => doLaunchComponent("App Two")} >Launch App Two</button></div>
		<div>
			<input type="text" id="message-source" />
			<button onClick={doSendMessageToLaunchGroup}>Send to launch group</button>
		</div>
		<div><textarea rows={8} id="message-display"></textarea></div>
	</div>
	, document.getElementsByTagName("div")[0]);
