import { useState } from "react";
import Glass from "../components/ui/Glass";

import LeaderboardView from "../components/leaderboard/LeaderboardView";
import QuizView from "../components/leaderboard/QuizView";
import TaskView from "../components/leaderboard/TaskView";
import QuizModal from "../components/leaderboard/QuizModal";

import "../components/leaderboard/leaderboard.anim.css";

/* ------------------------------------------------------------------ */
/* TYPES */
/* ------------------------------------------------------------------ */
const TABS = ["quiz", "leaderboard", "task"] as const;
type Tab = (typeof TABS)[number];

/* ------------------------------------------------------------------ */
/* PAGE */
/* ------------------------------------------------------------------ */
export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("leaderboard");
  const [showQuiz, setShowQuiz] = useState(false);

  /* CUSTOM GLASS STYLE (VALID) */
  const glassCardStyle: React.CSSProperties = {
    borderRadius: "9999px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    background: `
      linear-gradient(to top, rgba(0, 0, 0, 0.20), transparent 60%),
      rgba(21, 21, 21, 0.30)
    `,
    boxShadow: `
      inset 0 0 0 1px rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.22)
    `,
    backdropFilter: "brightness(1.1) blur(6px)",
    WebkitBackdropFilter: "brightness(1.1) blur(6px)",
  };

  return (
    <div className="relative min-h-screen text-white px-4 md:px-6 py-6">
      {/* QUIZ MODAL */}
      <QuizModal isOpen={showQuiz} onClose={() => setShowQuiz(false)} />

      {/* BLUR WHEN MODAL OPEN */}
      <div
        className={`transition-all duration-300 ${
          showQuiz ? "blur-sm brightness-[0.55] pointer-events-none" : ""
        }`}
      >
        {/* HEADER */}
        <div className="max-w-6xl mx-auto mb-16">
          <h1 className="text-center text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-12">
            Incridea Leaderboard
          </h1>

          {/* SLIDER */}
          <div className="flex justify-center">
            <Glass
              style={glassCardStyle}
              className="relative w-[460px] max-w-full px-3 py-3"
            >
              {/* ACTIVE PILL */}
              <div
                className="
                  absolute top-2 bottom-2 w-1/3
                  rounded-full
                  bg-gradient-to-b from-white via-gray-100 to-gray-200
                  shadow-[0_8px_24px_rgba(0,0,0,0.28)]
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
                {/* subtle inner highlight */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
              </div>

              {/* BUTTONS */}
              <div className="relative z-10 flex">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      flex-1 py-3.5
                      text-xs md:text-sm
                      font-bold tracking-wide
                      transition-all duration-300
                      ${
                        activeTab === tab
                          ? "text-black"
                          : "text-gray-400 hover:text-white"
                      }
                    `}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </Glass>
          </div>
        </div>

        {/* CONTENT */}
        {activeTab === "leaderboard" && <LeaderboardView />}
        {activeTab === "quiz" && (
          <QuizView onStart={() => setShowQuiz(true)} />
        )}
        {activeTab === "task" && <TaskView />}
      </div>
    </div>
  );
}
