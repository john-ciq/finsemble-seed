using System;
using System.Diagnostics;
using System.Threading;
using ChartIQ.Finsemble;
using Newtonsoft.Json.Linq;

namespace HFXSim
{
	class Program
	{

		private static readonly String CHANNEL = "hfx-release";
		private static readonly String DEFAULT_APPNAME = "Releaser";
		private static readonly String KEY_SPAWNDATA_APPNAME = "targetApp";

		private static Finsemble FSBL;
		private static readonly AutoResetEvent autoEvent = new AutoResetEvent(false);

		/// <summary>
		///  The main entry point for the application.
		/// </summary>
		static void Main(String[] args)
		{
			// TODO: Uncomment this to connect a debugger when this program starts
			// Debugger.Launch();

			FSBL = new Finsemble(args, null);
			FSBL.Connected += FSBL_Connected;
			FSBL.Disconnected += FSBL_Disconnected;

			FSBL.Connect(FSBL.appId);
			// TODO: Use the next line instead of the above line when running against Finsemble DLL 6
			// FSBL.Connect(FSBL.appName);

			autoEvent.WaitOne();
		}
		private static void FSBL_Disconnected(object sender, EventArgs e)
		{
			autoEvent.Set();
		}

		private async static void FSBL_Connected(object sender, EventArgs e)
		{

			// Get the spawn data
			JToken spawnData = await FSBL.WindowClient.GetSpawnData();
			// TODO: Use the next line instead of the above line when running against Finsemble DLL 6
			// JToken spawnData = FSBL.WindowClient.GetSpawnData();
			FSBL.Logger.Log(new Newtonsoft.Json.Linq.JToken[] { "HFXSim: spawndata: " + spawnData.ToString() });

			// Get the app name to launch from spawn data
			String appName = spawnData.Value<String>(KEY_SPAWNDATA_APPNAME);
			if (null == appName)
			{
				appName = DEFAULT_APPNAME;
			}

			// Spawn the app
			FSBL.Logger.Log(new Newtonsoft.Json.Linq.JToken[] { "HFXSim: spawning: " + appName });
			FSBL.LauncherClient.Spawn(appName, new Newtonsoft.Json.Linq.JObject(), (sender2, e2) =>
			{
				FSBL.Logger.Log(new Newtonsoft.Json.Linq.JToken[] { "HFXSim: spawned: " + appName });
			});


			// TODO: Uncomment this in order to release the Pauser from this app
			// JToken message = JToken.Parse("{date: " + System.DateTime.Now.Ticks + "}");
			// FSBL.Logger.Log(new Newtonsoft.Json.Linq.JToken[] { "HFXSim: transmitted: " + message.ToString()});
			// FSBL.RouterClient.Transmit(CHANNEL, message);
		}

	}
}
