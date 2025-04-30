
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/context/EventContext';

interface DayViewProps {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  getFilteredEventsForDay: (day: Date) => CalendarEvent[];
}

const DayView: React.FC<DayViewProps> = ({ 
  currentDate, 
  selectedDate, 
  setSelectedDate,
  getFilteredEventsForDay
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="text-lg font-medium mb-4 dark:text-white">
        {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
      </div>
      
      <div className="space-y-2">
        {hours.map(hour => {
          const hourDate = new Date(selectedDate);
          hourDate.setHours(hour, 0, 0, 0);
          
          const hourEvents = getFilteredEventsForDay(selectedDate).filter(event => 
            event.date.getHours() === hour || 
            (event.all_day && isSameDay(event.date, selectedDate))
          );
          
          return (
            <div key={hour} className="flex border-t dark:border-gray-700 py-2">
              <div className="w-20 text-sm text-gray-500 dark:text-gray-400 pt-2">
                {format(hourDate, 'HH:mm')}
              </div>
              <div className="flex-1">
                {hourEvents.map(event => (
                  <div 
                    key={event.id} 
                    className={cn(
                      "p-2 mb-2 rounded-lg text-sm",
                      event.color,
                      "dark:bg-opacity-50"
                    )}
                  >
                    <div className="font-medium">{event.title}</div>
                    {event.location && (
                      <div className="text-xs mt-1">📍 {event.location}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayView;
