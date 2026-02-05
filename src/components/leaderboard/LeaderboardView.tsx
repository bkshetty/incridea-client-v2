import Glass from "../ui/Glass";

const leaderboardData = [
  { rank: 4, name: "TEST4", username: "@test4", avatar: "TEST4", reward: 999 },
  { rank: 5, name: "TEST5", username: "@test5", avatar: "TEST5", reward: 830 },
  { rank: 6, name: "TEST6", username: "@test6", avatar: "TEST6", reward: 680 },
  { rank: 7, name: "TEST7", username: "@test7", avatar: "TEST7", reward: 530 },
  { rank: 8, name: "TEST8", username: "@test8", avatar: "TEST8", reward: 412 },
];

export default function LeaderboardView() {
  return (
    <div className="text-white">
      {/* Podium Section */}
      <div className="max-w-5xl mx-auto mb-9">
        <div
          className="flex justify-center items-end gap-3 md:gap-9 relative scale-[0.6] sm:scale-[0.8] md:scale-100 origin-bottom -my-16 sm:-my-10 md:my-0"
          style={{ perspective: "1200px" }}
        >
          {/* Rank 2 */}
          <div className="flex flex-col items-center animate-[drop_0.7s_ease-out_both]">
            <img
              src="https://api.dicebear.com/7.x/bottts/svg?seed=TEST2"
              className="w-20 h-20 rounded-full border-4 border-gray-400/50 mb-3"
            />
            <h3 className="font-bold mb-2">TEST2</h3>
            <div className="w-40 h-40 bg-gray-500/40 rounded-t-2xl flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-gray-300">2</span>
              <span className="font-black">1231</span>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center -mt-12 animate-[drop_0.7s_ease-out_both]">
            <span className="text-4xl mb-2">👑</span>
            <img
              src="https://api.dicebear.com/7.x/bottts/svg?seed=TEST1"
              className="w-24 h-24 rounded-full border-4 border-yellow-400/60 mb-3"
            />
            <h3 className="font-black bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
              TEST1
            </h3>
            <div className="w-44 h-56 bg-yellow-500/40 rounded-t-2xl flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-yellow-200">1</span>
              <span className="text-xl font-black">1789</span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center animate-[drop_0.7s_ease-out_both]">
            <img
              src="https://api.dicebear.com/7.x/bottts/svg?seed=TEST3"
              className="w-20 h-20 rounded-full border-4 border-orange-400/50 mb-3"
            />
            <h3 className="font-bold mb-2">TEST3</h3>
            <div className="w-40 h-40 bg-orange-500/40 rounded-t-2xl flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-orange-200">3</span>
              <span className="font-black">1099</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <Glass className="border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Your Progress</p>
              <p className="text-xs text-gray-400">Keep going!</p>
            </div>
            <span className="font-black">23,141</span>
          </div>
        </Glass>
      </div>

      {/* Top Performers */}
      <div className="max-w-5xl mx-auto mt-12 px-4 pb-10">
        <h2 className="text-2xl font-black mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Top Performers
        </h2>

        <div className="space-y-2">
          {leaderboardData.map((user) => (
            <Glass
              key={user.rank}
              className="border border-white/10 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="font-black text-gray-400">{user.rank}</span>
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.avatar}`}
                  className="w-10 h-10 rounded-full border border-white/20"
                />
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.username}</p>
                </div>
              </div>
              <span className="font-black">{user.reward}</span>
            </Glass>
          ))}
        </div>
      </div>
    </div>
  );
}
