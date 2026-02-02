import { motion } from 'framer-motion';

import bgOp from '../assets/bg-op.png';
import LiquidGlassCard from '../components/liquidglass/LiquidGlassCard';

const LeaderboardPage = () => {
    // Mock data matching the specifications
    const leaderboardData = [
        { rank: 1, name: "Jolie Joie", username: "@joliejoie", followers: 15420, points: 7000, reward: 100000 },
        { rank: 2, name: "Brian Ngo", username: "@brianngo", followers: 14200, points: 2000, reward: 50000 },
        { rank: 3, name: "David Do", username: "@daviddo", followers: 13100, points: 2000, reward: 20000 },
        { rank: 4, name: "Henrions D'Connell", username: "@herri crts", followers: 12241, points: 2114424, reward: 1000 },
        { rank: 5, name: "Jeremiah Dooley", username: "@jeremiah", followers: 11500, points: 1845200, reward: 500 },
        { rank: 6, name: "Amelia Morar", username: "@amelia", followers: 10800, points: 1540320, reward: 250 },
        { rank: 7, name: "Victor Plains", username: "@victor", followers: 9200, points: 1203000, reward: 100 },
        { rank: 8, name: "Christina Soler", username: "@chris", followers: 8500, points: 1100200, reward: 50 },
    ];

    const topThree = leaderboardData.slice(0, 3);
    const positions4and5 = leaderboardData.slice(3, 5); // Only positions 4 and 5

    // Mock current user (not in top 5)
    const currentUser = { rank: 12, name: "You", username: "@currentuser", followers: 5200, points: 850000, reward: 10 };
    const showCurrentUser = currentUser.rank > 5;

    return (
        <>
            {/* Background - Centered, brighter with gradient overlay */}
            <div className="fixed inset-0 w-full h-full -z-50">
                {/* Background image - centered and brighter */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[1.3] contrast-[1.1]"
                    style={{ backgroundImage: `url(${bgOp})` }}
                />
                {/* Vibrant gradient overlay for festival vibe */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/20" />
                {/* Radial glow effect */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent" />
            </div>

            {/* Container - Full width with minimal padding */}
            <div className="py-10 px-2 sm:px-15 w-full min-h-screen flex flex-col justify-center items-center overflow-hidden">
                {/* UNIFIED CARD */}
                <motion.div
                    className="relative z-10 w-full"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <LiquidGlassCard className="p-4 sm:p-6 md:p-8 lg:p-12 !rounded-3xl overflow-hidden border-2 border-white/20 shadow-[0_0_80px_rgba(34,211,238,0.15)]">

                        <div className="space-y-8">

                            {/* 1. Navigation Tabs - Vibrant festival-themed */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-center"
                            >
                                <div className="inline-flex items-center gap-1 p-1.5 bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-full border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_40px_rgba(34,211,238,0.1)]">
                                    <button className="px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all text-xs sm:text-sm font-semibold">
                                        Quiz
                                    </button>
                                    <button className="px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold transition-all text-xs sm:text-sm shadow-lg hover:shadow-cyan-500/50 hover:scale-105">
                                        Leaderboard
                                    </button>
                                    <button className="px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all text-xs sm:text-sm font-semibold">
                                        Task
                                    </button>
                                </div>
                            </motion.div>

                            {/* 2. Prize Podium Section - Dual Layout (Mobile vs Desktop) */}

                            {/* MOBILE PODIUM (New Design) - Floating avatars, no cards */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex md:hidden items-end justify-center w-full px-4 mt-8 mb-8"
                            >
                                {/* 2nd Place (Left) */}
                                <div className="flex flex-col items-center z-10 -mr-4 mb-4">
                                    <div className="relative">
                                        <motion.div
                                            className="w-20 h-20 rounded-full shadow-xl relative z-10"
                                            whileHover={{
                                                scale: 1.1,
                                                transition: { duration: 0.3, ease: "easeOut" }
                                            }}
                                            animate={{
                                                y: -10,
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                repeatType: "mirror",
                                                ease: "easeInOut",
                                                delay: 0.3
                                            }}
                                        >
                                            <img
                                                src="/chill.jpg"
                                                alt={topThree[1].name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </motion.div>
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 w-6 h-6 rounded-full bg-[#C0C0C0] text-slate-900 flex items-center justify-center text-xs font-bold shadow-lg">
                                            2
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <h3 className="text-white font-bold text-sm truncate max-w-[80px]">{topThree[1].name}</h3>
                                        <div className="flex items-center justify-center gap-1 text-xs text-white font-bold">
                                            <img src="/leaderboard/diamond-removebg-preview.png" className="w-3 h-3" alt="pts" />
                                            {topThree[1].points}
                                        </div>
                                    </div>
                                </div>

                                {/* 1st Place (Center) - Higher & Larger */}
                                <div className="flex flex-col items-center z-20 mb-12">
                                    <div className="relative">
                                        <motion.div
                                            className="w-28 h-28 rounded-full shadow-2xl relative z-10"
                                            whileHover={{
                                                scale: 1.1,
                                                transition: { duration: 0.3, ease: "easeOut" }
                                            }}
                                            animate={{
                                                y: -10,
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                repeatType: "mirror",
                                                ease: "easeInOut",
                                                delay: 0.1
                                            }}
                                        >
                                            <img
                                                src="/chill.jpg"
                                                alt={topThree[0].name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </motion.div>
                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 w-8 h-8 rounded-full bg-[#D4AF37] text-slate-900 flex items-center justify-center text-sm font-bold shadow-lg">
                                            1
                                        </div>
                                    </div>
                                    <div className="mt-5 text-center">
                                        <h3 className="text-white font-bold text-base truncate max-w-[110px]">{topThree[0].name}</h3>
                                        <div className="flex items-center justify-center gap-1 text-sm text-white font-bold">
                                            <img src="/leaderboard/diamond-removebg-preview.png" className="w-4 h-4" alt="pts" />
                                            {topThree[0].points}
                                        </div>
                                    </div>
                                </div>

                                {/* 3rd Place (Right) */}
                                <div className="flex flex-col items-center z-10 -ml-4 mb-4">
                                    <div className="relative">
                                        <motion.div
                                            className="w-20 h-20 rounded-full shadow-xl relative z-10"
                                            whileHover={{
                                                scale: 1.1,
                                                transition: { duration: 0.3, ease: "easeOut" }
                                            }}
                                            animate={{
                                                y: -10,
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                repeatType: "mirror",
                                                ease: "easeInOut",
                                                delay: 0.5
                                            }}
                                        >
                                            <img
                                                src="/chill.jpg"
                                                alt={topThree[2].name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </motion.div>
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 w-6 h-6 rounded-full bg-[#CD7F32] text-slate-900 flex items-center justify-center text-xs font-bold shadow-lg">
                                            3
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <h3 className="text-white font-bold text-sm truncate max-w-[80px]">{topThree[2].name}</h3>
                                        <div className="flex items-center justify-center gap-1 text-xs text-white font-bold">
                                            <img src="/leaderboard/diamond-removebg-preview.png" className="w-3 h-3" alt="pts" />
                                            {topThree[2].points}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* DESKTOP PODIUM (Existing Design) - Grid hidden on mobile */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="hidden md:grid md:grid-cols-3 gap-8 lg:gap-12 items-end justify-items-center px-4 py-8 mt-20"
                            >
                                {/* Left Card - 2nd Place (Silver) */}
                                <PodiumCard
                                    player={topThree[1]}
                                    tier="silver"
                                    delay={0.3}
                                />

                                {/* Center Card - 1st Place (Gold) - LARGER */}
                                <PodiumCard
                                    player={topThree[0]}
                                    tier="gold"
                                    delay={0.1}
                                    isCenter
                                />

                                {/* Right Card - 3rd Place (Bronze) */}
                                <PodiumCard
                                    player={topThree[2]}
                                    tier="bronze"
                                    delay={0.5}
                                />
                            </motion.div>

                            {/* Countdown below center card */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-center"
                            >
                                <p className="text-gray-400 text-sm">
                                    Ends in <span className="text-white font-mono font-semibold">10d 23h 58m 23s</span>
                                </p>
                            </motion.div>

                            {/* 4. Leaderboard Table - Only positions 4 and 5 */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className="w-full space-y-3 px-4"
                            >
                                {/* Table Header - Professional layout - Optimized for mobile no-overlap */}
                                <div className="grid grid-cols-12 gap-1 sm:gap-4 px-2 sm:px-6 py-3 text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                    <div className="col-span-1">Rank</div>
                                    <div className="col-span-5 pl-1">User</div>
                                    <div className="col-span-3 lg:col-span-4 text-center">Points</div>
                                    <div className="col-span-3 lg:col-span-2 text-right">Reward</div>
                                </div>

                                {/* Table Rows - Only 4th and 5th positions */}
                                <div className="space-y-2">
                                    {positions4and5.map((player, index) => (
                                        <motion.div
                                            key={player.rank}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1 + index * 0.1 }}
                                            className="grid grid-cols-12 gap-1 sm:gap-4 px-2 py-3 sm:px-4 sm:py-3.5 md:px-6 md:py-4 items-center bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                                        >
                                            {/* Rank - Fixed width container for alignment */}
                                            <div className="col-span-1 text-white font-bold text-sm sm:text-lg pl-1 min-w-[20px] sm:min-w-[24px] text-center">
                                                {player.rank}
                                            </div>

                                            {/* User with chill.jpg avatar - Consistent padding from rank */}
                                            <div className="col-span-5 flex items-center gap-2 sm:gap-3 overflow-hidden pl-2 sm:pl-0">
                                                <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full overflow-hidden shadow-lg ring-1 sm:ring-2 ring-white/20 flex-shrink-0">
                                                    <img
                                                        src="/chill.jpg"
                                                        alt={player.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col min-w-0 flex-1">
                                                    <span className="text-white font-semibold text-[10px] xs:text-xs sm:text-sm truncate">
                                                        {player.name}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Points with diamond animation - No overlap */}
                                            <div className="col-span-3 lg:col-span-4 flex items-center justify-center gap-1 sm:gap-2">
                                                <motion.img
                                                    src="/leaderboard/diamond-removebg-preview.png"
                                                    alt="Diamond"
                                                    className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                                                    animate={{
                                                        rotate: [0, 10, -10, 0],
                                                        scale: [1, 1.1, 1],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                                <span className="text-white font-mono font-semibold text-[10px] xs:text-xs sm:text-sm">
                                                    {player.points.toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Reward - only show for ranks 1-5 */}
                                            <div className="col-span-3 lg:col-span-2 flex items-center justify-end">
                                                {player.rank <= 5 ? (
                                                    <span className="text-cyan-400 font-bold text-[10px] xs:text-xs sm:text-sm whitespace-nowrap">
                                                        ₹{player.reward.toLocaleString()}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 text-[10px] xs:text-sm">-</span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Separator dots if current user is not in top 5 */}
                                {showCurrentUser && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.3 }}
                                        className="flex justify-center py-4"
                                    >
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-400/50"></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-400/50"></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-400/50"></div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Current User Position - with spacing */}
                                {showCurrentUser && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.4 }}
                                        className="mt-6"
                                    >
                                        <div className="grid grid-cols-12 gap-1 sm:gap-4 px-2 py-3 sm:px-4 sm:py-3.5 md:px-6 md:py-4 items-center bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border-2 border-cyan-400/50 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                                            {/* Rank - Fixed width container for alignment */}
                                            <div className="col-span-1 text-white font-bold text-sm sm:text-lg pl-1 min-w-[20px] sm:min-w-[24px] text-center">
                                                {currentUser.rank}
                                            </div>

                                            {/* User with chill.jpg avatar - Consistent padding from rank */}
                                            <div className="col-span-5 flex items-center gap-2 sm:gap-3 overflow-hidden pl-2 sm:pl-0">
                                                <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full overflow-hidden shadow-lg ring-1 sm:ring-2 ring-cyan-400/50 flex-shrink-0">
                                                    <img
                                                        src="/chill.jpg"
                                                        alt={currentUser.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col min-w-0 flex-1">
                                                    <span className="text-white font-semibold text-[10px] xs:text-xs sm:text-sm truncate">
                                                        {currentUser.name}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Points with diamond animation */}
                                            <div className="col-span-3 lg:col-span-4 flex items-center justify-center gap-1 sm:gap-2">
                                                <motion.img
                                                    src="/leaderboard/diamond-removebg-preview.png"
                                                    alt="Diamond"
                                                    className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                                                    animate={{
                                                        rotate: [0, 10, -10, 0],
                                                        scale: [1, 1.1, 1],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                                <span className="text-white font-mono font-semibold text-[10px] xs:text-xs sm:text-sm">
                                                    {currentUser.points.toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Reward - only show if rank <= 5 */}
                                            <div className="col-span-3 lg:col-span-2 flex items-center justify-end">
                                                {currentUser.rank <= 5 ? (
                                                    <span className="text-cyan-400 font-bold text-[10px] xs:text-xs sm:text-sm whitespace-nowrap">
                                                        ₹{currentUser.reward.toLocaleString()}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 text-[10px] xs:text-sm">-</span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>

                        </div>
                    </LiquidGlassCard>
                </motion.div>
            </div>
        </>
    );
};

interface Player {
    rank: number;
    name: string;
    username: string;
    followers: number;
    points: number;
    reward: number;
}

interface PodiumCardProps {
    player: Player;
    tier: 'gold' | 'silver' | 'bronze';
    delay: number;
    isCenter?: boolean;
}

const PodiumCard = ({ player, tier, delay, isCenter = false }: PodiumCardProps) => {


    const getGlowColor = () => {
        // Top and side shadows only - no bottom glow for open-bottom effect
        if (tier === 'gold') return 'shadow-[0_-8px_32px_rgba(234,179,8,0.4),-8px_0_32px_rgba(234,179,8,0.3),8px_0_32px_rgba(234,179,8,0.3)]';
        if (tier === 'silver') return 'shadow-[0_-8px_32px_rgba(148,163,184,0.4),-8px_0_32px_rgba(148,163,184,0.3),8px_0_32px_rgba(148,163,184,0.3)]';
        return 'shadow-[0_-8px_32px_rgba(251,146,60,0.4),-8px_0_32px_rgba(251,146,60,0.3),8px_0_32px_rgba(251,146,60,0.3)]';
    };

    const getBorderColor = () => {
        if (tier === 'gold') return 'border-yellow-400/30';
        if (tier === 'silver') return 'border-gray-300/30';
        return 'border-orange-400/30';
    };

    // Height hierarchy with responsive scaling - smaller for mobile
    const getCardHeight = () => {
        if (tier === 'gold') return 'h-[380px] sm:h-[500px] md:h-[580px]';      // 1st place
        if (tier === 'silver') return 'h-[330px] sm:h-[430px] md:h-[500px]';    // 2nd place
        return 'h-[290px] sm:h-[380px] md:h-[440px]';                           // 3rd place
    };

    const cardSize = isCenter
        ? `w-full max-w-[380px] ${getCardHeight()}`
        : `w-full max-w-[320px] ${getCardHeight()}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                delay,
                duration: 0.8,
                type: 'spring',
                bounce: 0.4
            }}
            whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 }
            }}
            className={`${cardSize} relative`}
        >
            {/* Avatar positioned on top edge - like ----o---- */}
            <motion.div
                className={`absolute -top-16 left-1/2 -translate-x-1/2 z-30 ${isCenter ? 'w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36' : 'w-24 h-24 sm:w-26 sm:h-26 md:w-28 md:h-28'} rounded-full overflow-hidden shadow-2xl ring-4 ring-white/40 cursor-pointer will-change-transform`}
                whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.3, ease: "easeOut" }
                }}
                animate={{
                    y: -10,
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: delay
                }}
            >
                <img
                    src="/chill.jpg"
                    alt={player.name}
                    className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20" />
            </motion.div>

            {/* Enhanced glass card with 3D effects - no bottom border */}
            <div
                className={`
                    w-full h-full
                    bg-white/10 backdrop-blur-xl 
                    border-t-2 border-l-2 border-r-2 ${getBorderColor()}
                    rounded-t-3xl 
                    ${getGlowColor()}
                    px-4 py-8
                    flex flex-col items-center justify-between
                    relative overflow-hidden
                    hover:bg-white/15 transition-all duration-300
                    transform-gpu
                `}
                style={{
                    maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                }}
            >
                {/* Subtle highlight gradient at top */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                {/* Animated glow effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 pointer-events-none"
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Content - with top spacing for avatar */}
                <div className="relative z-10 flex flex-col items-center w-full space-y-1 pt-12">
                    {/* Name with spacing from avatar to prevent overlap on hover */}
                    <h3 className={`text-white font-black text-center ${isCenter ? 'text-lg sm:text-xl md:text-2xl mt-8' : 'text-base sm:text-lg md:text-xl mt-2'} tracking-tight`}>
                        {player.name}
                    </h3>

                    {/* Trophy Image Asset */}
                    <motion.img
                        src={`/leaderboard/${tier}.png`}
                        alt={`${tier} trophy`}
                        className={`${isCenter ? 'w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56' : 'w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44'} object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]`}
                        animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 3, -3, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Points with diamond animation - shifted left */}
                    <div className={`flex flex-col items-center gap-2 -ml-2 ${tier === 'bronze' ? '-mt-6' : ''}`}>
                        <div className="flex items-center gap-2">
                            <motion.img
                                src="/leaderboard/diamond-removebg-preview.png"
                                alt="Diamond"
                                className={`${isCenter ? 'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8' : 'w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7'} object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]`}
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.15, 1],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: delay * 0.5
                                }}
                            />
                            <span className={`text-white font-black font-mono ${isCenter ? 'text-xl sm:text-2xl md:text-3xl' : 'text-lg sm:text-xl md:text-2xl'} tracking-tight`}>
                                {player.points.toLocaleString()}
                            </span>
                        </div>
                        <span className="text-gray-400 text-xs uppercase tracking-widest font-semibold">
                            Points
                        </span>
                    </div>
                </div>

                {/* Reward section - professional, theme colors */}
                <div className="relative z-10 flex flex-col items-center space-y-1 w-full pb-2">
                    <span className={`text-white font-bold ${isCenter ? 'text-lg sm:text-xl md:text-2xl' : 'text-base sm:text-lg md:text-xl'} tracking-tight`}>
                        ₹{player.reward.toLocaleString()}
                    </span>
                    <span className="text-gray-400 text-xs uppercase tracking-widest font-semibold">
                        Reward
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default LeaderboardPage;

