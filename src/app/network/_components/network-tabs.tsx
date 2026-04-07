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
    <div className="flex bg-navy-lighter/50 rounded-xl p-1 border border-white/5 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold tracking-wider transition-all ${
            activeTab === tab.key
              ? "bg-gold text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
