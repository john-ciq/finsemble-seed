## To run

1. Install deps
```bash
yarn install
```
2. Build the native app using Visual Studio
3. Update `apps.json` to reflect the binary path for `HFXSim.exe`
4. Clean and build Finsemble
```bash
yarn clean && yarn dev
```
5. Run this command
```bash
killall HFXSim && killall node && killall electron && mkdir -p public/build/components && cp -r src/components/* public/build/components/ && yarn start
```
