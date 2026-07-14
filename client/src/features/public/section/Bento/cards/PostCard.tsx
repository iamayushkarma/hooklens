import React from "react";

function PostCard({ style }: { style: string }) {
  return (
    <div
      className={`${style} flex flex-col justify-between py-3 h-83 bg-gray-50 rounded-md border border-border-default group relative overflow-hidden`}
    ></div>
  );
}

export default PostCard;
