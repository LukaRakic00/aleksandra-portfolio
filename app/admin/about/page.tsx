'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Upload, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface AboutData {
  name: string;
  title: string;
  bio: string;
  longBio: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  resumeUrl: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
  };
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    duration: string;
  }>;
}

export default function AdminAbout() {
  const [formData, setFormData] = useState<AboutData>({
    name: '',
    title: '',
    bio: '',
    longBio: '',
    email: '',
    phone: '',
    location: '',
    profileImage: '',
    resumeUrl: '',
    socialLinks: {},
    skills: [],
    experience: [],
    education: [],
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await fetch('/api/about');
      const data = await res.json();
      if (data.success && data.data) {
        setFormData(data.data);
      }
    } catch (error) {
      toast.error('Error fetching about data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, profileImage: data.data.url }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Error uploading image');
      }
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('About section updated successfully');
      } else {
        toast.error('Error updating about section');
      }
    } catch (error) {
      toast.error('Error updating about section');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">About Section</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              required
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Long Bio</label>
            <textarea
              required
              value={formData.longBio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, longBio: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-lg"
              rows={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Profile Image</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {formData.profileImage && (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
            <input
              type="text"
              value={formData.skills.join(', ')}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  skills: e.target.value.split(',').map((s) => s.trim()),
                }))
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

