import { useEffect, useState } from "react";
import Glass from "../ui/Glass";
import { Clock } from "lucide-react";

/* ---------------- MOCK DATA ---------------- */

const mockQuizData = {
  question: "What is the primary function of React's useState hook?",
  reward: 500,
  options: [
    "To handle side effects in components",
    "To add state to functional components",
    "To manage global application state",
    "To optimize component rendering performance",
  ],
};

/* ---------------- PROPS ---------------- */

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ---------------- COMPONENT ---------------- */

export default function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);

  const totalTime = 10;
  const progress = (timeLeft / totalTime) * 100;

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    if (!isOpen) return;

    setTimeLeft(totalTime);
    setSelectedOption(null);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  /* ---------------- HEAD FAKE ANIMATION ---------------- */
  // Removed floating animation per request.

  if (!isOpen) return null;

  const glassCardStyle = {
    borderRadius: "1.75rem",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    background: `
      linear-gradient(to top, rgba(0, 0, 0, 0.20), transparent 60%),
      rgba(21, 21, 21, 0.30)
    `,
    boxShadow: `
      inset 0 0 0 1px rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.22)
    `,
    backdropFilter: "brightness(1.1) blur(1px)",
    WebkitBackdropFilter: "brightness(1.1) blur(1px)",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-md">
        <Glass style={glassCardStyle} className="relative rounded-2xl px-6 py-5 border border-white/10 bg-[#0e0f14] overflow-hidden">
          {/* TOP VIDEO BADGE */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border border-purple-400/40 bg-gradient-to-b from-slate-900/80 to-black/80 shadow-[0_0_40px_rgba(168,85,247,0.45)] ring-2 ring-purple-500/20">
            <video
              src="/character.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          </div>

          {/* TOP BAR */}
          <div className="flex items-center justify-between mt-14 mb-4">
            {/* TIMER */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full
                bg-black/50 border border-white/10 text-xs font-mono
                ${timeLeft <= 5 ? "text-red-400" : "text-purple-300"}`}
            >
              <Clock className="w-3.5 h-3.5" />
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>

            {/* CLOSE */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-lg"
            >
              ×
            </button>
          </div>

          {/* PROGRESS */}
          <div className="mb-5">
            <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* REWARD */}
          <div className="flex justify-center my-6 relative">
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <div className="w-40 h-14 bg-purple-500/25 blur-3xl rounded-full" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-center gap-3">
                <img
                  src="/leaderboard/diamond-removebg-preview.png"
                  className="w-8 h-8 animate-float-soft"
                  alt="reward"
                />
                <span className="text-3xl font-black text-amber-400">
                  {mockQuizData.reward}
                </span>
              </div>

              <div className="relative mt-2 w-28 h-[2px]">
                <div className="absolute inset-0 bg-purple-500/60 blur-md rounded-full" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full" />
              </div>
            </div>
          </div>

          {/* QUESTION */}
          <h3 className="text-base font-semibold text-white text-center mb-5">
            {mockQuizData.question}
          </h3>

          {/* OPTIONS */}
          <div className="flex flex-col gap-2.5">
            {mockQuizData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`w-full py-2.5 px-4 rounded-full text-sm transition ${
                  selectedOption === index
                    ? "bg-purple-600 text-white"
                    : "bg-[#1a1b22] text-gray-300 hover:bg-[#22232d]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* SUBMIT */}
          <div className="mt-6 flex justify-end">
            <button className="px-6 py-2.5 rounded-full text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition">
              Submit
            </button>
          </div>

        </Glass>
      </div>
    </div>
  );
}
