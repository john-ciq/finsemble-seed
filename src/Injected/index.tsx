import "../../public/assets/css/theme.css";

import React from "react";
// This line imports type declarations for Finsemble's globals such as FSBL and fdc3. You can ignore any warnings that it is defined but never used.
// Please use global FSBL and fdc3 objects instead of importing from finsemble-core.
import { types } from "@finsemble/finsemble-core";




const main = () => {
	console.log("this is the injected app");
};

main();
