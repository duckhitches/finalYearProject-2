'use client';

import { motion } from 'framer-motion';


export default function ScatterText() {
    const text = "Welcome to Children's Rights Education";
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { 
            y: 20, 
            opacity: 0,
            scale: 0.8
        },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1
        },
        hover: {
            scale: 1.1,
            rotate: Math.random() * 30 - 15,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 10
            }
        }
    };

    return (
        <motion.div
            className="flex flex-wrap justify-center items-center gap-2 max-w-4xl mx-auto"
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    className="text-5xl font-bold inline-block"
                    variants={item}
                    whileHover="hover"
                    style={{ 
                        display: 'inline-block',
                        originX: 0.5,
                        originY: 0.5
                    }}
                >
                    {word}{" "}
                </motion.span>
            ))}
        </motion.div>
    );
} 