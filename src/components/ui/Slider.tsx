import Glass from "./Glass";
const TABS = ["quiz", "leaderboard", "task"] as const;
type Tab = (typeof TABS)[number];
//Slider component for switching between quiz, leaderboard and task views
interface SliderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export default function Slider({ activeTab, setActiveTab }: SliderProps) {
  return (
    <div className="flex justify-center">
      <Glass
        className="
          relative w-full max-w-[420px]
          px-2 py-2
          rounded-full
          border border-white/15
          bg-black/40
          backdrop-blur-xl
        "
      >
        {/* ACTIVE PILL */}
        <div
          className="
            absolute top-1 bottom-1
            w-1/3
            rounded-full
            bg-white
            shadow-[0_8px_24px_rgba(0,0,0,0.35)]
            transition-transform duration-500
            ease-[cubic-bezier(0.22,0.61,0.36,1)]
          "
          style={{
            transform:
              activeTab === "quiz"
                ? "translateX(0%)"
                : activeTab === "leaderboard"
                ? "translateX(100%)"
                : "translateX(200%)",
          }}
        >
          {/* subtle highlight */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
        </div>

        {/* BUTTONS */}
        <div className="relative z-10 flex">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1
                h-10
                flex items-center justify-center
                font-semibold
                text-sm
                transition-colors duration-300
                ${
                  activeTab === tab
                    ? "text-black"
                    : "text-gray-400 hover:text-white"
                }
              `}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </Glass>
    </div>
  );
}
