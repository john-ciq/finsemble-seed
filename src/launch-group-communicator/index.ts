// This line imports type declarations for Finsemble's globals such as FSBL and fdc3. You can ignore the warning that it is defined but never used.
// Important! Please use the global FSBL and fdc3 objects. Do not import functionality from finsemble
import { FDC3, types } from "@finsemble/finsemble-core";


// The context type for launched peers to communicate on
const CONTEXT_TYPE_LAUNCH_GROUP = "x-launch-group";
// The field name in component storage for the channel name
const COMPONENT_STATE_FIELD_CHANNEL_NAME = "x-launch-group-channel-name";


// TODO: Implementation should be sure that this function is modified to process incoming messages
const launchGroupBridge = (window as any);
launchGroupBridge.onLaunchGroupMessage = (payload) => {
	console.log("DEFAULT onLaunchGroupMessage implementation:", payload);
}

// Flag to determine if the launch group being used is from component storage
let usingStoredLaunchGroup = false;

/**
 * Saves the name of a channel to use for future component invocations.
 *
 * @param launchedGroupChannelName the name of the channel to save
 */
const saveLaunchedGroupChannelName = async (launchedGroupChannelName) => {
	if (!!usingStoredLaunchGroup) {
		// console.log("not persisting new channel name; using current persisted channel name");
	} else {
		// console.log('saving component state', COMPONENT_STATE_FIELD_CHANNEL_NAME, launchedGroupChannelName);
		// console.log('persisting channel name for future use', launchedGroupChannelName);
		await FSBL.Clients.WindowClient.setComponentState({ field: COMPONENT_STATE_FIELD_CHANNEL_NAME, value: launchedGroupChannelName });
	}
}

/**
 * Creates a unique channel name, seeded from the supplied channel name.
 *
 * @param launchedGroupChannelName the name of the channel
 * @returns a unique variation of the channel
 */
const createUniqueLaunchedGroupChannelName = (launchedGroupChannelName) => {
	return `uiq-${launchedGroupChannelName}-${new Date().getTime()}-${Math.random()}`;
}

/**
 * Gets the name of the channel to listen to for this launched peer group. This might be the launch group id, or
 * perhaps a persisted value in the component state (if this component has been relaunched, for example).
 *
 * @returns the channel to listen to for this launched peer group
 */
const getLaunchedGroupChannelName = async () => {
	let launchGroupId = ((await finsembleWindow.getOptions())?.data as any)?.windowInterop?.launchGroupId;

	if (!launchGroupId) {
		// Get the launch group channel name from component state
		// console.log("There is no launch group id, checking component state");
		let { data: componentStateLaunchGroupId } = await FSBL.Clients.WindowClient.getComponentState({ field: COMPONENT_STATE_FIELD_CHANNEL_NAME });
		if (!componentStateLaunchGroupId) {
			// console.log("There is no persisted launch group id, will not attach a listener");
			return null;
		} else {
			usingStoredLaunchGroup = true;
			launchGroupId = componentStateLaunchGroupId;
		}
	}

	// Return the channel name
	return `${launchGroupId}`;
}

const main = async (launchGroupBridge: any) => {

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


	// TODO: Do not re-attach a listener if the launchGroupBridge is already listening


	// Get the launched group channel name
	const launchedGroupFdc3ChannelName = await getLaunchedGroupChannelName();
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
			// console.log('got payload', messageData.payload);
			launchGroupBridge?.onLaunchGroupMessage?.(JSON.parse(messageData.payload));
		}
	});
	// console.log('listening to', launchedGroupFdc3Channel.id);

	// Synch and persist the brokered channel name
	if (!usingStoredLaunchGroup) {
		// 1.) Create a unique channel name
		const persistedChannelName = createUniqueLaunchedGroupChannelName(launchedGroupFdc3ChannelName);
		// 2.) Save in component state
		await saveLaunchedGroupChannelName(persistedChannelName);
		// Add a listener to the distributed store; the listener will receive any updated future channel and persist that in the component state
		let { data: store } = await FSBL.Clients.DistributedStoreClient.createGlobalStore({ store: launchedGroupFdc3ChannelName });
		// 3.) Listen on signal for any updates <-- This is done in the addition of the context listener (but timing issues abound)
		store?.addListener([launchedGroupFdc3ChannelName, 'channelName'], (err, res) => saveLaunchedGroupChannelName(res.value));
		//
		// 4.) Publish the new name to the distributed store
		store?.set([launchedGroupFdc3ChannelName, 'channelName'], persistedChannelName);
	}


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
