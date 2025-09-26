import React, { useState } from "react";
import { RoomAPI } from "../services/api";
import { Room } from "../types";

interface RoomSelectorProps {
  onRoomSelect: (room: Room) => void;
}

export function RoomSelector({ onRoomSelect }: RoomSelectorProps) {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const room = await RoomAPI.createRoom({ name: roomName.trim() });
      onRoomSelect(room);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const room = await RoomAPI.getRoom(roomId.trim());
      onRoomSelect(room);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="room-selector">
      <div className="header">
        <h1>📝 Todo List</h1>
        <p>Create a new room or join an existing one</p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="room-options">
        <div className="room-option">
          <h3>Create New Room</h3>
          <form onSubmit={handleCreateRoom}>
            <div className="form-group">
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                maxLength={50}
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Room"}
              </button>
            </div>
          </form>
        </div>

        <div className="room-option">
          <h3>Join Existing Room</h3>
          <form onSubmit={handleJoinRoom}>
            <div className="form-group">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? "Joining..." : "Join Room"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="room-info">
        <p>
          <strong>How it works:</strong>
        </p>
        <ul>
          <li>Create a room to start a new todo list</li>
          <li>Share the room ID with others to collaborate</li>
          <li>Only people with the room ID can access your todos</li>
          <li>Changes sync in real-time for all room members</li>
        </ul>
      </div>
    </div>
  );
}
