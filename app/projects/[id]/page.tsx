'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, Mail } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  category: string;
  tags: string[];
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGetInTouch = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/');
    // Wait for navigation then scroll
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${params.id}`);
        const data = await res.json();
        
        if (data.success) {
          setProject(data.data);
        } else {
          setError(data.error || 'Project not found');
        }
      } catch (err) {
        setError('Error loading project');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The project you are looking for does not exist.'}</p>
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Projects
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-8">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Project Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Hero Image */}
            <div className="relative h-64 sm:h-96 overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium mb-4">
                    {project.category}
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
                    {project.title}
                  </h1>
                  <p className="text-lg sm:text-xl text-white/90 max-w-3xl">
                    {project.description}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Project Content */}
            <div className="p-6 sm:p-8 lg:p-12">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm sm:text-base">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Tag className="w-5 h-5" />
                  <span className="text-sm sm:text-base">{project.category}</span>
                </div>
              </div>

              {/* Long Description */}
              {project.longDescription && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">About This Project</h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base sm:text-lg">
                      {project.longDescription}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Technologies & Skills</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm sm:text-base font-medium hover:from-blue-200 hover:to-purple-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200"
              >
                <Link
                  href="/#projects"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  View All Projects
                </Link>
                <button
                  onClick={handleGetInTouch}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  <Mail className="w-5 h-5" />
                  Get In Touch
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}

