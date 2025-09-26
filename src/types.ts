export interface Todo {
  id: string;
  roomId: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoRequest {
  text: string;
}

export interface CreateRoomRequest {
  name: string;
}

export interface Room {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomResponse {
  success: boolean;
  message: string;
  data?: Room;
}

export interface UpdateTodoRequest {
  text: string;
  completed: boolean;
}

export interface TodoResponse {
  success: boolean;
  message: string;
  data?: Todo;
}

export interface TodosResponse {
  success: boolean;
  message: string;
  data: Todo[];
}
