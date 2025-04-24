
import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarEvent, EventCategory, useEvents } from '@/context/EventContext';
import EventList from './EventList';

interface CalendarProps {
  selectedCategories: EventCategory[];
}

const Calendar: React.FC<CalendarProps> = ({ selectedCategories }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const { getEventsByDate } = useEvents();
  
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  
  // Add days from previous month to start the calendar on Sunday
  const startDay = firstDayOfMonth.getDay();
  const prevMonthDays = startDay > 0 ? Array.from({ length: startDay }, (_, i) => 
    new Date(currentMonth.getFullYear(), currentMonth.getMonth(), -i)
  ).reverse() : [];
  
  // Add days from next month to complete the calendar grid
  const endDay = 6 - lastDayOfMonth.getDay();
  const nextMonthDays = endDay > 0 ? Array.from({ length: endDay }, (_, i) => 
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i + 1)
  ) : [];
  
  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];
  
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  // Filter events by selected categories
  const eventsForSelectedDate = getEventsByDate(selectedDate)
    .filter(event => selectedCategories.length === 0 || selectedCategories.includes(event.category));

  // Function to get events for a specific day with category filtering
  const getFilteredEventsForDay = (day: Date): CalendarEvent[] => {
    return getEventsByDate(day)
      .filter(event => selectedCategories.length === 0 || selectedCategories.includes(event.category));
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 border-b border-apple-gray5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-apple-blue" />
          <h2 className="text-lg font-medium">Calendar</h2>
        </div>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToToday}
            className="text-apple-blue hover:text-apple-blue hover:bg-blue-50"
          >
            Today
          </Button>
          <Button variant="ghost" size="icon" onClick={prevMonth} className="text-apple-gray">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="mx-2 font-medium">{format(currentMonth, 'MMMM yyyy')}</span>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="text-apple-gray">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="calendar-grid bg-white">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center text-xs font-medium text-apple-gray">
            {day}
          </div>
        ))}
      </div>
      
      <div className="calendar-grid bg-white border-t border-apple-gray5">
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
                "calendar-day p-1 border border-apple-gray6 transition-all cursor-pointer",
                !isCurrentMonth && "bg-apple-gray6 text-apple-gray3",
                isSelected && "border-apple-blue/50 shadow-sm",
                isCurrentMonth && "hover:bg-apple-gray6/50"
              )}
              onClick={() => setSelectedDate(day)}
            >
              <div className="flex flex-col h-full">
                <div className={cn(
                  "h-6 w-6 flex items-center justify-center text-xs rounded-full mx-auto",
                  isTodayDate && "bg-apple-blue text-white",
                  isSelected && !isTodayDate && "border border-apple-blue text-apple-blue"
                )}>
                  {format(day, 'd')}
                </div>
                <div className="mt-1 flex-grow overflow-hidden">
                  {hasEvents && events.slice(0, 2).map((event, i) => (
                    <div key={event.id} className={cn("calendar-event text-xs truncate", event.color)}>
                      {event.title}
                    </div>
                  ))}
                  {events.length > 2 && (
                    <div className="text-xs text-apple-gray text-center">
                      +{events.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-apple-gray5">
        <h3 className="text-sm font-medium mb-2">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        <EventList events={eventsForSelectedDate} />
      </div>
    </div>
  );
};

export default Calendar;
