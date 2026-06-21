import { useEffect } from "react";
import { socket } from "@/socket/sockets";

export function useSocketConnection() {
  useEffect(() => {
    socket.auth = {
      token: localStorage.getItem("token"),
    };

    socket.connect();

    socket.on("connect", () => {
      console.log("CONNECTED", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("CONNECT ERROR", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("DISCONNECTED", reason);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, []);
}
