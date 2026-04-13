"use client";

interface HistoryTabsProps {
  activeTab: "purchase" | "withdraw";
  setActiveTab: (tab: "purchase" | "withdraw") => void;
}

export function HistoryTabs({ activeTab, setActiveTab }: HistoryTabsProps) {
  const tabs = [
    { key: "purchase" as const, label: "DEPOSIT HISTORY" },
    { key: "withdraw" as const, label: "WITHDRAW HISTORY" },
  ];

  return (
    <div className="px-4 pt-4">
      <div
        className="flex rounded-xl border p-1"
        style={{
          background: "rgba(255,255,255,0.075)",
          borderColor: "rgba(126,194,255,0.09)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 rounded-lg px-2 py-2.5 text-[10px] font-bold tracking-wider transition-all"
            style={
              activeTab === tab.key
                ? {
                    background:
                      "linear-gradient(135deg, rgba(126,194,255,0.62) 0%, rgba(75,125,232,0.82) 100%)",
                    boxShadow:
                      "0 4px 20px rgba(126,194,255,0.28), inset 0 1px 0 rgba(255,255,255,0.22)",
                    color: "#ffffff",
                  }
                : { color: "#98abd4" }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
