using Microsoft.AspNetCore.Http.Connections.Features;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Diagnostics;
using System.Threading;

namespace SignalRServer.Services
{
    public class SignalRHub:Hub<ISignalRHub>
    {
        public void GenerateData()
        {
            var transportType = Context.Features.Get<IHttpTransportFeature>().TransportType;
            Console.WriteLine(transportType);
            var stopwatch = new Stopwatch();
            stopwatch.Start();

            Clients.Caller.ReceiveMessage("Start to receive data from SignalR Server.");
            int progressPercentage = 0;
            var random = new Random();
            for (int i = 10; i > 0; i--)
            {
                int waitTimeMilliseconds = random.Next(100, 2500);
                Thread.Sleep(waitTimeMilliseconds);
                progressPercentage = progressPercentage + 10;
                Clients.Caller.ReceiveMessage(progressPercentage.ToString());
            }
            stopwatch.Stop();
            Clients.Caller.ReceiveMessage("End to receive data from SignalR Server.");
        }
    }
}
