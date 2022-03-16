import { Injectable, Optional } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  readonly APIUrl = 'https://localhost:44349/signalrdemo';
  connection: signalR.HubConnection | undefined;
  receiveMessage: ReplaySubject<string> | undefined;

  constructor() {
    this.receiveMessage = new ReplaySubject<string>();
  }

  public initiateSignalrConnection(): Promise<void> {
    console.log("Begin to initialize Signalr");
    return new Promise((resolve, reject) => {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.APIUrl, { transport: signalR.HttpTransportType.WebSockets })
        .configureLogging("warn")
        .build();

      this.SetSignalrClientMethods();
      this.connection.start()
        .then(() => {
          console.log(`SignalR connection success! connectionId: ${this.connection?.connectionId}`);
          resolve();
        })
        .catch((error) => {
          console.log(`Signalr connection error: ${error}`);
          reject();
        });
    });
  }

  private SetSignalrClientMethods(): void {
    this.connection?.on('ReceiveMessage', (data: string) => {
      this.receiveMessage?.next(data);
    });
  }

  public InvokeGenerateData(): Promise<void> | undefined {
    console.log("Begin to invoke server method");
    if (!this.IsSignalRConnected()) {
      return Promise.reject("The signalr connection is disconnected.");
    }
    return this.connection?.invoke('GenerateData');
  }

  private IsSignalRConnected(): boolean {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Disconnected) {
      return false;
    }
    return true;
  }

  public CloseSignalrConnection(): void {
    console.log("Begin to close Signalr");
    if (this.connection) {
      this.connection.stop();
      this.connection = undefined;
    }
    this.receiveMessage = undefined;
  }
}
