
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent } from '@/context/EventContext';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface EventListProps {
  events: CalendarEvent[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500 dark:text-gray-400">
        <p className="text-sm">Nenhum evento programado para este dia</p>
      </div>
    );
  }

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedEvents.map(event => (
        <Card
          key={event.id}
          className="p-3 bg-white dark:bg-gray-800 border-0 shadow-sm hover:shadow transition-shadow duration-200 card-detalhes overflow-hidden"
        >
          <div className="flex">
            <div className={cn("w-1.5 h-full rounded-full mr-3", event.color)} />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-800 dark:text-white">{event.title}</h4>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                {!event.all_day && (
                  <span className="inline-block mr-2">{format(event.date, 'HH:mm', { locale: ptBR })}</span>
                )}
                {event.all_day && (
                  <span className="inline-block mr-2 text-blue-600 dark:text-blue-400 font-medium">Dia todo</span>
                )}
                {event.location && (
                  <span className="inline-flex items-center">📍 {event.location}</span>
                )}
              </div>
              {event.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 line-clamp-2">{event.description}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EventList;
