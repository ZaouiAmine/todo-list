import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoResponse,
  TodosResponse,
  Room,
  CreateRoomRequest,
  RoomResponse,
} from "../types";

const API_BASE_URL = "/api"; // This will be configured for Taubyte deployment

export class TodoAPI {
  static async getTodos(roomId: string): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos?room=${roomId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }
    const data: TodosResponse = await response.json();
    return data.data;
  }

  static async createTodo(
    roomId: string,
    todo: CreateTodoRequest
  ): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos?room=${roomId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error("Failed to create todo");
    }
    const data: TodoResponse = await response.json();
    return data.data!;
  }

  static async updateTodo(
    roomId: string,
    id: string,
    todo: UpdateTodoRequest
  ): Promise<Todo> {
    const response = await fetch(
      `${API_BASE_URL}/todos?id=${id}&room=${roomId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update todo");
    }
    const data: TodoResponse = await response.json();
    return data.data!;
  }

  static async deleteTodo(roomId: string, id: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/todos?id=${id}&room=${roomId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }
  }
}

export class RoomAPI {
  static async createRoom(room: CreateRoomRequest): Promise<Room> {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(room),
    });
    if (!response.ok) {
      throw new Error("Failed to create room");
    }
    const data: RoomResponse = await response.json();
    return data.data!;
  }

  static async getRoom(id: string): Promise<Room> {
    const response = await fetch(`${API_BASE_URL}/rooms?id=${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch room");
    }
    const data: RoomResponse = await response.json();
    return data.data!;
  }
}
