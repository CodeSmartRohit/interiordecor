"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DesignRequestType } from "@/types";

const statuses = ["ALL", "PENDING", "REVIEWED", "IN_PROGRESS", "COMPLETED"];
const statusColors: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning border-warning/20",
  REVIEWED: "bg-info/10 text-info border-info/20",
  IN_PROGRESS: "bg-accent/10 text-accent border-accent/20",
  COMPLETED: "bg-success/10 text-success border-success/20",
};

export default function AdminDesignRequestsPage() {
  const [requests, setRequests] = useState<DesignRequestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/design-requests")
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setRequests(arr);
        const n: Record<string, string> = {};
        arr.forEach((r: DesignRequestType) => { n[r.id] = r.adminNotes || ""; });
        setNotes(n);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateRequest = async (id: string, status?: string) => {
    try {
      const body: Record<string, string> = {};
      if (status) body.status = status;
      body.adminNotes = notes[id] || "";
      const res = await fetch(`/api/design-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => r.id === id ? { ...r, ...(status && { status }), adminNotes: body.adminNotes } : r)
        );
      }
    } catch { alert("Failed to update"); }
  };

  const filtered = filter === "ALL" ? requests : requests.filter((r) => r.status === filter);

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-heading font-bold text-text-light mb-8">
        Design Requests <span className="gold-text">Inbox</span>
      </motion.h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === s ? "gold-gradient text-primary shadow-md shadow-accent/20"
                : "bg-white/5 text-text-light/50 hover:text-text-light border border-white/5"
            }`}>
            {s.replace("_", " ")}
            {s !== "ALL" && <span className="ml-1.5 text-xs opacity-60">({requests.filter((r) => r.status === s).length})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
        ))}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16"><p className="text-text-light/30">No design requests found</p></div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req, i) => (
            <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-secondary/50 rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-5 cursor-pointer hover:bg-white/3 transition-colors"
                onClick={() => setExpanded(expanded === req.id ? null : req.id)}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-semibold text-text-light">{req.roomType} Design</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[req.status] || ""}`}>
                        {req.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-text-light/30">
                      {req.user?.name} • {req.user?.email} • {new Date(req.createdAt).toLocaleDateString()} • {req.roomDimensions}
                    </p>
                  </div>
                  <svg className={`w-5 h-5 text-text-light/30 transition-transform shrink-0 ${expanded === req.id ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {expanded === req.id && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5 border-t border-white/5">
                  <div className="pt-4 grid sm:grid-cols-2 gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-white/3">
                      <span className="text-xs text-accent font-semibold uppercase">Address</span>
                      <p className="text-sm text-text-light/70 mt-1">{req.address}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/3">
                      <span className="text-xs text-accent font-semibold uppercase">Room Details</span>
                      <p className="text-sm text-text-light/70 mt-1">{req.roomType} • {req.roomDimensions}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/3 mb-4">
                    <span className="text-xs text-accent font-semibold uppercase">Description</span>
                    <p className="text-sm text-text-light/70 mt-1 whitespace-pre-wrap">{req.description}</p>
                  </div>
                  {req.inspirationLink && (
                    <div className="p-3 rounded-xl bg-white/3 mb-4">
                      <span className="text-xs text-accent font-semibold uppercase">Inspiration Link</span>
                      <a href={req.inspirationLink} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-info hover:underline mt-1 block break-all">{req.inspirationLink}</a>
                    </div>
                  )}
                  <div className="p-3 rounded-xl bg-white/3 mb-4">
                    <span className="text-xs text-accent font-semibold uppercase">Admin Notes</span>
                    <textarea value={notes[req.id] || ""} onChange={(e) => setNotes({ ...notes, [req.id]: e.target.value })}
                      rows={3} placeholder="Add notes for this request..."
                      className="w-full mt-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-text-light text-sm placeholder-text-light/20 focus:outline-none focus:border-accent/50 resize-none" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select value={req.status} onChange={(e) => updateRequest(req.id, e.target.value)}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-text-light text-sm focus:outline-none cursor-pointer">
                      {statuses.filter((s) => s !== "ALL").map((s) => (
                        <option key={s} value={s} className="bg-primary">{s.replace("_", " ")}</option>
                      ))}
                    </select>
                    <button onClick={() => updateRequest(req.id)}
                      className="px-5 py-2 rounded-xl gold-gradient text-primary text-sm font-semibold hover:opacity-90 transition-all">
                      Save Notes
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
