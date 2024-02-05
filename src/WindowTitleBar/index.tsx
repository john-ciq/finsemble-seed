/*!
 * Copyright 2017 - 2020 by ChartIQ, Inc.
 * All rights reserved.
 */
import React from "react";
import ReactDOM from "react-dom";
import {
	FinsembleProvider,
	AlwaysOnTopButton,
	GroupingButton,
	LinkerButton,
	ShareButton,
	TabRegion,
	CloseButton,
	MaximizeButton,
	MinimizeButton,
	WindowTitleBarShell,
	getOrCreateWindowTitleBarContainer,
} from "@finsemble/finsemble-core";

/**
 * This is the Window Title Bar component, which is rendered at
 * the top of every HTML window.
 *
 * You can customize this template by adding or removing
 * elements and styling as you see fit.
 *
 * The visibility of each of the controls can be controlled by
 * config. For example, setting the
 * "foreign.components.Window Manager.showLinker" property
 * to false will hide the <LinkerButton/>.
 *
 * Other buttons are dynamic, such as <GroupingButton> which will only
 * appear when windows are docked or can be docked.
 */
const WindowTitleBar = () => (
	<WindowTitleBarShell>
		<div className="fsbl-header-left">
			<LinkerButton />
			{/* Note: The ShareButton component relies on deprecated APIs that
				will be removed in a future release. */}
			<ShareButton />
		</div>
		<div className="fsbl-header-center">
			{/* If tabbing is disabled, <TabRegion/> will
				only display the title */}
			<TabRegion />
		</div>
		<div className="fsbl-header-right">
			<GroupingButton />
			<AlwaysOnTopButton />
			<MinimizeButton />
			<MaximizeButton />
			<CloseButton />
		</div>
	</WindowTitleBarShell>
);

/**
		* When the titlebar is injected into an app, it is critical for its rendering to be delayed until the app
		* itself has finished rendering its own DOM, otherwise the titlebar will miss the opportunity to
		* reposition the app's DOM to make room for the header.
		*/
window.addEventListener("DOMContentLoaded", async () => {
	if (FSBL.System.isTitlebarWindow()) {
		// Manually bring in the "all" preloads

		// Get the manifest
		let { data } = await FSBL.Clients.ConfigClient.getManifest();
		// Find the global preloads
		Object.values(data?.finsemble.extensions.preloads)
			// Filter out any global preload set to "none" for auto load
			.filter((definition: any) => "none" !== definition.autoload)
			// Get the URL's
			.map((definition: any) => definition.url)
			// Load in each URL
			.forEach(url => {
				console.log("titlebar is downloading preload", url);
				let scriptElement = document.createElement("script");
				scriptElement.src = url;
				document.body.appendChild(scriptElement);
			});
	}

	ReactDOM.render(
		<FinsembleProvider floatingFocus={false}>
			<WindowTitleBar />
		</FinsembleProvider>,
		getOrCreateWindowTitleBarContainer()
	);
});
