import React from "react";
import { Building2, Globe, TrendingUp, CalendarDays } from "lucide-react";
import type { Account } from "../types/crm.ts";

interface AccountGridProps {
  accounts: Account[];
}

export const AccountGrid: React.FC<AccountGridProps> = ({ accounts }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-base-300 pb-4">
        <h2 className="text-lg font-bold text-base-content flex items-center gap-2.5">
          <Building2 className="w-5 h-5 text-base-content/60" />
          Synchronized Account Registries
        </h2>
        <span className="badge badge-ghost font-bold px-3 py-1 font-mono text-xs border border-base-300">
          Active Node Count: {accounts.length}
        </span>
      </div>

      {accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-base-100 border border-dashed border-base-300 rounded-2xl text-base-content/40 text-sm p-6 shadow-sm">
          <Building2 className="w-10 h-10 mb-3" />
          <p className="font-medium max-w-sm leading-relaxed text-base-content/60">
            No live data pipelines detected. Ingest unstructured corporate logs
            using the console above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((acc) => (
            <div
              key={acc._id}
              className="card bg-base-100 border border-base-300 shadow-sm hover:border-primary/40 transition-all duration-300 group"
            >
              <div className="card-body p-6">
                <div className="flex justify-between items-start mb-4 gap-3">
                  <h3 className="card-title text-base font-bold text-base-content tracking-tight group-hover:text-primary transition-colors">
                    {acc.name}
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-base-200 text-base-content/70 px-2 py-1 rounded-md border border-base-300 whitespace-nowrap">
                    {acc.industry}
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-base-300/60 text-base-content/70 text-xs font-medium">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-base-content/40">
                      <Globe className="w-4 h-4" /> Country Region
                    </span>
                    <span className="text-base-content bg-base-200 px-2 py-0.5 rounded border border-base-300 font-sans">
                      {acc.country}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-base-content/40">
                      <CalendarDays className="w-4 h-4" /> Provisioned At
                    </span>
                    <span className="text-base-content/80 font-mono">
                      {new Date(acc.createdAt).toLocaleDateString("de-DE")}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 bg-primary/5 p-3.5 rounded-xl mt-3 border border-primary/10">
                    <span className="flex items-center gap-1.5 text-primary text-[11px] uppercase tracking-wider font-extrabold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Mongoose Rollup Revenue
                    </span>
                    <span className="font-extrabold text-base text-primary font-mono tracking-tight pt-0.5">
                      {new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: "EUR",
                      }).format(acc.totalPipelineValue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
