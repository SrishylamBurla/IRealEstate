"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function SocketProvider({ userId }) {
  useEffect(() => {
    if (!userId) return;

    socket.connect();
    socket.emit("join", userId);

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return null;
}
