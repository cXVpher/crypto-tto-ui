"use client";

interface HistoryTabsProps {
  activeTab: "purchase" | "withdraw";
  setActiveTab: (tab: "purchase" | "withdraw") => void;
}

export function HistoryTabs({ activeTab, setActiveTab }: HistoryTabsProps) {
  const tabs = [
    { key: "purchase" as const, label: "PURCHASE HISTORY" },
    { key: "withdraw" as const, label: "WITHDRAW HISTORY" },
  ];

  return (
    <div className="px-4 pt-4">
      <div className="flex bg-navy-lighter/50 rounded-xl p-1 border border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-2 py-2.5 rounded-lg text-[10px] font-bold tracking-wider transition-all ${
              activeTab === tab.key
                ? "bg-gold text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
