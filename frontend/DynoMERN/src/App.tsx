import { useEffect, useState } from "react";
import AIIntakePanel from "./components/AIIntakePanel.tsx";
import { AccountGrid } from "./components/AccountGrid.tsx";
import { ShieldCheck } from "lucide-react";
import type { Account } from "./types/crm.ts";

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const fetchCRMData = async () => {
    try {
      const res = await fetch("http://localhost:3000/crm/accounts");
      if (res.ok) {
        const data = await res.json();
        setAccounts(data);
      }
    } catch (err) {
      console.error("Error linking data metrics stream:", err);
    }
  };

  useEffect(() => {
    fetchCRMData();
  }, []);

  return (
    // CRUCIAL: data-theme="nord" tells daisyUI to apply the Arctic frost theme layout
    <div
      data-theme="nord"
      className="min-h-screen bg-base-200/50 text-base-content antialiased selection:bg-primary/20"
    >
      {/* Navigation Header */}
      <header className="bg-base-100 border-b border-base-300 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Custom Embedded Enterprise Bridge Logo SVG */}
            <div className="bg-primary text-primary-content p-2 rounded-xl shadow-sm">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 21V10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11" />
                <path d="M12 22V8" />
                <path d="M9 12h6" />
                <circle cx="12" cy="4" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h1 className="font-extrabold text-base-content tracking-tight text-base leading-none">
                Enterprise-CRM-Bridge
              </h1>
              <span className="text-[10px] text-base-content/50 font-bold tracking-wider uppercase block mt-1">
                Full-Stack AI Automation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-base-200 border border-base-300 rounded-xl px-3 py-1.5">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="text-xs font-semibold text-base-content/70 font-mono tracking-wide">
              GDPR-Compliant Local Network
            </span>
            <span className="w-2 h-2 rounded-full bg-success animate-pulse ml-1"></span>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AIIntakePanel onIntakeComplete={fetchCRMData} />
        <AccountGrid accounts={accounts} />
      </main>
    </div>
  );
}
