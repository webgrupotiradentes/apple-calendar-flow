
import React from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/context/EventContext';

interface YearViewProps {
  currentYear: number;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  getFilteredEventsForDay: (day: Date) => CalendarEvent[];
}

const YearView: React.FC<YearViewProps> = ({ 
  currentYear, 
  selectedDate, 
  setSelectedDate,
  getFilteredEventsForDay
}) => {
  const months = Array.from({ length: 12 }, (_, i) => i);
  
  return (
    <div className="flex-1">
      <h2 className="text-xl font-medium mb-4 text-center dark:text-white">
        {currentYear}
      </h2>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
        {months.map(month => {
          const date = new Date(currentYear, month, 1);
          const monthName = format(date, 'MMMM', { locale: ptBR });
          
          // Get days for mini calendar
          const firstDayOfMonth = startOfMonth(date);
          const lastDayOfMonth = endOfMonth(date);
          const days = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
          
          // Count events for this month
          let eventCount = 0;
          days.forEach(day => {
            eventCount += getFilteredEventsForDay(day).length;
          });
          
          const isSelectedMonth = selectedDate.getMonth() === month && 
                                  selectedDate.getFullYear() === currentYear;
          
          return (
            <div 
              key={month} 
              className={cn(
                "p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800",
                isSelectedMonth && "bg-gray-100 dark:bg-gray-800",
                "border dark:border-gray-700"
              )}
              onClick={() => {
                // Set selected date to the 1st of the month
                const newDate = new Date(currentYear, month, 1);
                setSelectedDate(newDate);
              }}
            >
              <h3 className="text-sm font-medium mb-2 capitalize dark:text-white">{monthName}</h3>
              
              <div className="grid grid-cols-7 gap-1 text-xs">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                  <div key={i} className="text-center text-gray-500 dark:text-gray-400">
                    {d}
                  </div>
                ))}
                
                {/* Add empty slots for days before the 1st */}
                {Array(firstDayOfMonth.getDay()).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} className="w-full text-center"></div>
                ))}
                
                {days.map(day => {
                  const isTodays = isToday(day);
                  const hasEvents = getFilteredEventsForDay(day).length > 0;
                  
                  return (
                    <div 
                      key={day.toString()} 
                      className={cn(
                        "w-full text-center",
                        isTodays && "rounded-full bg-apple-blue text-white",
                        hasEvents && !isTodays && "font-medium text-apple-blue dark:text-blue-400"
                      )}
                    >
                      {format(day, 'd')}
                    </div>
                  );
                })}
              </div>
              
              {eventCount > 0 && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {eventCount} evento{eventCount !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearView;
