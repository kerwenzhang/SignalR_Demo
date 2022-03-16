namespace SignalRServer.Services
{
    public interface ISignalRHub
    {
        Task ReceiveMessage(string data);
    }
}
