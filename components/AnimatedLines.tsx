"use client";

import { motion, MotionValue } from "framer-motion";

type AnimatedLinesProps = {
    parallaxX?: MotionValue<string>;
    parallaxY?: MotionValue<string>;
    opacity?: MotionValue<number>;
};

const LINES = [
    {
        // Gentle wave — top third
        d: "M-100,180 C200,80 400,280 650,160 C900,40 1100,240 1350,130 C1600,20 1750,180 2020,100",
        stroke: "var(--lagoon-mist)",
        strokeWidth: 1.5,
        opacity: 0.08,
        duration: "25s",
        delay: "0s",
        dashArray: "1000 500",
        reverse: false,
    },
    {
        // Deep flowing curve — upper-middle
        d: "M-50,320 C180,200 380,420 600,300 C820,180 1020,380 1240,270 C1460,160 1660,340 1970,240",
        stroke: "var(--arctic-glow)",
        strokeWidth: 2,
        opacity: 0.06,
        duration: "35s",
        delay: "2s",
        dashArray: "800 600",
        reverse: true,
    },
    {
        // Mid-section wave
        d: "M-80,500 C150,380 350,560 580,460 C810,360 1000,520 1220,430 C1440,340 1650,500 1950,400",
        stroke: "var(--lagoon-mist)",
        strokeWidth: 1,
        opacity: 0.1,
        duration: "30s",
        delay: "5s",
        dashArray: "1200 400",
        reverse: false,
    },
    {
        // Lower wave — subtle
        d: "M-120,680 C100,580 320,740 540,640 C760,540 980,700 1200,610 C1420,520 1620,680 1950,580",
        stroke: "var(--storm-slate)",
        strokeWidth: 0.8,
        opacity: 0.05,
        duration: "40s",
        delay: "1s",
        dashArray: "900 700",
        reverse: true,
    },
    {
        // Bottom area
        d: "M-60,820 C170,720 370,870 590,770 C810,670 1010,830 1230,740 C1450,650 1670,800 1960,710",
        stroke: "var(--lagoon-mist)",
        strokeWidth: 1.2,
        opacity: 0.07,
        duration: "28s",
        delay: "3s",
        dashArray: "700 800",
        reverse: false,
    },
    {
        // Very top — thin subtle
        d: "M-100,80 C200,30 450,130 700,60 C950,-10 1150,110 1400,50 C1650,-10 1800,80 2020,30",
        stroke: "var(--arctic-glow)",
        strokeWidth: 0.6,
        opacity: 0.04,
        duration: "45s",
        delay: "7s",
        dashArray: "1100 500",
        reverse: true,
    },
    {
        // Near bottom — wide lazy wave
        d: "M-80,940 C200,860 400,1000 650,910 C900,820 1100,960 1350,880 C1600,800 1780,920 2020,860",
        stroke: "var(--storm-slate)",
        strokeWidth: 1,
        opacity: 0.04,
        duration: "38s",
        delay: "4s",
        dashArray: "600 900",
        reverse: false,
    },
];

export function AnimatedLines({ parallaxX, parallaxY, opacity }: AnimatedLinesProps) {
    return (
        <motion.div
            style={{ opacity, x: parallaxX, y: parallaxY }}
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        >
            <svg
                className="w-full h-full"
                viewBox="0 0 1920 1080"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                {LINES.map((line, i) => (
                    <path
                        key={i}
                        d={line.d}
                        stroke={line.stroke}
                        strokeWidth={line.strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                        style={{
                            opacity: line.opacity,
                            strokeDasharray: line.dashArray,
                            animation: `${line.reverse ? "flow-line-reverse" : "flow-line"} ${line.duration} linear infinite`,
                            animationDelay: line.delay,
                        }}
                    />
                ))}
            </svg>
        </motion.div>
    );
}
