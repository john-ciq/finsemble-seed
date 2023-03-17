using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Finsemble.Core;
using Newtonsoft.Json.Linq;

namespace HFXSim
{
    static class Program
    {

        private static readonly String CHANNEL = "hfx-release";
        private static readonly String DEFAULT_APPNAME = "Releaser";
        private static readonly String KEY_SPAWNDATA_APPNAME = "targetApp";

        private static Finsemble.Core.Finsemble FSBL;
        private static readonly AutoResetEvent autoEvent = new AutoResetEvent(false);

        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main(String[] args)
        {
            FSBL = new Finsemble.Core.Finsemble(args, null);
            FSBL.Connected += FSBL_Connected;
            FSBL.Disconnected += FSBL_Disconnected;

            FSBL.Connect(FSBL.AppId);

            autoEvent.WaitOne();
        }

        private static void ShowForm()
        {
            Application.SetHighDpiMode(HighDpiMode.SystemAware);
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new Form1());
        }

        private static void FSBL_Disconnected(object sender, EventArgs e) {
            autoEvent.Set();
        }

        private async static void FSBL_Connected(object sender, EventArgs e) {
            // Get the spawn data
            JToken spawnData = await FSBL.Clients.WindowClient.GetSpawnData();
            FSBL.Clients.Logger.Log(new Newtonsoft.Json.Linq.JToken[] { "HFXSim: spawndata: " + spawnData.ToString() });

            // Get the app name to launch from spawn data
            String appName = spawnData.Value<String>(KEY_SPAWNDATA_APPNAME);
            if (null == appName)
            {
                appName = DEFAULT_APPNAME;
            }

            // Spawn the app
            FSBL.Clients.Logger.Log(new Newtonsoft.Json.Linq.JToken[] { "HFXSim: spawning: " + appName });
            FSBL.Clients.LauncherClient.Spawn(appName, new Newtonsoft.Json.Linq.JObject(), (sender, e) => {
                FSBL.Clients.Logger.Log(new Newtonsoft.Json.Linq.JToken[] { "HFXSim: spawned: " + appName });
            });


            // TODO: Uncomment this in order to release the Pauser from this app
            // JToken message = JToken.Parse("{date: " + System.DateTime.Now.Ticks + "}");
            // FSBL.Clients.Logger.Log(new Newtonsoft.Json.Linq.JToken[] { "HFXSim: transmitted: " + message.ToString()});
            // FSBL.Clients.RouterClient.Transmit(CHANNEL, message);


            // TODO: Uncomment to show the form (visual form confirms that the above code ran without error) or to keep the EXE running
            // ShowForm();
        }


    }
}
