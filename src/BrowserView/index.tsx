import React from "react";
// This line imports type declarations for Finsemble's globals such as FSBL and fdc3. You can ignore any warnings that it is defined but never used.
// Please use global FSBL and fdc3 objects instead of importing from finsemble-core.
import { types } from "@finsemble/finsemble-core";

import { runScriptInElectron } from "@finsemble/finsemble-electron-adapter/exports";

import "../../public/assets/css/theme.css";

const main = () => {
	console.log("this is the browserview app");
};

main();
