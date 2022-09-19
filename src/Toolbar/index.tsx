/*!
 * Copyright 2017 by ChartIQ, Inc.
 * All rights reserved.
 */

import React from "react";
import ReactDOM from "react-dom";
import {
	FinsembleProvider,
	FinsembleCSS,
	ToolbarIcon,
	Menu,
	Preferences,
	SystemLog,
	CentralLogger,
	Documentation,
	Restart,
	Reset,
	Quit,
	ToolbarShell,
	FavoritesShell,
	DragHandle,
	RevealAll,
	MinimizeAll,
	NotificationControl,
	AutoArrange,
	Search,
	Dashbar,
	AdvancedAppLauncherMenu,
	AppLauncherMenu,
	WorkspaceManagementMenu,
	ToolbarSection,
} from "@finsemble/finsemble-core";

// In the below Menu's image/icon, Date.now is added as a query string on the icon url to ensure the page is not cached
export const FileMenu = () => (
	<Menu
		id="fileMenu"
		title={<ToolbarIcon className="finsemble-toolbar-brand-logo" src={`../../assets/img/Finsemble_Toolbar_Icon.png`} />}
	>
		<Preferences />
		<CentralLogger />
		<div>This space for rent</div>
		<Documentation />
		<Restart />
		<Quit />
		{/* To add your own items to the menu, import MenuItem from
		 * "@finsemble/finsemble-ui/react/components" and add the following:
		 * <MenuItem onClick={...}>Your Item</MenuItem>
		 */}
	</Menu>
);

/**
 * Note: Set `FSBL.debug = true` if you need to reload the toolbar during development.
 * By default, it prevents the system from closing it so that users aren't lost without
 * a main window into finsemble functionality.
 */
const Toolbar = () => (
	<ToolbarShell
		hotkeyShow={["ctrl", "alt", "t"]}
		hotkeyHide={["ctrl", "alt", "h"]}
		hotkeyMinimizeAll={["ctrl", "alt", "down"]}
		hotkeyBringWindowsToFront={["ctrl", "alt", "up"]}
		hotkeyRestartApplication={["ctrl", "alt", "shift", "r"]}
	>
		<ToolbarSection className="left">
			<DragHandle />
			<FileMenu />
			<Search openHotkey={["ctrl", "alt", "f"]} />
			<WorkspaceManagementMenu />
			{/* Uncomment the following to enable the AdvancedAppLauncherMenu*/}
			{/* <AdvancedAppLauncherMenu /> */}
			<AppLauncherMenu />
		</ToolbarSection>
		<ToolbarSection className="center" hideBelowWidth={115}>
			<div className="divider" />
			<FavoritesShell />
		</ToolbarSection>
		<ToolbarSection className="right">
			<div className="divider"></div>
			<AutoArrange />
			<MinimizeAll />
			<RevealAll />
			<NotificationControl />
		</ToolbarSection>
		<div className="resize-area"></div>
	</ToolbarShell>
);

ReactDOM.render(
	<FinsembleProvider>
		<FinsembleCSS />
		<Toolbar />
		<Dashbar />
	</FinsembleProvider>,
	document.getElementsByTagName("div")[0]
);
