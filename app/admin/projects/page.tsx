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

function SortableProjectItem({ 
  project, 
  onEdit, 
  onDelete, 
  onOrderChange,
  isDraggable = true
}: { 
  project: Project; 
  onEdit: (project: Project) => void; 
  onDelete: (id: string) => void;
  onOrderChange: (id: string, newOrder: number) => void;
  isDraggable?: boolean;
}) {
  const sortable = useSortable({ id: project._id, disabled: !isDraggable });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = isDraggable ? sortable : {
    attributes: {},
    listeners: {},
    setNodeRef: (node: any) => {},
    transform: null,
    transition: undefined,
    isDragging: false,
  };

  const style = isDraggable ? {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  } : {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all ${
        isDragging ? 'border-blue-500 shadow-xl z-50 scale-105' : 'border-transparent hover:border-blue-300'
      }`}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Desktop: Drag Handle, Mobile: Order Input */}
        {isMobile ? (
          <div className="flex flex-col items-center gap-1">
            <label className="text-xs text-gray-500">Order</label>
            <input
              type="number"
              value={project.order}
              onChange={(e) => {
                const newOrder = parseInt(e.target.value) || 0;
                onOrderChange(project._id, newOrder);
              }}
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>
        ) : (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="w-5 h-5" />
          </div>
        )}
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

  // Desktop: immediate drag, Mobile: disabled (using manual order input)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // No delay for desktop - immediate drag
      activationConstraint: isMobile ? { distance: 999 } : undefined, // Disable drag on mobile
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

  const handleOrderChange = async (id: string, newOrder: number) => {
    // Update local state immediately
    const updatedProjects = projects.map((p) =>
      p._id === id ? { ...p, order: newOrder } : p
    );
    setProjects(updatedProjects);

    // Update in database
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder }),
      });

      const data = await res.json();
      if (data.success) {
        // Re-fetch to get updated order
        fetchProjects();
        toast.success('Order updated');
      } else {
        toast.error('Error updating order');
        fetchProjects(); // Revert
      }
    } catch (error) {
      toast.error('Error updating order');
      fetchProjects(); // Revert
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

        {isMobile ? (
          // Mobile: Manual order input (no drag and drop)
          <div className="space-y-3">
            {projects.map((project) => (
              <SortableProjectItem
                key={project._id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onOrderChange={handleOrderChange}
                isDraggable={false}
              />
            ))}
          </div>
        ) : (
          // Desktop: Drag and drop
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
                    onOrderChange={handleOrderChange}
                    isDraggable={true}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

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

