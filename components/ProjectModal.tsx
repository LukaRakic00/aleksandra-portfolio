'use client';

import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface Project {
  _id?: string;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  category: string;
  tags: string[];
  featured: boolean;
  order: number;
}

interface ProjectModalProps {
  project?: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [formData, setFormData] = useState<Project>({
    title: '',
    description: '',
    longDescription: '',
    imageUrl: '',
    category: 'General',
    tags: [],
    featured: false,
    order: 0,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, imageUrl: data.data.url }));
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
      const url = project?._id
        ? `/api/projects/${project._id}`
        : '/api/projects';
      const method = project?._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          project ? 'Project updated successfully' : 'Project created successfully'
        );
        onClose();
      } else {
        toast.error(data.error || 'Error saving project');
      }
    } catch (error) {
      toast.error('Error saving project');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-3 sm:p-4 flex justify-between items-center z-10">
          <h2 className="text-xl sm:text-2xl font-bold">
            {project ? 'Edit Project' : 'Add Project'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Long Description
            </label>
            <textarea
              value={formData.longDescription || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  longDescription: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <div className="flex gap-4 items-center">
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <div>
                <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tags: e.target.value.split(',').map((t) => t.trim()),
                }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Order (automatically set by drag & drop)</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  order: parseInt(e.target.value) || 0,
                }))
              }
              className="w-24 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled
              title="Order is managed by drag & drop on the projects page"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
            >
              {project ? 'Update' : 'Create'} Project
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

