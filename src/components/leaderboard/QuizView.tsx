import Glass from "../ui/Glass";

interface QuizViewProps {
  onStart: () => void;
}

export default function QuizView({ onStart }: QuizViewProps) {
  const glassCardStyle: React.CSSProperties = {
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
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <Glass style={glassCardStyle}  className="border border-purple-500/30 rounded-2xl p-8  text-center">
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
          Daily Quiz
        </span>

        <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Take Today’s Quiz
        </h2>

        <p className="text-gray-400 max-w-xl mx-auto mb-8">
          Answer a short quiz and earn points to boost your leaderboard rank.
        </p>

        <button
          onClick={onStart}
          className="px-10 py-3 rounded-full font-bold bg-gradient-to-r from-blue-600 to-purple-600 shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:scale-105 transition"
        >
          Start Quiz
        </button>
      </Glass>
    </div>
  );
}
