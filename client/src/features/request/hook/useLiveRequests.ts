import { useEffect } from "react";
import { socket } from "@/socket/sockets";

export function useLiveRequests(
  slug: string | undefined,
  onNewRequest: (request: any) => void,
) {
  useEffect(() => {
    if (!slug) return;

    console.log("JOINING ROOM:", slug);

    socket.emit("inspect:join", slug);

    const handleNewRequest = (data: any) => {
      console.log("REQUEST NEW", data);

      onNewRequest(data.request);
    };

    socket.on("request:new", handleNewRequest);

    return () => {
      socket.emit("inspect:leave", slug);

      socket.off("request:new", handleNewRequest);
    };
  }, [slug]);
}
