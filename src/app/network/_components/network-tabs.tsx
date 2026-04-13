"use client";

interface NetworkTabsProps {
  activeTab: "affiliate" | "matching";
  setActiveTab: (tab: "affiliate" | "matching") => void;
}

export function NetworkTabs({ activeTab, setActiveTab }: NetworkTabsProps) {
  const tabs = [
    { key: "affiliate" as const, label: "AFFILIATE HISTORY" },
    { key: "matching" as const, label: "MATCHING HISTORY" },
  ];

  return (
    <div
      className="mb-4 flex rounded-xl border p-1"
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
          className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold tracking-wider transition-all ${
            activeTab === tab.key
              ? "text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
          style={
            activeTab === tab.key
              ? {
                  background:
                    "linear-gradient(135deg, rgba(126,194,255,0.62) 0%, rgba(75,125,232,0.82) 100%)",
                  boxShadow:
                    "0 4px 20px rgba(126,194,255,0.28), inset 0 1px 0 rgba(255,255,255,0.22)",
                }
              : { color: "#98abd4" }
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
