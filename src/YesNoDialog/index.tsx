import React from "react";
import ReactDOM from "react-dom";
import { FinsembleCSS, FinsembleProvider, YesNoDialog } from "@finsemble/finsemble-core";


// Render the component
ReactDOM.render(
	<FinsembleProvider>
		<FinsembleCSS />
		{/* // NOTE: Add an HR element */}
		<hr />
		<YesNoDialog />
		{/* // NOTE: Add an HR element */}
		<hr />
	</FinsembleProvider>,
	document.getElementsByTagName("div")[0]
);
