'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Target, Heart, Linkedin, Download } from 'lucide-react';

export default function About() {
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
      <section id="about" className="py-20 bg-white">
        <div className="text-center">Loading...</div>
      </section>
    );
  }

  const features = [
    {
      icon: Users,
      title: 'Teamwork',
      description: 'Experience working with diverse teams through student projects and organizations.',
    },
    {
      icon: Target,
      title: 'Strategic Thinking',
      description: 'Combination of marketing knowledge and HR approach to achieve goals.',
    },
    {
      icon: Heart,
      title: 'Passion for HR',
      description: 'Deep desire to work with people and develop talents.',
    },
    {
      icon: Award,
      title: 'Continuous Learning',
      description: 'Actively following trends in HR and marketing through education and practice.',
    },
  ];

  return (
    <section id="about" className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl sm:rounded-2xl transform rotate-2 sm:rotate-3"></div>
              <img
                src={aboutData.profileImage}
                alt={aboutData.name}
                className="relative w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl sm:rounded-2xl shadow-xl"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {aboutData.name}
              </h3>
              <a
                href={aboutData.socialLinks?.linkedin || '#'}
                target={aboutData.socialLinks?.linkedin ? '_blank' : undefined}
                rel={aboutData.socialLinks?.linkedin ? 'noopener noreferrer' : undefined}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors touch-manipulation shadow-md hover:shadow-lg"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 mb-4 sm:mb-6">{aboutData.title}</p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6 sm:mb-8 whitespace-pre-line">
              {aboutData.longBio}
            </p>

            {/* CV Download Button */}
            {aboutData.resumeUrl && (
              <motion.a
                href={aboutData.resumeUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl mb-6 sm:mb-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5" />
                <span>Download CV</span>
              </motion.a>
            )}

            {aboutData.skills && aboutData.skills.length > 0 && (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {aboutData.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

