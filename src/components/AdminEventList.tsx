
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { CalendarEvent, EventCategory, useEvents } from '@/context/EventContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EventEditForm from './EventEditForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AdminEventListProps {
  events: CalendarEvent[];
}

const AdminEventList: React.FC<AdminEventListProps> = ({ events }) => {
  const { deleteEvent } = useEvents();
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null);
  const [deleteDialogEvent, setDeleteDialogEvent] = useState<CalendarEvent | null>(null);

  const handleEdit = (event: CalendarEvent) => {
    setEditEvent(event);
  };

  const handleDelete = (event: CalendarEvent) => {
    setDeleteDialogEvent(event);
  };

  const confirmDelete = () => {
    if (deleteDialogEvent) {
      deleteEvent(deleteDialogEvent.id);
      toast.success('Event deleted successfully');
      setDeleteDialogEvent(null);
    }
  };

  if (events.length === 0) {
    return (
      <div className="py-8 text-center text-apple-gray">
        No events found
      </div>
    );
  }

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getCategoryLabel = (category: EventCategory) => {
    switch (category) {
      case 'meeting': return 'Meeting';
      case 'personal': return 'Personal';
      case 'holiday': return 'Holiday';
      case 'reminder': return 'Reminder';
      case 'other': return 'Other';
    }
  };

  return (
    <>
      <div className="space-y-2 w-full">
        {sortedEvents.map(event => (
          <div 
            key={event.id}
            className="flex items-center p-4 rounded-lg bg-white border border-apple-gray5"
          >
            <div className={cn("w-1 h-full rounded-full mr-3", event.color)} />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">{event.title}</h4>
              <div className="flex items-center text-xs text-apple-gray mt-1">
                <span className="mr-2">{format(event.date, 'PPP')}</span>
                {event.date.getHours() > 0 && (
                  <span>{format(event.date, 'h:mm a')}</span>
                )}
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-apple-gray6">
                  {getCategoryLabel(event.category)}
                </span>
              </div>
              {event.description && (
                <p className="text-xs text-apple-gray mt-1">{event.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleEdit(event)}
                className="h-8 w-8 text-apple-gray hover:text-apple-blue"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDelete(event)}
                className="h-8 w-8 text-apple-gray hover:text-apple-red"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={!!editEvent} onOpenChange={(open) => !open && setEditEvent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {editEvent && (
            <EventEditForm 
              event={editEvent} 
              onSuccess={() => setEditEvent(null)}
              onCancel={() => setEditEvent(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialogEvent} onOpenChange={(open) => !open && setDeleteDialogEvent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialogEvent?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-apple-red hover:bg-apple-red/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminEventList;
