// This line imports type declarations for Finsemble's globals such as FSBL and fdc3. You can ignore the warning that it is defined but never used.
// Important! Please use the global FSBL and fdc3 objects. Do not import functionality from finsemble
import { FDC3, types } from "@finsemble/finsemble-core";


// TODO: Implementation should be sure that this function is modified to process incoming messages
const launchGroupBridge = (window as any);
launchGroupBridge.onLaunchGroupMessage = (payload) => {
	console.log("DEFAULT onLaunchGroupMessage implementation:", payload);
}


/**
 * Gets the name of the channel to listen to for this launched peer group. This might be the launch group id, or
 * perhaps a persisted value in the component state (if this component has been relaunched, for example).
 *
 * @returns the channel to listen to for this launched peer group
 */
const getLaunchedGroupChannelName = async () => {
	// The field name in component storage for the channel name
	const COMPONENT_STATE_FIELD_CHANNEL_NAME = "x-launch-group-channel-name";


	/**
	 * Saves the name of a channel to use for future component invocations.
	 *
	 * @param launchedGroupChannelName the name of the channel to save
	 */
	const saveLaunchedGroupChannelName = (launchedGroupChannelName) => FSBL.Clients.WindowClient.setComponentState({ field: COMPONENT_STATE_FIELD_CHANNEL_NAME, value: launchedGroupChannelName });


	// Get the launchGroupId from the window options
	//
	// The launchGroupId exists when a launch group has been spawned; restoring the workspace will NOT retain the launchGroupId
	// currently, however this code will persist a launch group id suitable for subsequent reloads.
	let launchGroupId = ((await finsembleWindow.getOptions())?.data as any)?.windowInterop?.launchGroupId;


	if (!launchGroupId) {
		// There is no launch group id; either this component was not launched in a group OR this component is being reloaded and the
		// channel name is persisted in the component state
		//
		// Check for the launch group channel name in the component state
		console.info("There is no launch group id, checking component state");
		const { data: componentStateLaunchGroupId } = await FSBL.Clients.WindowClient.getComponentState({ field: COMPONENT_STATE_FIELD_CHANNEL_NAME });
		return componentStateLaunchGroupId;
	} else {
		// TODO: Attach store listeners only once

		// Sync and persist the brokered channel name
		// 1.) Create a unique channel name
		const persistedChannelName = `uiq-${launchGroupId}-${new Date().getTime()}-${Math.random()}`;
		// 2.) Save in component state
		await saveLaunchedGroupChannelName(persistedChannelName);
		// Add a listener to the distributed store; the listener will receive any updated future channel and persist that in the component state
		let { data: store } = await FSBL.Clients.DistributedStoreClient.createGlobalStore({ store: launchGroupId });
		// 3.) Listen for any updates from the store and save the new channel in the component state
		store?.addListener([launchGroupId, 'channelName'], (err, res) => saveLaunchedGroupChannelName(res.value));
		// 4.) Publish the new name to the distributed store
		store?.set([launchGroupId, 'channelName'], persistedChannelName);

		return launchGroupId;
	}
}

const main = async (launchGroupBridge: any) => {
	// The context type for launched peers to communicate on
	const CONTEXT_TYPE_LAUNCH_GROUP = "x-launch-group";


	// TODO: Do not re-attach a listener if the launchGroupBridge is already listening


	// Get the launched group channel name
	const launchedGroupFdc3ChannelName = await getLaunchedGroupChannelName();
	// Check the value
	if (!launchedGroupFdc3ChannelName) {
		console.warn("There is no launch group id, will not attach a listener");
		return;
	}


	// Get the launch group channel
	const launchedGroupFdc3Channel = await fdc3.getOrCreateChannel(launchedGroupFdc3ChannelName);
	//
	// Add a listener
	launchedGroupFdc3Channel.addContextListener(CONTEXT_TYPE_LAUNCH_GROUP, (context: any) => {
		// FDC3 specifies that the "id" attribute may contain string/string mappings; use the "id" to keep in spec
		const messageData = context.id;

		// If there is a payload, then delegate to the launch group message handler
		if (messageData.payload) {
			launchGroupBridge?.onLaunchGroupMessage?.(JSON.parse(messageData.payload));
		}
	});


	/**
	 * Send messages to other components in the launch group. Any component in the launch group
	 * which has "launchGroupBridge.onLaunchGroupMessage" defined will receive this message.
	 *
	 * @param messageData the data to send
	 */
	// Append the "sendMessageToLaunchedGroup" to the launchGroupBridge object
	launchGroupBridge.sendMessageToLaunchedGroup = (messageData) => {
		launchedGroupFdc3Channel.broadcast({
			type: CONTEXT_TYPE_LAUNCH_GROUP,
			id: {
				payload: JSON.stringify(messageData)
			}
		});
	};


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
