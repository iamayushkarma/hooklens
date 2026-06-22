import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Project Requests</h2>

        <p className="text-sm text-text-secondary">
          Requests across all endpoints
        </p>
      </div>

      <input
        type="text"
        placeholder="Search requests..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-border-default px-4 py-2"
      />

      <div className="flex flex-wrap gap-2">
        {methods.map((method) => (
          <button
            key={method}
            onClick={() => setMethodFilter(method)}
            className={`rounded-lg px-3 py-1 text-sm ${
              methodFilter === method
                ? "bg-primary text-text-primary"
                : "border border-border-default"
            }`}
          >
            {method}
          </button>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="rounded-lg border border-border-default p-8 text-center">
          <h3 className="font-medium">No Requests Found</h3>

          <p className="mt-2 text-sm text-text-secondary">
            Requests from all endpoints in this project will appear here.
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
