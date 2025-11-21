'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, Linkedin, Mail, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/about')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAboutData(data.data);
        }
      });
  }, []);

  if (!aboutData) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden w-full max-w-full"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden w-full">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-80 sm:h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 sm:py-0 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
            >
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {aboutData.name}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl md:text-3xl text-gray-700 mb-3 sm:mb-4"
            >
              {aboutData.title}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl px-2 sm:px-0"
            >
              {aboutData.bio}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-4 justify-center lg:justify-start"
            >
              <a
                href={aboutData.socialLinks?.linkedin || '#'}
                target={aboutData.socialLinks?.linkedin ? '_blank' : undefined}
                rel={aboutData.socialLinks?.linkedin ? 'noopener noreferrer' : undefined}
                className="p-3 sm:p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors touch-manipulation shadow-lg hover:shadow-xl"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              {aboutData.socialLinks?.github && (
                <a
                  href={aboutData.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 sm:p-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors touch-manipulation shadow-lg hover:shadow-xl"
                >
                  <Github className="w-6 h-6" />
                </a>
              )}
              <a
                href={`mailto:${aboutData.email}`}
                className="p-3 sm:p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors touch-manipulation shadow-lg hover:shadow-xl"
                title="Send Email"
              >
                <Mail className="w-6 h-6" />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-8 lg:mt-0"
          >
            <div className="relative w-full aspect-square max-w-xs sm:max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl sm:rounded-3xl transform rotate-3 sm:rotate-6"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl sm:rounded-3xl transform -rotate-3 sm:-rotate-6"></div>
              <img
                src={aboutData.heroImage || aboutData.profileImage}
                alt={aboutData.name}
                className="relative w-full h-full object-cover rounded-2xl sm:rounded-3xl shadow-2xl"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.a
            href="#about"
            animate={{
              y: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/90 transition-colors cursor-pointer"
          >
            <ArrowDown className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

