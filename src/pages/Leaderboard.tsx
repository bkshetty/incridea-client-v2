import { useState } from 'react';
import Slider from '../components/ui/Slider';
import Glass from '../components/ui/Glass';
import QuizModal from '../components/leaderboard/QuizModal';
import QuizView from '../components/leaderboard/QuizView';
import TaskView from '../components/leaderboard/TaskView';
import Crown from '../components/leaderboard/Crown';

// Mock Data
const leaderboardData = [
  { rank: 4, name: "TEST4", username: "@test4", avatar: "TEST4", reward: 999 },
  { rank: 5, name: "TEST5", username: "@test5", avatar: "TEST5", reward: 830 },
  { rank: 6, name: "TEST6", username: "@test6", avatar: "TEST6", reward: 680 },
  { rank: 7, name: "TEST7", username: "@test7", avatar: "TEST7", reward: 530 },
  { rank: 8, name: "TEST8", username: "@test8", avatar: "TEST8", reward: 412 },
];

const TABS = ["quiz", "leaderboard", "task"] as const;
type Tab = (typeof TABS)[number];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('leaderboard');
  const [showQuiz, setShowQuiz] = useState(false);

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

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'quiz') {
      setShowQuiz(true);
    }
  };

  const closeQuiz = () => {
    setShowQuiz(false);
    setActiveTab('leaderboard');
  };

  return (
    <>
      <style>{`
        @keyframes drop {
          0% { transform: translateY(-800px); opacity: 0; }
          60% { transform: translateY(20px); opacity: 1; }
          80% { transform: translateY(-10px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes cloudAppear {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes smokeBurst {
          0% { transform: scale(0.1) translate(0, 0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: scale(5) translate(0, -400px); opacity: 0; }
        }
        @keyframes smokeLeft {
          0% { transform: scale(0.1) translate(0, 0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: scale(4) translate(-400px, -300px); opacity: 0; }
        }
        @keyframes smokeRight {
          0% { transform: scale(0.1) translate(0, 0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: scale(4) translate(400px, -300px); opacity: 0; }
        }
        @keyframes smokeBottomLeft {
          0% { transform: scale(0.1) translate(0, 0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: scale(3.5) translate(-350px, 100px); opacity: 0; }
        }
        @keyframes smokeBottomRight {
          0% { transform: scale(0.1) translate(0, 0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: scale(3.5) translate(350px, 100px); opacity: 0; }
        }
        /* ✅ Character float animation */
        @keyframes floaty {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/temp_event_bg.png')" }}
      />

      <div className="w-full text-white p-2 sm:p-3 md:p-6 font-sans selection:bg-transparent min-h-[100svh] relative overflow-x-hidden">

        {/* Render Quiz Modal */}
        <QuizModal isOpen={showQuiz} onClose={closeQuiz} />

        <div className={`transition-all duration-300 ${showQuiz ? 'blur-md brightness-[0.4] pointer-events-none' : ''}`}>
          <div className="max-w-[1700px] mx-auto -mb-35 sm:mb-24 md:mb-32 lg:mb-40 px-2 sm:px-4 md:px-0">
            <div className="text-center mb-4 sm:mb-5 md:mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Incridea Leaderboard
              </h1>
            </div>

            <Slider
              activeTab={activeTab}
              setActiveTab={handleTabChange}
            />
          </div>

          {/* Quiz Modal */}
          <QuizModal isOpen={showQuiz} onClose={closeQuiz} />

          {/* Tab Content */}
          {activeTab === 'quiz' && <QuizView onStart={() => setShowQuiz(true)} />}
          {activeTab === 'task' && <TaskView />}

          {/* Leaderboard Content - Podium, Stats, and Top Performers */}
          {activeTab === 'leaderboard' && (
            <>
              <div className="max-w-[1850px] mx-auto mb-4 sm:mb-6 md:mb-9 px-6 sm:px-8 md:px-20 lg:px-32">
                <div className="flex justify-center items-end gap-3 sm:gap-4 md:gap-16 lg:gap-24 relative scale-[0.5] sm:scale-[0.65] md:scale-100 origin-bottom -my-8 sm:-my-4 md:my-0" style={{ perspective: '1200px' }}>

                  {/* Rank 2 */}
                  <div className="flex flex-col items-center animate-[drop_0.7s_ease-out_both]" style={{ transform: 'translateZ(-20px)', transformStyle: 'preserve-3d' }}>
                    <div className="relative mb-2 sm:mb-3 md:mb-4 group cursor-pointer">
                      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=TEST2" alt="TEST2" className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full border-3 md:border-4 border-gray-400/50 object-cover" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base mb-1 sm:mb-2">TEST2</h3>

                    <div className="relative w-52 h-56 bg-gradient-to-b from-gray-400/50 to-gray-700/50 border-t-4 border-x-2 border-gray-300/70 rounded-t-2xl backdrop-blur-xl"
                      style={{ transform: 'translateZ(15px) rotateY(-3deg) scaleX(0.95)', transformOrigin: 'bottom', transformStyle: 'preserve-3d' }}>
                      <div className="absolute -right-2 top-0 bottom-0 w-6 bg-gradient-to-b from-gray-500/90 to-gray-800/90 rounded-tr-2xl" style={{ transform: 'rotateY(12deg) translateX(1px)', transformOrigin: 'left', clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%)' }}></div>
                      <div className="absolute -left-2 top-0 bottom-0 w-6 bg-gradient-to-b from-gray-400/80 to-gray-700/80 rounded-tl-2xl" style={{ transform: 'rotateY(-12deg) translateX(-1px)', transformOrigin: 'right', clipPath: 'polygon(0% 0%, 50% 0%, 100% 100%, 0% 100%)' }}></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/40 rounded-t-2xl"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-t-2xl"></div>
                      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/10 to-transparent rounded-t-2xl"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="relative flex flex-col items-center justify-center h-full" style={{ transform: 'translateZ(30px)' }}>
                        <div className="text-7xl font-black text-gray-200/60 mb-3">2</div>
                        <div className="flex items-center gap-2">
                          <img src="/leaderboard/diamond-removebg-preview.png" alt="crystal" className="w-12 h-12 object-contain transition-all duration-300 hover:brightness-110 hover:scale-110 cursor-pointer" />
                          <span className="text-3xl font-black text-white">1231</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rank 1 */}
                  <div className="flex flex-col items-center -mt-8 sm:-mt-10 md:-mt-12 animate-[drop_0.7s_ease-out_both]" style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
                    <div className="absolute -top-8 sm:-top-9 md:-top-10 z-20">
                      <Crown className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
                    </div>

                    <div className="relative mb-2 sm:mb-3 md:mb-4 group cursor-pointer">
                      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=TEST1" alt="TEST1" className="relative w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full border-3 md:border-4 border-yellow-400/60 object-cover" />
                    </div>
                    <h3 className="font-black text-base sm:text-lg mb-1 sm:mb-2 bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">TEST1</h3>

                    <div className="relative w-56 h-80 bg-gradient-to-b from-yellow-400/50 to-amber-700/50 border-t-4 border-x-2 border-yellow-300/80 rounded-t-2xl backdrop-blur-xl"
                      style={{ transform: 'translateZ(35px) scaleX(0.95)', transformOrigin: 'bottom', transformStyle: 'preserve-3d' }}>
                      <div className="absolute -right-2.5 top-0 bottom-0 w-7 bg-gradient-to-b from-amber-500/90 to-amber-900/90 rounded-tr-2xl" style={{ transform: 'rotateY(8deg) translateX(1px)', transformOrigin: 'left', clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%)' }}></div>
                      <div className="absolute -left-2.5 top-0 bottom-0 w-7 bg-gradient-to-b from-yellow-400/80 to-amber-700/80 rounded-tl-2xl" style={{ transform: 'rotateY(-8deg) translateX(-1px)', transformOrigin: 'right', clipPath: 'polygon(0% 0%, 50% 0%, 100% 100%, 0% 100%)' }}></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/40 via-transparent to-amber-900/40 rounded-t-2xl"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-t-2xl"></div>
                      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-yellow-300/15 to-transparent rounded-t-2xl"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent"></div>
                      <div className="relative flex flex-col items-center justify-center h-full" style={{ transform: 'translateZ(40px)' }}>
                        <div className="text-8xl font-black text-yellow-200/70 mb-4">1</div>
                        <div className="flex items-center gap-2.5">
                          <img src="/leaderboard/diamond-removebg-preview.png" alt="crystal" className="w-18 h-18 object-contain transition-all duration-300 hover:brightness-110 hover:scale-110 cursor-pointer" />
                          <span className="text-5xl font-black bg-gradient-to-r from-yellow-200 to-amber-300 bg-clip-text text-transparent">1789</span>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center">

                      </div>
                    </div>
                  </div>

                  {/* Rank 3 */}
                  <div className="flex flex-col items-center animate-[drop_0.7s_ease-out_both]" style={{ transform: 'translateZ(-20px)', transformStyle: 'preserve-3d' }}>
                    <div className="relative mb-2 sm:mb-3 md:mb-4 group cursor-pointer">
                      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=TEST3" alt="TEST3" className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full border-3 md:border-4 border-orange-400/50 object-cover" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base mb-1 sm:mb-2">TEST3</h3>

                    <div className="relative w-52 h-44 bg-gradient-to-b from-orange-400/50 to-amber-700/50 border-t-4 border-x-2 border-orange-300/70 rounded-t-2xl backdrop-blur-xl"
                      style={{ transform: 'translateZ(15px) rotateY(3deg) scaleX(0.95)', transformOrigin: 'bottom', transformStyle: 'preserve-3d' }}>
                      <div className="absolute -right-2 top-0 bottom-0 w-6 bg-gradient-to-b from-orange-600/90 to-amber-900/90 rounded-tr-2xl" style={{ transform: 'rotateY(12deg) translateX(1px)', transformOrigin: 'left', clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%)' }}></div>
                      <div className="absolute -left-2 top-0 bottom-0 w-6 bg-gradient-to-b from-orange-400/80 to-amber-700/80 rounded-tl-2xl" style={{ transform: 'rotateY(-12deg) translateX(-1px)', transformOrigin: 'right', clipPath: 'polygon(0% 0%, 50% 0%, 100% 100%, 0% 100%)' }}></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-200/30 via-transparent to-amber-900/40 rounded-t-2xl"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-t-2xl"></div>
                      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-orange-300/10 to-transparent rounded-t-2xl"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="relative flex flex-col items-center justify-center h-full" style={{ transform: 'translateZ(30px)' }}>
                        <div className="text-7xl font-black text-orange-200/60 mb-3">3</div>
                        <div className="flex items-center gap-2">
                          <img src="/leaderboard/diamond-removebg-preview.png" alt="crystal" className="w-12 h-12 object-contain transition-all duration-300 hover:brightness-110 hover:scale-110 cursor-pointer" />
                          <span className="text-3xl font-black text-white">1099</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* User Stats Card */}
              <div className="max-w-[1200px] mx-auto mt-14 sm:mt-16 md:mt-8 lg:mt-12 relative z-30 px-4 sm:px-6 md:px-6 lg:px-8">
                <Glass
                  style={glassCardStyle}
                  hoverEffect={false}
                  className="rounded-xl p-3 sm:p-3.5 md:p-4 transition-all shadow-[0_0_28px_rgba(168,85,247,0.25)]"
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-2.5 md:gap-3">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-50"></div>
                        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=You" className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border-2 border-purple-500/40" alt="You" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs sm:text-sm font-bold text-white">Your Progress</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">Keep going!</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full md:w-auto md:gap-4 bg-white/5 md:bg-transparent p-2 md:p-0 rounded-lg">
                      <div className="text-center flex-1 md:flex-none">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Today</p>
                        <div className="flex items-center justify-center gap-1">
                          <img src="/leaderboard/diamond-removebg-preview.png" alt="crystal" className="w-7 h-7 md:w-9 md:h-9 object-contain drop-shadow-[0_0_12px_rgba(168,85,247,0.8)] transition-all duration-300 hover:brightness-110 hover:scale-110 cursor-pointer" />
                          <span className="text-base font-black text-white">5</span>
                        </div>
                      </div>
                      <div className="h-8 w-px bg-white/20"></div>
                      <div className="text-center flex-1 md:flex-none">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Rank</p>
                        <span className="text-base font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">-</span>
                      </div>
                      <div className="h-8 w-px bg-white/20"></div>
                      <div className="text-center flex-1 md:flex-none">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Total</p>
                        <span className="text-sm font-bold text-white">23,141</span>
                      </div>
                    </div>
                  </div>
                </Glass>
              </div>

              {/* Top Performers List */}
              <div className="mt-8 sm:mt-10 md:mt-12 pb-6 sm:pb-8 md:pb-10 px-3 sm:px-4 md:px-6 lg:px-8">
                <Glass
                  style={glassCardStyle}
                  hoverEffect={false}
                  className="w-full max-w-[1200px] mx-auto rounded-2xl p-4 sm:p-5 md:p-6"
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Top Performers</h2>
                    <Glass
                      style={glassCardStyle}
                      hoverEffect={false}
                      className="px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-lg"
                    >
                      <p className="text-[9px] sm:text-[10px] text-gray-400">Updated <span className="text-white font-bold">2m ago</span></p>
                    </Glass>
                  </div>

                  <div className="hidden md:grid grid-cols-12 px-6 mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-8">User</div>
                    <div className="col-span-3 text-right">Reward</div>
                  </div>

                  <div className="space-y-2 sm:space-y-2.5 md:space-y-2">
                    {leaderboardData.map((user, index) => (
                      <Glass
                        key={user.rank}
                        style={glassCardStyle}
                        hoverEffect={false}
                        className="rounded-xl p-2.5 sm:p-3 md:p-4 transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between gap-2 sm:gap-2.5 md:gap-3">
                          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 flex-1 min-w-0">
                            <div className="flex items-center justify-center w-7 sm:w-8 md:w-10">
                              <span className="font-black text-base sm:text-lg md:text-xl text-gray-400 group-hover:text-white group-hover:scale-110 transition-all">{user.rank}</span>
                            </div>
                            <div className="relative flex-shrink-0">
                              <div className={`absolute inset-0 rounded-full blur-sm opacity-50 ${index === 0 ? 'bg-blue-500/40' : index === 1 ? 'bg-purple-500/40' : 'bg-pink-500/40'}`}></div>
                              <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.avatar}`} className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-all" alt={user.name} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-xs sm:text-sm md:text-base text-white truncate">{user.name}</p>
                              <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 truncate">{user.username}</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className={`border border-white/10 rounded-lg px-1.5 sm:px-2 md:px-4 py-1 sm:py-1.5 backdrop-blur-md bg-white/5 flex flex-row items-center justify-center gap-0.5 sm:gap-1 md:gap-2 hover:scale-105 transition-all w-auto min-w-[80px] sm:min-w-[90px] md:min-w-[100px] lg:w-[150px] ${index === 0 ? 'border-blue-400/40' : index === 1 ? 'border-purple-400/40' : 'border-pink-400/40'}`}>
                              <img src="/leaderboard/diamond-removebg-preview.png" alt="crystal" className="w-5 h-5 sm:w-6 sm:h-6 md:w-9 md:h-9 object-contain flex-shrink-0 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all duration-300 hover:brightness-110 hover:scale-110 cursor-pointer" />
                              <span className="text-xs sm:text-sm md:text-lg font-black text-white whitespace-nowrap">{user.reward.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </Glass>
                    ))}
                  </div>
                </Glass>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
