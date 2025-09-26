// Real-time service for Taubyte pub/sub integration
export class RealtimeService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private roomId: string;

  constructor(
    private onTodoUpdate: (action: string, todo: any) => void,
    roomId: string
  ) {
    this.roomId = roomId;
  }

  connect() {
    try {
      // In a real Taubyte deployment, this would be the WebSocket URL from the backend
      // For now, we'll simulate the connection
      console.log(`Connecting to real-time updates for room ${this.roomId}...`);

      // Simulate connection success
      setTimeout(() => {
        this.onConnectionOpen();
      }, 100);
    } catch (error) {
      console.error("Failed to connect to real-time service:", error);
      this.handleReconnect();
    }
  }

  private onConnectionOpen() {
    console.log(`Connected to real-time updates for room ${this.roomId}`);
    this.reconnectAttempts = 0;
  }

  private onConnectionClose() {
    console.log("Disconnected from real-time updates");
    this.handleReconnect();
  }

  private onMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      this.onTodoUpdate(data.action, data.todo);
    } catch (error) {
      console.error("Failed to parse real-time message:", error);
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Simulate real-time updates for demo purposes
  simulateUpdate(action: string, todo: any) {
    setTimeout(() => {
      this.onTodoUpdate(action, todo);
    }, 100);
  }
}
