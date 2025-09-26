import React, { useState, useEffect } from "react";
import { Room } from "./types";
import { RoomSelector } from "./components/RoomSelector";
import { TodoList } from "./components/TodoList";
import "./index.css";

function App() {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  // Check for room ID in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get("room");

    if (roomId) {
      // Try to join the room from URL
      handleJoinRoomFromUrl(roomId);
    }
  }, []);

  const handleJoinRoomFromUrl = async (roomId: string) => {
    try {
      // Import RoomAPI dynamically to avoid circular dependencies
      const { RoomAPI } = await import("./services/api");
      const room = await RoomAPI.getRoom(roomId);
      setCurrentRoom(room);
    } catch (err) {
      console.error("Failed to join room from URL:", err);
      // Remove invalid room ID from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("room");
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleRoomSelect = (room: Room) => {
    setCurrentRoom(room);
    // Update URL with room ID
    const url = new URL(window.location.href);
    url.searchParams.set("room", room.id);
    window.history.pushState({}, "", url.toString());
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    // Remove room ID from URL
    const url = new URL(window.location.href);
    url.searchParams.delete("room");
    window.history.pushState({}, "", url.toString());
  };

  if (currentRoom) {
    return <TodoList room={currentRoom} onLeaveRoom={handleLeaveRoom} />;
  }

  return <RoomSelector onRoomSelect={handleRoomSelect} />;
}

export default App;
