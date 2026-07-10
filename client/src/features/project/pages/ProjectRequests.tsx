import { LayoutGroup, motion } from "motion/react";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Search, Webhook, Plus } from "lucide-react";

import { getProjectRequests } from "@/features/request/api/getProjectRequests";
import type { RequestLog } from "@/features/request/types/request.types";
import RequestCard from "@/features/request/components/RequestCard";

const methods = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"];

function ProjectRequests() {
  const { projectId } = useParams();

  const [requests, setRequests] = useState<RequestLog[]>([]);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");

  useEffect(() => {
    if (!projectId) return;

    const fetchRequests = async () => {
      try {
        const data = await getProjectRequests(projectId);
        setRequests(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRequests();
  }, [projectId]);

  const filteredRequests = requests.filter((request) => {
    const query = search.toLowerCase();

    const matchesSearch =
      request.method.toLowerCase().includes(query) ||
      request.ip.toLowerCase().includes(query) ||
      request.userAgent.toLowerCase().includes(query) ||
      request.contentType?.toLowerCase().includes(query) ||
      JSON.stringify(request.body).toLowerCase().includes(query);

    const matchesMethod =
      methodFilter === "ALL" || request.method === methodFilter;

    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-4 relative pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold text-text-primary">
          Project Requests
        </h2>
        <span className="rounded-full bg-accent-subtle px-3 py-1 text-xs font-medium text-accent">
          Requests across all endpoints
        </span>
      </div>

      {/* Search + Method filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search requests (method, IP, path...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border-default bg-bg-card py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <LayoutGroup id="method-filter">
          <div className="flex flex-wrap items-center gap-1 rounded-md border border-border-default bg-bg-card p-1">
            {methods.map((method) => (
              <button
                key={method}
                onClick={() => setMethodFilter(method)}
                className="relative rounded-md px-3.5 cursor-pointer py-1.5 text-sm font-medium"
              >
                {methodFilter === method && (
                  <motion.div
                    layoutId="method-filter-pill"
                    className="absolute inset-0 rounded-[5px] bg-blue-600 pointer-events-none"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors ${
                    methodFilter === method
                      ? "text-white"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {method}
                </span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      {/* Requests list */}
      {filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-default bg-bg-sidebar/40 px-6 py-14 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-bg-card">
            <Webhook className="size-6 text-text-secondary" />
          </div>
          <h3 className="text-base font-semibold text-text-primary">
            Logging active...
          </h3>
          <p className="mt-2 max-w-sm text-sm text-text-secondary">
            Waiting for incoming requests to this project's endpoints. Real-time
            updates will appear here as they are received.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((request) => (
            <RequestCard key={request._id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectRequests;
