import { useState, useEffect } from 'react';
import { X } from 'lucide-react'; 
import Glass from './ui/Glass'; 

// Mock Data for the Quiz
const mockQuizData = {
  question: "Which planet is known as the Red Planet?",
  reward: 500,
  options: ["Mars", "Jupiter", "Earth", "Saturn"]
};

interface QuizProps {
  isOpen: boolean;
  onClose: () => void;
}

const Quiz = ({ isOpen, onClose }: QuizProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  // Timer set to 15 seconds
  const [timeLeft, setTimeLeft] = useState(15);
  const totalTime = 15; 

  useEffect(() => {
    if (!isOpen) return;
    
    // Reset state on open
    setTimeLeft(15); 
    setSelectedOption(null);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  // Safe Progress Calculation
  const progress = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));

  return (
    <>
      {/* Self-contained styles for the Quiz animation */}
      <style>{`
        @keyframes slideUp {
            0% { transform: translateY(100px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          onClick={onClose}
        ></div>

        {/* Card Container: 420px width */}
        <div className="relative w-full max-w-[420px] animate-[slideUp_0.4s_ease-out]">
          
          <Glass className="
            relative
            rounded-t-[40px]
            rounded-b-[20px]
            p-8 pb-10
            overflow-hidden
            border border-white/10
          ">
            
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8 mt-2 relative z-30">
              {/* Close Button */}
              <button 
                  onClick={onClose}
                  className="text-white/50 hover:text-white transition-colors p-2 -ml-2"
              >
                  <X size={24} />
              </button>

              {/* Points Pill (Updated with Image) */}
              <div className="
                  relative h-[32px]
                  bg-black/40 backdrop-blur-md
                  rounded-full
                  flex items-center justify-center
                  px-4 gap-2  /* Added gap for spacing */
                  border border-white/5
                  shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]
              ">
                  {/* Diamond Image */}
                  <img 
                    src="/leaderboard/diamond-removebg-preview.png" 
                    alt="Points" 
                    className="w-5 h-5 object-contain"
                  />
                  
                  <span className="text-amber-400 font-black text-lg tracking-wide drop-shadow-sm">
                      +{mockQuizData.reward}
                  </span>
              </div>
            </div>

            {/* TIME BAR (Between Header & Question) */}
            <div className="relative z-30 w-full h-2.5 bg-white/5 rounded-full mb-8 overflow-hidden border border-white/5">
               <div 
                  className="h-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)] rounded-full"
                  style={{ animation: `shrink ${totalTime}s linear forwards` }}
               ></div>
            </div>

            {/* Question Title */}
            <h2 className="
              text-3xl font-light text-white 
              mb-10 tracking-tight leading-tight
              relative z-30
              min-h-[80px] flex items-center
            ">
              {mockQuizData.question}
            </h2>

            {/* Options List */}
            <div className="flex flex-col gap-4 relative z-30">
              {mockQuizData.options.map((option, index) => (
                  <button
                      key={index}
                      onClick={() => setSelectedOption(index)}
                      className={`
                          h-16 px-6 rounded-[32px]
                          flex items-center justify-between
                          backdrop-blur-[10px]
                          border transition-all duration-300
                          group
                          ${selectedOption === index 
                              ? 'bg-white/20 border-white/40 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] translate-y-[-2px]' 
                              : 'bg-white/5 border-white/5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-white/10 hover:translate-y-[-2px]'
                          }
                      `}
                  >
                      <span className="text-white font-medium text-lg tracking-wide">{option}</span>
                      
                      {/* CUSTOM BRANDED INDICATOR */}
                      <div className={`
                          w-8 h-8 rounded-full 
                          flex items-center justify-center
                          transition-all duration-300
                          ${selectedOption === index ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                      `}>
                          {selectedOption === index && (
                               <img 
                                  src="/incridea-logo.png" 
                                  alt="Selected" 
                                  className="w-100% h-100% object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                               />
                          )}
                      </div>
                  </button>
              ))}
            </div>

          </Glass>
        </div>
      </div>
    </>
  );
};

export default Quiz;