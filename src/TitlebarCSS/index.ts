// This line imports type declarations for Finsemble's globals such as FSBL and fdc3. You can ignore the warning that it is defined but never used.
// Important! Please use the global FSBL and fdc3 objects. Do not import functionality from finsemble
import { types } from "@finsemble/finsemble-core";

const main = () => {
	console.log("TitlebarCSS", "this is the titlebar preload");

	try {
		let root: any = Array.from(document.styleSheets)
			// Uncomment this IF you want to limit this code to running on the theme.css (not necessary)
			// .filter(styleSheet => !!styleSheet?.href?.includes("assets/css/theme.css"))
			.flatMap(cssStyleSheet => cssStyleSheet.cssRules)
			.flatMap(cssRuleList => Array.from(cssRuleList))
			.filter(cssRule => cssRule["selectorText"] == ":root")[0];

		if (!root) {
			console.log('root was not found from document.styleSheets; deferring to documentElement');
			root = document.documentElement;
		} else {
			console.log('root was found from document.styleSheets');
		}

		console.log("TitlebarCSS", "root", root, root.style, root.style.getPropertyValue("--core-primary"));
		(window as any).root = root;

		setInterval(() => {
			const currentCorePrimary = root.style.getPropertyValue("--core-primary");
			console.log("current currentCorePrimary is", currentCorePrimary)
			if ("red" === currentCorePrimary) {
				console.log("", "setting green");
				Array.from(document.styleSheets).forEach(styleSheet => {
					Array.from(styleSheet.rules).forEach(cssRules => {
						(cssRules as any)?.style?.setProperty("--core-primary", "green");
					});
				});
			} else {
				console.log("", "setting red");
				Array.from(document.styleSheets).forEach(styleSheet => {
					Array.from(styleSheet.rules).forEach(cssRules => {
						(cssRules as any)?.style?.setProperty("--core-primary", "red");
					});
				});
			}
		}, 1000);

	} catch (e) {
		console.error("Could not set the root for style change", e);
	}

};

/**
 * This initialization pattern is required in preloads. Do not call FSBL or fdc3 without waiting for this pattern.
 */
if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", main);
} else {
	window.addEventListener("FSBLReady", main);
}
