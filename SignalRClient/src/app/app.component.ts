import { Component } from '@angular/core';
import { SignalRService } from './services/signal-r.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SignalRClient';
  Message: string | undefined;
  constructor(public signalrService: SignalRService) { }
  ngOnInit(): void {
    this.signalrService.receiveMessage?.subscribe((data: string) => {
      console.log(data);
      this.Message += data;
    });
  }

  InitializeConnection(): void {
    this.signalrService.initiateSignalrConnection().then(() => {
      this.Message = "Initialzie SignalR succeed.";
    })
      .catch((error) => {
        this.Message = `Signalr connection error: ${error}`;
      });
  }

  ReceiveMessage(): void {
    this.signalrService.InvokeGenerateData()?.then(() => {
      console.log("Invoke AutoDiscovery complete!!!");
    })
      .catch((error) => {
        console.log(`Invoke AutoDiscovery failed!!!! ${error}`);
      });
  }

  StopConnection(): void {
    this.signalrService.CloseSignalrConnection();
  }
}
