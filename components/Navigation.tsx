'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, User, Briefcase, Mail, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#home', label: 'Home', icon: Home },
    { href: '#about', label: 'About', icon: User },
    { href: '#projects', label: 'Projects', icon: Briefcase },
    { href: '#contact', label: 'Contact', icon: Mail },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full max-w-full ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo with Icon */}
          <Link 
            href="/" 
            className="flex items-center group"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-white p-1.5 sm:p-2 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
                <Image
                  src="/approved.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                  priority
                />
              </div>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="group relative px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span>{item.label}</span>
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden relative z-50 text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={isMobileMenuOpen ? { rotate: 90 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu - Side Panel like Admin */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Side Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: 'spring',
                damping: 30,
                stiffness: 300
              }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 backdrop-blur-xl shadow-2xl z-50 md:hidden flex flex-col border-l border-white/20"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30"></div>
                      <div className="relative bg-white p-1.5 rounded-lg shadow-md">
                        <Image
                          src="/approved.png"
                          alt="Logo"
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Menu
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Navigate through sections
                </p>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ 
                        delay: index * 0.05,
                        type: 'spring',
                        damping: 25
                      }}
                      className="group flex items-center gap-4 px-4 py-4 rounded-xl text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium relative overflow-hidden"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {/* Background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Icon */}
                      <div className="relative z-10 w-12 h-12 bg-gray-100 group-hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                        <Icon className="w-6 h-6 group-hover:text-white transition-colors" />
                      </div>
                      
                      {/* Label */}
                      <span className="relative z-10 flex-1 group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                      
                      {/* Arrow */}
                      <motion.div
                        className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ x: 3 }}
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    </motion.a>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
                <p className="text-xs text-center text-gray-500">
                  Tap outside to close
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

