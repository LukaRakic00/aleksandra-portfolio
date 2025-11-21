'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Mail, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      toast.error('Error fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !currentRead }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Status updated');
        fetchContacts();
      }
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Contact deleted');
        fetchContacts();
        if (selectedContact?._id === id) {
          setSelectedContact(null);
        }
      }
    } catch (error) {
      toast.error('Error deleting contact');
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
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Contacts</h1>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all ${
                  selectedContact?._id === contact._id
                    ? 'ring-2 ring-blue-500'
                    : ''
                } ${!contact.read ? 'border-l-4 border-blue-500' : ''}`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleRead(contact._id, contact.read);
                      }}
                      className={`p-2 rounded ${
                        contact.read
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {contact.read ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(contact._id);
                      }}
                      className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                  {contact.message}
                </p>
              </div>
            ))}
          </div>
          {contacts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No contacts yet.
            </div>
          )}
        </div>

        {selectedContact && (
          <div className="w-full lg:w-96 bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-8 lg:h-fit">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold truncate">{selectedContact.name}</h2>
                <p className="text-gray-600 text-sm sm:text-base truncate">{selectedContact.email}</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {new Date(selectedContact.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-6">
              <h3 className="font-bold mb-2 text-sm sm:text-base">Message</h3>
              <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base break-words">
                {selectedContact.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

