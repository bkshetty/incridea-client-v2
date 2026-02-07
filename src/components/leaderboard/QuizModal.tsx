import { useEffect, useState, useRef } from "react"; // 1. Import useRef
import Glass from "../ui/Glass";
import { Clock, X } from "lucide-react";

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
  
  // 2. Create a ref for the video element
  const videoRef = useRef<HTMLVideoElement>(null);

  const totalTime = 10;

  /* ---------------- TIMER & VIDEO SPEED ---------------- */

  useEffect(() => {
    if (!isOpen) return;

    // Reset Timer
    setTimeLeft(totalTime);
    setSelectedOption(null);

    // 3. Set Video Speed to 1.2x
    if (videoRef.current) {
        videoRef.current.playbackRate = 1.2;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      
      {/* OUTER CONTAINER: Centered */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        
        {/* BACKDROP */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          onClick={onClose}
        />

        {/* MODAL WRAPPER */}
        <div className="relative w-full max-w-[450px]">
          
          {/* EXIT BUTTON (OUTSIDE) */}
          <button 
              onClick={onClose}
              className="
                absolute -top-12 right-0 
                text-white/60 hover:text-white 
                bg-white/5 hover:bg-white/10
                backdrop-blur-md
                p-2 rounded-full 
                transition-all duration-300
                z-50
              "
          >
              <X size={24} />
          </button>

          {/* GLASS CARD */}
          <Glass className="
            relative
            rounded-[32px]
            p-6 pt-5
            border border-white/10
            shadow-[0_0_50px_rgba(0,0,0,0.6)]
            flex flex-col
          ">
            
            {/* 1. HEADER: Timer (Left) + Points (Right) */}
            <div className="flex justify-between items-center mb-0 relative z-30 shrink-0">
              
              {/* TIMER PILL */}
              <div className="
                  relative h-[30px]
                  bg-black/40 backdrop-blur-md
                  rounded-full
                  flex items-center justify-center
                  px-3 gap-2
                  border border-white/5
              ">
                  <Clock size={16} className={`${timeLeft <= 3 ? 'text-red-400' : 'text-white/70'}`} />
                  <span className={`text-sm font-black tracking-wide ${timeLeft <= 3 ? 'text-red-400' : 'text-white'}`}>
                      {Math.ceil(timeLeft)}s
                  </span>
              </div>

              {/* POINTS PILL */}
              <div className="
                  relative h-[30px]
                  bg-black/40 backdrop-blur-md
                  rounded-full
                  flex items-center justify-center
                  px-3 gap-2
                  border border-white/5
              ">
                  <img 
                    src="/leaderboard/diamond-removebg-preview.png" 
                    alt="Points" 
                    className="w-4 h-4 object-contain"
                  />
                  <span className="text-amber-400 font-black text-sm tracking-wide">
                      +{mockQuizData.reward}
                  </span>
              </div>
            </div>

            {/* 2. VIDEO CONTAINER */}
            <div className="relative z-30 flex justify-center mb-4 -mt-10 shrink-0 pointer-events-none">
               <div className="
                  relative 
                  w-40            
                  aspect-square   
                  -mt-4
                  rounded-2xl 
                  overflow-hidden 
                  
                  bg-black/40
                  shadow-[0_10px_30px_rgba(0,0,0,0.5)]
               ">
                  <video
                    ref={videoRef} // 4. Attach the Ref here
                    src="/character.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
               </div>
            </div>

            {/* 3. TIME BAR */}
            <div className="relative z-30 w-full h-1 bg-white/5 rounded-full mb-5 overflow-hidden border border-white/5 shrink-0">
               <div 
                  className="h-full bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] rounded-full"
                  style={{ animation: `shrink ${totalTime}s linear forwards` }}
               ></div>
            </div>

            {/* 4. QUESTION */}
            <h3 className="
              text-lg sm:text-xl font-semibold text-white 
              mb-5 tracking-tight leading-snug
              text-center
              relative z-30
              shrink-0
              drop-shadow-md
            ">
              {mockQuizData.question}
            </h3>

            {/* 5. OPTIONS */}
            <div className="flex flex-col gap-2.5 relative z-30 justify-center">
              {mockQuizData.options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => setSelectedOption(index)}
                    className={`
                        min-h-[50px] px-5 py-2 rounded-[18px]
                        flex items-center justify-between
                        backdrop-blur-[12px]
                        border transition-all duration-300
                        group
                        text-left
                        ${selectedOption === index 
                            ? 'bg-white/20 border-white/50 shadow-[0_8px_25px_-5px_rgba(255,255,255,0.15)] translate-y-[-1px]' 
                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                        }
                    `}
                >
                    <span className="text-gray-100 font-medium text-sm leading-tight pr-2">
                      {option}
                    </span>
                    
                    {/* CUSTOM INDICATOR */}
                    <div className={`
                        w-8 h-8 flex-shrink-0 rounded-full 
                        flex items-center justify-center
                        transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
                        ml-2
                        ${selectedOption === index ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-180'}
                    `}>
                        {selectedOption === index && (
                             <img 
                                src="/incridea-logo.png" 
                                alt="Selected" 
                                className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                             />
                        )}
                    </div>
                </button>
              ))}
            </div>

            {/* 6. SUBMIT BUTTON */}
            <div className="mt-6 flex justify-end relative z-30 shrink-0">
              <button className="group relative rounded-full transition-transform active:scale-95 outline-none">
                 <Glass className="
                    px-10 py-3 
                    rounded-full 
                    border border-white/10 group-hover:border-white/25
                    bg-white/5 group-hover:bg-white/10 
                    shadow-[0_0_20px_rgba(0,0,0,0.2)] 
                    transition-all duration-300
                    flex items-center justify-center
                 ">
                    <span className="text-sm font-bold text-white tracking-wide drop-shadow-md">
                      Submit
                    </span>
                 </Glass>
              </button>
            </div>

          </Glass>
        </div>
      </div>
    </>
  );
}