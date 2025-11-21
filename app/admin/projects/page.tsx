'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import ProjectModal from '@/components/ProjectModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
}

function SortableProjectItem({ project, onEdit, onDelete }: { project: Project; onEdit: (project: Project) => void; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project._id });
  const [isPressing, setIsPressing] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all ${
        isDragging ? 'border-blue-500 shadow-xl z-50 scale-105' : 'border-transparent hover:border-blue-300'
      }`}
    >
      <div className="flex items-center gap-3 p-4">
        <div
          {...attributes}
          {...listeners}
          onTouchStart={() => setIsPressing(true)}
          onTouchEnd={() => setIsPressing(false)}
          onMouseDown={() => setIsPressing(true)}
          onMouseUp={() => setIsPressing(false)}
          onMouseLeave={() => setIsPressing(false)}
          className={`relative cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-all touch-none select-none ${
            isPressing ? 'scale-110' : ''
          }`}
          style={{ touchAction: 'none' }}
          title="Hold and drag to reorder (mobile)"
        >
          <GripVertical className="w-5 h-5" />
          {isPressing && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
              Hold to drag
            </div>
          )}
        </div>
        <div className="relative h-24 w-24 bg-gray-200 flex-shrink-0 rounded">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg mb-1 truncate">{project.title}</h3>
          <p className="text-gray-600 text-sm mb-1 line-clamp-1">
            {project.description}
          </p>
          <p className="text-xs text-gray-500">
            Category: {project.category} | Order: {project.order}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(project)}
            className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(project._id)}
            className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Long press for mobile, immediate for desktop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250, // Long press delay for mobile
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) {
        // Ensure all projects have tags array and sort by order
        const projectsWithTags = data.data.map((project: any) => ({
          ...project,
          tags: project.tags || [],
          longDescription: project.longDescription || '',
        }));
        // Sort by order, then by creation date
        const sortedProjects = projectsWithTags.sort((a: any, b: any) => {
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });
        setProjects(sortedProjects);
      }
    } catch (error) {
      toast.error('Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = projects.findIndex((p) => p._id === active.id);
    const newIndex = projects.findIndex((p) => p._id === over.id);

    const newProjects = arrayMove(projects, oldIndex, newIndex);
    setProjects(newProjects);

    // Update order in database
    try {
      const projectIds = newProjects.map((p) => p._id);
      const res = await fetch('/api/projects/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectIds }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Order updated successfully');
      } else {
        toast.error('Error updating order');
        // Revert on error
        fetchProjects();
      }
    } catch (error) {
      toast.error('Error updating order');
      // Revert on error
      fetchProjects();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Project deleted');
        fetchProjects();
      } else {
        toast.error('Error deleting project');
      }
    } catch (error) {
      toast.error('Error deleting project');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    fetchProjects();
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Projects</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            <span>Add Project</span>
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {projects.map((project) => (
                <SortableProjectItem
                  key={project._id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {projects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No projects yet. Click "Add Project" to create one.
          </div>
        )}

        {isModalOpen && (
          <ProjectModal
            project={editingProject}
            onClose={handleModalClose}
          />
        )}
      </div>
    </AdminLayout>
  );
}

