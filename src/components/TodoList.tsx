import React, { useState, useEffect } from "react";
import { Todo, CreateTodoRequest, UpdateTodoRequest } from "../types";
import { TodoAPI } from "../services/api";
import { RealtimeService } from "../services/realtime";
import { Room } from "../types";

interface TodoListProps {
  room: Room;
  onLeaveRoom: () => void;
}

export function TodoList({ room, onLeaveRoom }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodoText, setNewTodoText] = useState("");
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  // Initialize real-time service
  useEffect(() => {
    const realtimeService = new RealtimeService((action, todo) => {
      console.log("Real-time update:", action, todo);

      switch (action) {
        case "created":
          setTodos((prev) => [...prev, todo]);
          break;
        case "updated":
          setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)));
          break;
        case "deleted":
          setTodos((prev) => prev.filter((t) => t.id !== todo.id));
          break;
        case "list-updated":
          // Refresh the entire list
          loadTodos();
          break;
      }
    }, room.id);

    realtimeService.connect();
    setRealtimeConnected(true);

    return () => {
      realtimeService.disconnect();
    };
  }, [room.id]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const todosData = await TodoAPI.getTodos(room.id);
      setTodos(todosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [room.id]);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      setError(null);
      const newTodo: CreateTodoRequest = { text: newTodoText.trim() };
      const createdTodo = await TodoAPI.createTodo(room.id, newTodo);
      setTodos((prev) => [...prev, createdTodo]);
      setNewTodoText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo");
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      setError(null);
      const updateData: UpdateTodoRequest = {
        text: todo.text,
        completed: !todo.completed,
      };
      const updatedTodo = await TodoAPI.updateTodo(
        room.id,
        todo.id,
        updateData
      );
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updatedTodo : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      setError(null);
      await TodoAPI.deleteTodo(room.id, id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo");
    }
  };

  const handleEditTodo = async (todo: Todo, newText: string) => {
    if (!newText.trim()) return;

    try {
      setError(null);
      const updateData: UpdateTodoRequest = {
        text: newText.trim(),
        completed: todo.completed,
      };
      const updatedTodo = await TodoAPI.updateTodo(
        room.id,
        todo.id,
        updateData
      );
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updatedTodo : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>📝 {room.name}</h1>
        <p>Room ID: {room.id}</p>
        <button onClick={onLeaveRoom} className="btn btn-danger">
          Leave Room
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div
        className={
          realtimeConnected
            ? "realtime-indicator"
            : "realtime-indicator disconnected"
        }
      >
        {realtimeConnected ? "🟢 Connected" : "🔴 Disconnected"}
      </div>

      <form className="todo-form" onSubmit={handleCreateTodo}>
        <div className="form-group">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="What needs to be done?"
            maxLength={200}
          />
          <button type="submit" className="btn btn-primary">
            Add Todo
          </button>
        </div>
      </form>

      <div className="todo-list">
        {loading ? (
          <div className="loading">
            <p>Loading todos...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <h3>No todos yet</h3>
            <p>Add your first todo above to get started!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onEdit={handleEditTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo, newText: string) => void;
}

function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (isEditing && editText.trim() !== todo.text) {
      onEdit(todo, editText.trim());
    }
    setIsEditing(!isEditing);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
        className="todo-checkbox"
      />

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleEdit}
          onKeyDown={handleKeyPress}
          className="todo-text"
          autoFocus
        />
      ) : (
        <span
          className={`todo-text ${todo.completed ? "completed" : ""}`}
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.text}
        </span>
      )}

      <div className="todo-actions">
        <button onClick={handleEdit} className="btn btn-small btn-success">
          {isEditing ? "Save" : "Edit"}
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="btn btn-small btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
