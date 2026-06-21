import { useEffect } from "react";
import { socket } from "@/socket/sockets";

const joinAttempt = {
  slug: null as string | null,
  timestamp: 0,
};
const MIN_JOIN_INTERVAL_MS = 500;

function shouldEmitJoin(slug: string): boolean {
  const now = Date.now();
  if (
    joinAttempt.slug === slug &&
    now - joinAttempt.timestamp < MIN_JOIN_INTERVAL_MS
  ) {
    return false;
  }

  joinAttempt.slug = slug;
  joinAttempt.timestamp = now;
  return true;
}

export function useLiveRequests(
  slug: string | undefined,
  onNewRequest: (request: any) => void,
) {
  useEffect(() => {
    if (!slug) return;

    type JoinResponse = {
      success: boolean;
      message: string;
      slug?: string;
    };

    const joinRoom = () => {
      if (!shouldEmitJoin(slug)) return;
      console.log("JOINING ROOM:", slug);
      socket.emit("inspect:join", slug, (response: JoinResponse) => {
        if (!response.success) {
          console.error("JOIN FAILED", response);
        } else {
          console.log("JOIN SUCCESS", response);
        }
      });
    };

    const handleNewRequest = (data: any) => {
      console.log("REQUEST NEW", data);
      onNewRequest(data.request);
    };

    const handleSocketError = (error: { event: string; message: string }) => {
      console.error("SOCKET ERROR", error);
    };

    const handleConnect = () => {
      console.log("SOCKET CONNECTED for requests", socket.id);
      joinRoom();
    };

    socket.on("socket:error", handleSocketError);
    socket.on("connect", handleConnect);
    socket.on("request:new", handleNewRequest);

    if (!socket.connected) {
      socket.connect();
    } else {
      joinRoom();
    }

    return () => {
      socket.emit("inspect:leave", slug);
      socket.off("request:new", handleNewRequest);
      socket.off("socket:error", handleSocketError);
      socket.off("connect", handleConnect);
    };
  }, [slug, onNewRequest]);
}
