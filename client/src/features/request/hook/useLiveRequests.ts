import { useEffect } from "react";
import { socket } from "@/socket/sockets";

export function useLiveRequests(slug?: string) {
  useEffect(() => {
    if (!slug) return;

    socket.emit("inspect:join", slug);

    return () => {
      socket.emit("inspect:leave", slug);
    };
  }, [slug]);
}
