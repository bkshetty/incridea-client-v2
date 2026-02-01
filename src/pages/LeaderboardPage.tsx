
import { motion } from 'framer-motion';
import bgOp from '../assets/bg-op.png';

const LeaderboardPage = () => {
    // Mock data for the sketch
    const leaderboardData = [
        { rank: 1, name: "Alice", score: 1500 },
        { rank: 2, name: "Bob", score: 1200 },
        { rank: 3, name: "Charlie", score: 1100 },
        { rank: 4, name: "David", score: 950 },
        { rank: 5, name: "Eve", score: 900 },
    ];

    return (
        <div className="min-h-screen text-white pt-24 px-4 flex flex-col items-center relative overflow-hidden">
            {/* Fixed Background */}
            <div
                className="fixed inset-0 w-full h-full -z-50 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${bgOp})` }}
            />

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent relative z-10"
            >
                Leaderboard
            </motion.h1>

            <div className="w-full max-w-4xl bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 p-6 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="px-6 py-4 text-cyan-400 font-semibold uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-4 text-cyan-400 font-semibold uppercase tracking-wider">Player</th>
                                <th className="px-6 py-4 text-cyan-400 font-semibold uppercase tracking-wider text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {leaderboardData.map((player) => (
                                <tr key={player.rank} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 text-xl font-bold text-gray-300">
                                        #{player.rank}
                                    </td>
                                    <td className="px-6 py-4 text-lg text-gray-100 font-medium">
                                        {player.name}
                                    </td>
                                    <td className="px-6 py-4 text-lg text-right text-emerald-400 font-mono">
                                        {player.score.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="mt-8 text-gray-500 italic">
                * This is a sketch. Real data integration coming soon.
            </p>
        </div>
    );
};

export default LeaderboardPage;
