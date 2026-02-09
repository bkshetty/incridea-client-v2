import React from 'react';
import { Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import './Pronite.css';

interface ProniteCardProps {
    artistName: string;
    artistDate: string;
    artistImage: string; // URL to the image
    accentColor?: string; // Optional accent color for the gradient/glow
}

const ProniteCard: React.FC<ProniteCardProps> = ({ artistName, artistDate, artistImage, accentColor = '#D84D7D' }) => {

    const glitchVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            x: -50,
            filter: "hue-rotate(0deg) blur(0px)"
        },
        visible: {
            opacity: 1,
            scale: 1,
            // Slide in from -50 to 0, then shake
            x: [-50, 0, -10, 10, -5, 5, 0],
            // Glitch filter effect
            filter: ["hue-rotate(0deg) blur(0px)", "hue-rotate(90deg) blur(2px)", "hue-rotate(-45deg) blur(1px)", "hue-rotate(0deg) blur(0px)"],
            transition: {
                opacity: { type: "spring" as const, stiffness: 400, damping: 10 },
                scale: { type: "spring" as const, stiffness: 400, damping: 10 },
                x: {
                    duration: 0.6,
                    times: [0, 0.4, 0.5, 0.6, 0.7, 0.8, 1]
                },
                filter: { duration: 0.4, times: [0, 0.2, 0.6, 1] }
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            x: -20,
            filter: "blur(4px)",
            transition: { duration: 0.2 }
        }
    };

    const lightRayVariants = {
        hidden: { x: "-100%", opacity: 0 },
        visible: {
            x: "200%",
            opacity: [0, 1, 1, 0],
            transition: {
                duration: 0.8,
                ease: "easeInOut" as const,
                delay: 0.1 // Slight delay to sync with shake start
            }
        }
    };

    return (
        <motion.div
            className="pronite-card"
            style={{ '--accent-color': accentColor } as React.CSSProperties}
            variants={glitchVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Light Ray Overlay */}
            <motion.div
                className="light-ray"
                variants={lightRayVariants}
            />

            <div className="card-image-container">
                <img src={artistImage} alt={artistName} className="card-image" />
                <div className="card-icon">
                    <Mic size={24} color="white" />
                </div>
            </div>
            <div className="card-content">
                <h3 className="card-artist-name">{artistName}</h3>
                <p className="card-artist-date">{artistDate}</p>
            </div>
        </motion.div>
    );
};

export default ProniteCard;
