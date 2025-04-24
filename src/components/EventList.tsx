
import React from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from '@/context/EventContext';
import { cn } from '@/lib/utils';

interface EventListProps {
  events: CalendarEvent[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="py-6 text-center text-apple-gray">
        No events scheduled for this day
      </div>
    );
  }

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-2">
      {sortedEvents.map(event => (
        <div 
          key={event.id}
          className="flex p-3 rounded-lg bg-white border border-apple-gray5 hover:bg-apple-gray6/50 transition-colors"
        >
          <div className={cn("w-1 rounded-full mr-3", event.color)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-medium truncate text-sm">{event.title}</h4>
              {event.date.getHours() > 0 && (
                <span className="text-xs text-apple-gray ml-2">
                  {format(event.date, 'h:mm a')}
                </span>
              )}
            </div>
            {event.description && (
              <p className="text-xs text-apple-gray mt-1 line-clamp-2">{event.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
