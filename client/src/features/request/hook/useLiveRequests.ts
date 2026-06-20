import { useEffect } from "react";
import { socket } from "@/socket/sockets";

export function useLiveRequests(
  slug: string | undefined,
  onNewRequest: (request: any) => void,
) {
  useEffect(() => {
    if (!slug) return;

    socket.emit("inspect:join", slug);

    const handleNewRequest = (data: any) => {
      onNewRequest(data.request);
    };

    socket.on("connect", () => {
      console.log("CONNECTED", socket.id);
    });
    socket.on("request:new", handleNewRequest);
    socket.on("request:new", (data) => {
      console.log("REQUEST NEW", data);
    });

    return () => {
      socket.emit("inspect:leave", slug);
      socket.off("request:new", handleNewRequest);
    };
  }, [slug, onNewRequest]);
}
