import { useEffect } from "react";
import { socket } from "@/socket/sockets";

export function useSocketConnection() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    socket.auth = { token };

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("SOCKET CONNECT ERROR", err?.message ?? err);
    });

    socket.on("disconnect", (reason) => {
      console.warn("SOCKET DISCONNECTED", reason);
    });

    socket.on("socket:error", (error) => {
      console.error("SOCKET SERVER ERROR", error);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("socket:error");
    };
  }, []);
}
