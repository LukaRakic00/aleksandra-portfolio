'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { FolderKanban, User, Mail, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    contacts: 0,
    unreadContacts: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, contactsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/contact'),
      ]);

      const projects = await projectsRes.json();
      const contacts = await contactsRes.json();

      const unreadContacts = contacts.data?.filter((c: any) => !c.read).length || 0;

      setStats({
        projects: projects.data?.length || 0,
        contacts: contacts.data?.length || 0,
        unreadContacts,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.projects,
      icon: FolderKanban,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Contacts',
      value: stats.contacts,
      icon: Mail,
      color: 'bg-green-500',
    },
    {
      title: 'Unread Messages',
      value: stats.unreadContacts,
      icon: TrendingUp,
      color: 'bg-red-500',
    },
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 text-xs sm:text-sm mb-1 truncate">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 sm:p-4 rounded-full flex-shrink-0 ml-4`}>
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}

