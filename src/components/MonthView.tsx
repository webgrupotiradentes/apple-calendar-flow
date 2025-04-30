
import React from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/context/EventContext';

interface MonthViewProps {
  currentMonth: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  getFilteredEventsForDay: (day: Date) => CalendarEvent[];
}

const MonthView: React.FC<MonthViewProps> = ({ 
  currentMonth, 
  selectedDate, 
  setSelectedDate,
  getFilteredEventsForDay
}) => {
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  const startDay = firstDayOfMonth.getDay();
  const prevMonthDays = startDay > 0 ? Array.from({ length: startDay }, (_, i) =>
    new Date(currentMonth.getFullYear(), currentMonth.getMonth(), -i)
  ).reverse() : [];

  const endDay = 6 - lastDayOfMonth.getDay();
  const nextMonthDays = endDay > 0 ? Array.from({ length: endDay }, (_, i) =>
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i + 1)
  ) : [];

  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];
  
  return (
    <div className="flex-1">
      <div className="grid grid-cols-7 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 auto-rows-fr">
        {allDays.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const events = getFilteredEventsForDay(day);
          const hasEvents = events.length > 0;

          return (
            <div
              key={index}
              className={cn(
                "p-1 border transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 dia",
                !isCurrentMonth && "bg-gray-50 dark:bg-gray-800 text-gray-400",
                isSelected && "border-apple-blue dark:border-blue-500",
                "dark:border-gray-700"
              )}
              onClick={() => setSelectedDate(day)}
            >
              <div className="flex flex-col h-full">
                <div className={cn(
                  "h-6 w-6 flex items-center justify-center text-sm rounded-full mx-auto",
                  isTodayDate && "bg-apple-blue dark:bg-blue-600 text-white",
                  isSelected && !isTodayDate && "border border-apple-blue dark:border-blue-500"
                )}>
                  {format(day, 'd')}
                </div>
                <div className="mt-1 flex-grow overflow-hidden">
                  {hasEvents && events.slice(0, 2).map((event, i) => (
                    <div
                      key={event.id}
                      className={cn(
                        "text-xs truncate p-1 rounded",
                        event.color,
                        "dark:bg-opacity-50"
                      )}
                    >
                      {event.title}
                    </div>
                  ))}
                  {events.length > 2 && (
                    <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                      +{events.length - 2}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
