import React, { useState } from "react";
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Zap,
  Terminal,
} from "lucide-react";
import type { IntakeResponse } from "../types/crm.ts";

interface AIIntakePanelProps {
  onIntakeComplete: () => void;
}

const AIIntakePanel: React.FC<AIIntakePanelProps> = ({ onIntakeComplete }) => {
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntakeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:3000/crm/ai/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to process text stream.");

      setResult(data);
      setRawText("");
      onIntakeComplete();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm mb-10 overflow-hidden">
      {/* High-Contrast Top Accent Line using Nord Primary Blue */}
      <div className="h-1.5 w-full bg-primary"></div>

      <div className="card-body p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-base-content tracking-tight">
                AI Lead Extraction Pipeline
              </h2>
              <p className="text-xs text-base-content/60">
                Unstructured Inbound Query Parser
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="badge badge-sm bg-base-200 border-base-300 text-base-content/70 font-mono gap-1 text-xs px-2.5 py-3">
              <Terminal className="w-3 h-3" /> Llama3.1:8b
            </span>
            <span className="badge badge-sm bg-base-200 border-base-300 text-base-content/70 font-mono gap-1 text-xs px-2.5 py-3">
              <Zap className="w-3 h-3 text-warning fill-warning" /> Real-time
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-control">
            <textarea
              className="textarea textarea-bordered w-full h-36 bg-base-200/30 border-base-300 text-base-content focus:textarea-primary focus:bg-base-100 text-sm p-4 rounded-xl resize-none font-sans leading-relaxed transition-all"
              placeholder="Paste custom enterprise customer inquiry transcripts or raw logs here (Supports German & English)..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !rawText.trim()}
            className="btn btn-md btn-primary disabled:bg-base-200 disabled:text-base-content/30 border-none text-primary-content font-semibold rounded-xl tracking-wide transition-all shadow-sm cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                <span>Executing Local Inference Models...</span>
              </div>
            ) : (
              "Extract Features & Auto-Provision Records"
            )}
          </button>
        </form>

        {error && (
          <div className="alert alert-error text-sm gap-3 rounded-xl mt-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="alert alert-success text-sm rounded-xl mt-6 p-5 flex flex-col items-start gap-4">
            <div className="flex items-center gap-2 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Pipeline Analysis Successful</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-3 border-t border-success-content/20 font-mono text-xs">
              <div className="flex items-center justify-between bg-base-100 p-3 rounded-lg border border-base-300">
                <span className="text-base-content/60">Classification:</span>
                <span className="badge badge-md badge-neutral font-bold px-3">
                  {result.classification}
                </span>
              </div>
              <div className="flex items-center justify-between bg-base-100 p-3 rounded-lg border border-base-300">
                <span className="text-base-content/60">System Urgency:</span>
                <span className="badge badge-md badge-warning font-bold px-3">
                  {result.urgency}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIIntakePanel;
