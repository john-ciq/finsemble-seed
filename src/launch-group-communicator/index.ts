// This line imports type declarations for Finsemble's globals such as FSBL and fdc3. You can ignore the warning that it is defined but never used.
// Important! Please use the global FSBL and fdc3 objects. Do not import functionality from finsemble
import { FDC3, types } from "@finsemble/finsemble-core";


const CONTEXT_TYPE_LAUNCH_GROUP = "x-launch-group";
// TODO: [JRG] Code for persisting channel name
// const COMPONENT_STATE_FIELD_CHANNEL_NAME = "x-launch-group-channel-name";


// TODO: Implementation should be sure that this function is modified to process incoming messages
const launchGroupBridge = (window as any);
launchGroupBridge.onLaunchGroupMessage = (payload) => {
	console.log("DEFAULT onLaunchGroupMessage implementation:", payload);
}

// TODO: [JRG] Code for persisting channel name
// let usingStoredLaunchGroup = false;
// const saveLaunchedGroupChannelName = async (launchedGroupChannelName) => {
// 	if (!!usingStoredLaunchGroup) {
// 		console.log("not persisting new channel name; using current persisted channel name");
// 	} else {
// 		console.log('saving component state', COMPONENT_STATE_FIELD_CHANNEL_NAME, launchedGroupChannelName);
// 		await FSBL.Clients.WindowClient.setComponentState({ field: COMPONENT_STATE_FIELD_CHANNEL_NAME, value: launchedGroupChannelName });
// 	}
// }
//
// const createUniqueLaunchedGroupChannelName = (launchedGroupChannelName) => {
// 	return `uiq-${launchedGroupChannelName}-${new Date().getTime()}-${Math.random()}`;
// }

const getLaunchedGroupChannelName = async () => {
	let launchGroupId = ((await finsembleWindow.getOptions())?.data as any)?.windowInterop?.launchGroupId;

	if (!launchGroupId) {
		// TODO: [JRG] Code for persisting channel name
		// // Get the launch group channel name from component state
		// console.log("there is no launch group id, checking component state");
		// let { data: componentStateLaunchGroupId } = await FSBL.Clients.WindowClient.getComponentState({ field: COMPONENT_STATE_FIELD_CHANNEL_NAME });
		// if (!componentStateLaunchGroupId) {
		// 	console.log("there is no persisted launch group id, will not attach a listener");
		// 	return null;
		// } else {
		// 	usingStoredLaunchGroup = true;
		// 	launchGroupId = componentStateLaunchGroupId;
		// }

		return null; // TODO: Remove this line when uncommenting above^
	}

	// Return the channel name
	return `fdc3channel-${launchGroupId}`;
}

const main = async (launchGroupBridge: any) => {

	// TODO: [JRG] Code for persisting channel name
	// /**
	//  * Send signal data to other components in the launch group. Signal data is used within this code
	//  * in order to communicate/broker between components, often for setup or configuration.
	//  *
	//  * @param signalData the signal data to send to other components in the launch group
	//  */
	// const sendSignalToLaunchedGroup = (signalData) => {
	// 	launchedGroupFdc3Channel.broadcast({
	// 		type: CONTEXT_TYPE_LAUNCH_GROUP,
	// 		id: {
	// 			signal: JSON.stringify(signalData)
	// 		}
	// 	});
	// }

	/**
	 * Send messages to other components in the launch group. Any component in the launch group
	 * which has "launchGroupBridge.onLaunchGroupMessage" defined will receive this message.
	 *
	 * @param messageData the data to send
	 */
	const sendMessageToLaunchedGroup = (messageData) => {
		launchedGroupFdc3Channel.broadcast({
			type: CONTEXT_TYPE_LAUNCH_GROUP,
			id: {
				payload: JSON.stringify(messageData)
			}
		});
	}

	// TODO: [JRG] Code for persisting channel name
	// // Do not re-attach a listener if the launchGroupBridge is already listening
	// if (!!launchGroupBridge.isListening) {
	// 	console.log(`already listening to channel "${launchGroupBridge.launchedGroupFdc3ChannelName}"`);
	// 	return;
	// }


	// Get the launched group channel name
	const launchedGroupFdc3ChannelName = await getLaunchedGroupChannelName();
	if (!launchedGroupFdc3ChannelName) {
		console.log("there is no launch group id, will not attach a listener");
		return;
	}


	// Join the launch group channel
	const launchedGroupFdc3Channel = await fdc3.getOrCreateChannel(launchedGroupFdc3ChannelName);
	// TODO: [JRG] Code for persisting channel name
	// // Designate the launch group channel name
	// launchGroupBridge.channelName = launchedGroupFdc3ChannelName;


	launchedGroupFdc3Channel.addContextListener(CONTEXT_TYPE_LAUNCH_GROUP, (context: any) => {
		// FDC3 specifies that the "id" attribute may contain string/string mappings; use the "id" to keep in spec
		const messageData = context.id;

		// See if this FDC3 message has a signal (coordinating message for components in the launch group)
		if (messageData.signal) {
			const parsedSignal = JSON.parse(messageData.signal);

			// TODO: [JRG] Code for persisting channel name
			// // If the signal is a persisted channel name
			// if (!!parsedSignal?.persistedChannelName) {
			// 	// Then save that for the next incarnation of this particular component
			// 	saveLaunchedGroupChannelName(parsedSignal.persistedChannelName);
			// }
		}

		// If there is a payload, then delegate to the launch group message handler
		if (messageData.payload) {
			console.log('got payload', messageData.payload);
			launchGroupBridge?.onLaunchGroupMessage?.(JSON.parse(messageData.payload));
		}
	});
	// Designate that this component is listening
	// TODO: [JRG] Code for persisting channel name
	// launchGroupBridge.isListening = true;
	console.log(`listening on channel "${launchedGroupFdc3ChannelName}"`);

	// TODO: [JRG] Code for persisting channel name
	// // 1.) Create a unique channel name
	// const persistedChannelName = createUniqueLaunchedGroupChannelName(launchedGroupFdc3ChannelName);
	// // 2.) Save in component state
	// await saveLaunchedGroupChannelName(persistedChannelName);
	// // 3.) Broadcast on signal
	// sendSignalToLaunchedGroup({ persistedChannelName });
	// // 4.) Listen on signal for any updates <-- This is done in the addition of the context listener (but timing issues abound)


	// Append the "sendMessageToLaunchedGroup" to the launchGroupBridge object
	launchGroupBridge.sendMessageToLaunchedGroup = sendMessageToLaunchedGroup;

	// Print a warning if the component does not define "launchGroupBridge.onLaunchGroupMessage"
	if ("function" !== typeof launchGroupBridge.onLaunchGroupMessage) {
		console.log(`This window should implement "onLaunchGroupMessage" in order to receive messages from the launched group.`);
	}

};


/**
 * This initialization pattern is required in preloads. Do not call FSBL or fdc3 without waiting for this pattern.
 */
if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", () => main(window));
} else {
	window.addEventListener("FSBLReady", () => main(window));
}
