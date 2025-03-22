'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Spline from '@splinetool/react-spline';

// Components
import WavyText from '@/components/WavyText';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import ScatterText from '@/components/ScatterText';

const cards = [
  {
    title: "Introduction to Rights",
    description: "Learn about the fundamental rights of children and their importance in society",
    background: "#ff0088"
  },
  {
    title: "Protection",
    description: "Understand child protection, safety measures, and creating secure environments",
    background: "#dd00ee"
  },
  {
    title: "Health",
    description: "Explore physical and mental health aspects of child well-being",
    background: "#9911ff"
  },
  {
    title: "Development",
    description: "Learn about physical, cognitive, social, and emotional development stages",
    background: "#0d63f8"
  },
  {
    title: "Participation",
    description: "Discover ways to participate in decisions and community activities",
    background: "#0cdcf7"
  }
];

export default function Home() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollContainerRef = useRef(null);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Scroll Progress Indicator */}
      <motion.div
        style={{
          scaleX,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 10,
          originX: 0,
          backgroundColor: "#ff0088",
          zIndex: 50
        }}
      />

      {/* Background Spline Animation */}
      <div className="fixed inset-0 -z-10 w-screen h-screen">
        <Spline scene="https://prod.spline.design/PxlLIrWAHl74rJQK/scene.splinecode" />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="backdrop-blur-sm bg-white/30 rounded-xl p-4 sm:p-6 md:p-8 w-full max-w-4xl mx-auto">
          <div className="space-y-6 sm:space-y-8">
            <ScatterText />
            <WavyText />
            
            {/* Signup Card */}
            <div className="mt-8 sm:mt-12 p-6 bg-white/20 backdrop-blur rounded-xl text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Join Our Learning Community</h3>
              <p className="text-sm sm:text-base mb-6 max-w-2xl mx-auto">
                Start your journey in understanding and promoting children&apos;s rights. 
                Sign up now to access our interactive learning modules and resources.
              </p>
              <motion.button
                onClick={() => router.push('/auth')}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up Now or Login
              </motion.button>
            </div>

            <div className="mt-8 sm:mt-12 h-[300px] sm:h-[400px] md:h-[500px] w-full">
              <Spline scene="https://prod.spline.design/Sr-WkqdF4UsC8Q0p/scene.splinecode" />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Cards Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
        <div className="backdrop-blur-sm bg-white/30 rounded-xl p-4 sm:p-6 md:p-8 w-full max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center">Explore Our Learning Modules</h2>
          <motion.div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 sm:pb-8 px-2 sm:px-4 snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#ff0088 transparent'
            }}
          >
            {cards.map((card, index) => (
              <motion.div
                key={index}
                className="flex-none w-[280px] sm:w-[320px] h-[200px] sm:h-[250px] rounded-xl p-4 sm:p-6 cursor-pointer snap-center"
                style={{ backgroundColor: card.background }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/')}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{card.title}</h3>
                <p className="text-sm sm:text-base text-white/80">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-transparent to-black/20">
        <div className="backdrop-blur-sm bg-white/30 rounded-xl p-4 sm:p-6 md:p-8 w-full max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Contact Me</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Get in Touch</h3>
              <p className="mb-2 text-sm sm:text-base">Email: shettennavareshan@gmail.com</p>
              <p className="mb-2 text-sm sm:text-base">Phone: +91 8792 190 189</p>
              <p className="text-sm sm:text-base">Address: Bangalore, India</p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Know More About Me</h3>
              <div className="flex gap-4">
                <a href="https://portfolio-eshan-2z6t.vercel.app/" className="text-sm sm:text-base hover:text-blue-500">Portfolio</a>
                <a href="https://www.linkedin.com/in/eshan-shettennavar/" className="text-sm sm:text-base hover:text-pink-600">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 md:px-8 bg-black/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center text-white/80">
          <p className="text-sm sm:text-base">© 2024 Children&apos;s Rights Education. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-4 sm:gap-8 text-sm sm:text-base">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </footer>

      {/* Loading Indicator */}
      <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8">
        <LoadingThreeDotsJumping />
      </div>
    </main>
  );
}
