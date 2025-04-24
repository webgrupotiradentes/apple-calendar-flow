
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Search } from 'lucide-react';
import AdminHeader from '@/components/AdminHeader';
import EventForm from '@/components/EventForm';
import AdminEventList from '@/components/AdminEventList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEvents } from '@/context/EventContext';

const AdminPage: React.FC = () => {
  const { events } = useEvents();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (event.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-apple-gray6">
      <AdminHeader />
      <main className="flex-grow p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-medium">Manage Events</h1>
            <Button 
              onClick={() => setIsAddEventOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-4 border-b border-apple-gray5">
              <h2 className="text-lg font-medium">Filters</h2>
            </div>
            <div className="p-4 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-apple-gray" />
                <Input
                  placeholder="Search events..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="meeting">Meetings</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="holiday">Holidays</SelectItem>
                    <SelectItem value="reminder">Reminders</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-apple-gray5 flex items-center justify-between">
              <h2 className="text-lg font-medium">All Events ({filteredEvents.length})</h2>
              {filteredEvents.length > 0 && (
                <p className="text-sm text-apple-gray">
                  Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
                </p>
              )}
            </div>
            <div className="p-4">
              <AdminEventList events={filteredEvents} />
            </div>
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-apple-gray">
        <p>&copy; {new Date().getFullYear()} Calendar Flow Admin. All rights reserved.</p>
      </footer>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <EventForm onSuccess={() => setIsAddEventOpen(false)} onCancel={() => setIsAddEventOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
