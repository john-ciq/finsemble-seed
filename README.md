[![Finsemble SmartDesktop](./public/assets/img/Finsemble+Cosaic.svg)](https://documentation.finsemble.com/)

# Finsemble Seed Custom Dialog Using DialogManager API Example🌱
This example illustrates how to create a custom dialog by adding `DialogManager` API calls into a standard component.

# Introduction
Standard components may act as as dialog using the `DialogManager` API calls. This integration happens in three steps:
1. The component registers as a dialog using `FEAGlobals.FSBL.Clients.DialogManager.registerDialogCallback`
2. The component requests to be displayed as a dialog using `FEAGlobals.FSBL.Clients.DialogManager.showDialog`
3. The component sends results to the opening code using `FEAGlobals.FSBL.Clients.DialogManager.respondToOpener`

# Creating
1. Modify a component app definition to act as a singleton (see `public/configs/application/apps.json`)
2. Update the contents of the standard component with the DialogManager API code example found in `src/NonDialogComponent/index.tsx`

# Running
1. Run the command `yarn dev`
2. From any Finsemble component, run this code:
```
FSBL.Clients.DialogManager.open(
  "NonDialogComponent",
  {
    // Pass some data, which will be passed into the FSBL.Clients.DialogManager.registerDialogCallback
    someData: 12345
  },
  // The callback
  (err, res) => {
    console.log(err, res);
  }
);
```
