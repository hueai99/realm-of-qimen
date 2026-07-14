"use client";
import { useState } from "react";

export default function UpgradeButton({ reportId }: { reportId: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function click() {
    setState("sending");
    try {
      const response = await fetch("/api/events", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ report_id: reportId, event: "premium_report.requested" }) });
      if (!response.ok) throw new Error("request failed");
      setState("sent");
    } catch {
      setState("error");
    }
  }
  return <div className="mt-6 shrink-0 text-center sm:mt-0">
    <button onClick={click} disabled={state === "sending" || state === "sent"} className="bg-[#b7422d] px-7 py-4 font-semibold text-white disabled:opacity-70">{state === "sending" ? "Sending request…" : state === "sent" ? "Request received" : "Request the full report"}</button>
    {state === "sent" && <p className="mt-2 max-w-xs text-xs leading-5 text-[#cfc5bd]">Thank you. We will contact you about the Premium Report.</p>}
    {state === "error" && <p role="alert" className="mt-2 max-w-xs text-xs leading-5 text-[#f1b5a8]">We could not send the request. Please try again.</p>}
  </div>;
}
