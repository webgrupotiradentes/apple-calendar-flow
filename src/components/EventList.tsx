
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent } from '@/context/EventContext';
import { cn } from '@/lib/utils';

interface EventListProps {
  events: CalendarEvent[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500 dark:text-gray-400">
        Nenhum evento programado para este dia
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
          className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex">
            <div className={cn("w-1 h-full rounded-full mr-3", event.color)} />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm dark:text-white">{event.title}</h4>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                {event.date.getHours() > 0 && (
                  <span>{format(event.date, 'HH:mm', { locale: ptBR })}</span>
                )}
                {event.location && (
                  <span className="ml-2">📍 {event.location}</span>
                )}
              </div>
              {event.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{event.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
