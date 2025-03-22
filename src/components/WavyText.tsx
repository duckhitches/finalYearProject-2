'use client';

import { motion, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function WavyText() {
    const [text] = useState("Education");
    const characters = Array.from(text);

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
        }),
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
                repeat: Infinity,
                repeatType: "mirror",
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
    };

    return (
        <div className="text-center">
            <motion.p 
                className="text-2xl sm:text-3xl md:text-4xl font-bold inline-flex flex-wrap justify-center items-center gap-[2px] sm:gap-1"
            >
                <span className="whitespace-nowrap">Empowering Children through</span>{" "}
                <motion.span
                    className="inline-flex"
                    variants={container}
                    initial="hidden"
                    animate="visible"
                >
                    {characters.map((character, index) => (
                        <motion.span
                            key={index}
                            variants={child}
                            className="inline-block"
                        >
                            {character === " " ? "\u00A0" : character}
                        </motion.span>
                    ))}
                </motion.span>
            </motion.p>
        </div>
    );
} 