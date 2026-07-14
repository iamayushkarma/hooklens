import { Bell, Search } from "lucide-react";

function PostCard({ style }: { style: string }) {
  return (
    <div
      className={`${style} flex flex-col justify-between py-3 h-83 bg-gray-50 rounded-md border border-border-default group relative overflow-hidden`}
    >
      <div className="h-3/4 flex items-center justify-center">
        <div className="w-[60%] rounded-xl h-3/4 border border-border-default bg-white px-3.5">
          <div className="flex items-center justify-between py-3">
            <h4 className="font-medium text-sm">#Content</h4>
            <div className="flex place-items-center justify-center gap-2">
              <Search className="size-4 text-text-secondary" />
              <Bell className="size-4 text-text-secondary" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-accent size-10 rounded-md"></div>
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <h4 className="text-text-primary">Hooklens</h4>
                  <p className="text-text-secondary">2:13</p>
                </div>
                <p className="text-sm">
                  Typefully's post published on X, LinkedIn, and Threads
                </p>
              </div>
            </div>
            <div className="pl-12 flex gap-2 mt-3">
              <span className="w-[3.5px] h-10 bg-gray-400 rounded-full"></span>
              <p className="text-sm w-3/4">
                Typefully's post published on X, LinkedIn, and Threads
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative px-3">
        <h3 className="text-text-primary font-semibold">
          Debug webhooks together
        </h3>
        <p className="text-text-secondary">
          Capture, replay, and debug webhooks together.
        </p>
      </div>
    </div>
  );
}

export default PostCard;
