const Finsemble = require("@finsemble/finsemble-core");
// Log prefix (for easy filtering)
const LOG_PREFIX = "sample-service:service";

Finsemble.Clients.Logger.start();
Finsemble.Clients.Logger.log("Sample Service starting up");

// Add and initialize any other clients you need to use (services are initialized by the system, clients are not):
// Finsemble.Clients.AuthenticationClient.initialize();
// Finsemble.Clients.ConfigClient.initialize();
// Finsemble.Clients.DialogManager.initialize();
// Finsemble.Clients.DistributedStoreClient.initialize();
// Finsemble.Clients.DragAndDropClient.initialize();
// Finsemble.Clients.LauncherClient.initialize();
// Finsemble.Clients.LinkerClient.initialize();
// Finsemble.Clients.HotkeyClient.initialize();
// Finsemble.Clients.SearchClient.initialize();
// Finsemble.Clients.StorageClient.initialize();
// Finsemble.Clients.WindowClient.initialize();
// Finsemble.Clients.WorkspaceClient.initialize();

/**
 * Add service description here
 */
class SampleService extends Finsemble.baseService {

	/**
	 * Initializes a new instance of the SampleService class.
	 */
	constructor() {
		super({
			// Declare any client dependencies that must be available before your service starts up.
			startupDependencies: {
				// When ever you use a client API with in the service, it should be listed as a client startup
				// dependency. Any clients listed as a dependency must be initialized at the top of this file for your
				// service to startup.
				clients: [
					// "authenticationClient",
					// "configClient",
					// "dialogManager",
					// "distributedStoreClient",
					// "dragAndDropClient",
					// "hotkeyClient",
					// "launcherClient",
					// "linkerClient",
					// "searchClient
					// "storageClient",
					// "windowClient",
					// "workspaceClient",
				],
			},
		});

		this.readyHandler = this.readyHandler.bind(this);

		this.onBaseServiceReady(this.readyHandler);
	}

	/**
	 * Fired when the service is ready for initialization
	 * @param {function} callback
	 */
	readyHandler(callback) {
		this.createRouterEndpoints();
		Finsemble.Clients.Logger.log(LOG_PREFIX, "Sample Service ready");
		// BEGIN[https://chartiq.freshdesk.com/a/tickets/14514]
		setInterval(() => {
			const payload = {
				value1: 'Test val string',
				value2: 123,
				value3: true,
				value4: new Date(),
				// Cannot send a function!
				// value5: () => {  return 'Function return value' }
			};

			try {
				Finsemble.Clients.Logger.info(LOG_PREFIX, "transmit.ready", payload);
				Finsemble.Clients.RouterClient.transmit("sample-service", payload);
				Finsemble.Clients.Logger.info(LOG_PREFIX, "transmit.complete", payload);
			} catch (error) {
				Finsemble.Clients.Logger.error(LOG_PREFIX, "ERROR:transmit", error);
			}
		}, 5000);
		// END[https://chartiq.freshdesk.com/a/tickets/14514]

		callback();
	}

	// Implement service functionality
	myFunction(data) {
		return `Data passed into query: \n${JSON.stringify(data, null, "\t")}`;
	}

	/**
	 * Creates a router endpoint for you service.
	 * Add query responders, listeners or pub/sub topic as appropriate.
	 */
	createRouterEndpoints() {
		// Add responder for myFunction
		Finsemble.Clients.RouterClient.addResponder("Sample.myFunction", (err, message) => {
			if (err) {
				return Finsemble.Clients.Logger.error("Failed to setup Sample.myFunction responder", err);
			}

			Finsemble.Clients.Logger.log(`Sample Query: ${JSON.stringify(message)}`);

			try {
				// Data in query message can be passed as parameters to a method in the service.
				const data = this.myFunction(message.data);

				// Send query response to the function call, with optional data, back to the caller.
				message.sendQueryResponse(null, data);
			} catch (e) {
				// If there is an error, send it back to the caller
				message.sendQueryResponse(e);
			}
		});
	}
}

const serviceInstance = new SampleService();

serviceInstance.start();
