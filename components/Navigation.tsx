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
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open (smooth, no jump)
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Save scroll position first
      const scrollY = window.scrollY;
      // Apply styles synchronously to prevent jump
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    } else {
      // Restore scroll smoothly
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.documentElement.style.scrollBehavior = '';
      if (scrollY) {
        window.scrollTo({ top: parseInt(scrollY || '0') * -1, behavior: 'auto' });
      }
    }
    
    return () => {
      // Cleanup on unmount
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.documentElement.style.scrollBehavior = '';
    };
  }, [isMobileMenuOpen]);

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
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={isMobileMenuOpen ? { rotate: 180, scale: 1.1 } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.3, type: 'spring' }}
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

      {/* Mobile Menu - Bottom Sheet Style */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              onTouchStart={(e) => {
                // Only close if touch starts on backdrop, not on the sheet
                if (e.target === e.currentTarget) {
                  setIsMobileMenuOpen(false);
                }
              }}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ 
                type: 'spring',
                damping: 40,
                stiffness: 600,
                mass: 0.6
              }}
              style={{ willChange: 'transform' }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white rounded-t-3xl shadow-2xl border-t border-gray-200 max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
              </div>

              {/* Header */}
              <div className="flex-shrink-0 px-6 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30"></div>
                      <div className="relative bg-white p-1.5 rounded-lg shadow-md">
                        <Image
                          src="/approved.png"
                          alt="Logo"
                          width={28}
                          height={28}
                          className="w-7 h-7 object-contain"
                        />
                      </div>
                    </div>
                    <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Navigation
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Menu Items - Scrollable Container */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <nav 
                  className="h-full overflow-y-auto overscroll-contain px-4 py-4 space-y-2"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.a
                        key={item.href}
                        href={item.href}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ 
                          delay: index * 0.05,
                          type: 'spring',
                          damping: 20
                        }}
                        className="group flex items-center gap-3 px-4 py-4 rounded-2xl text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium relative overflow-hidden active:scale-[0.98]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-active:opacity-100 transition-opacity duration-200"></div>
                        
                        {/* Icon */}
                        <div className="relative z-10 w-11 h-11 bg-gradient-to-br from-blue-50 to-purple-50 group-hover:from-blue-600 group-hover:to-purple-600 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0">
                          <Icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        
                        {/* Label */}
                        <span className="relative z-10 flex-1 text-base group-hover:text-white transition-colors">
                          {item.label}
                        </span>
                        
                        {/* Arrow */}
                        <motion.div
                          className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

