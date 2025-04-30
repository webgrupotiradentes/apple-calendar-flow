
import React, { useState, useEffect } from 'react';
import { isToday } from 'date-fns';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent, EventCategory } from '@/context/EventContext';
import EventList from './EventList';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DayView from './DayView';
import MonthView from './MonthView';
import YearView from './YearView';
import CalendarHeader from './CalendarHeader';

interface CalendarProps {
  selectedCategories: EventCategory[];
}

const Calendar: React.FC<CalendarProps> = ({ selectedCategories }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'month' | 'year'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*');

      if (error) {
        console.error('Erro ao carregar eventos:', error);
        return;
      }

      const calendarEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.date),
        end_date: event.end_date ? new Date(event.end_date) : undefined,
        category: event.category as EventCategory,
        color: event.color,
        description: event.description || undefined,
        location: event.location || undefined,
        all_day: event.all_day || false,
        pdf_url: event.pdf_url || undefined,
        created_at: event.created_at || undefined,
        updated_at: event.updated_at || undefined
      })) as CalendarEvent[];

      setEvents(calendarEvents);
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (isToday(selectedDate)) {
      toast({
        title: "Hoje",
        description: format(selectedDate, "dd 'de' MMMM',' yyyy", { locale: ptBR }),
      });
    }
  }, [selectedDate, toast]);

  const getFilteredEventsForDay = (day: Date): CalendarEvent[] => {
    return events.filter(event =>
      new Date(event.date).getDate() === day.getDate() &&
      new Date(event.date).getMonth() === day.getMonth() &&
      new Date(event.date).getFullYear() === day.getFullYear() &&
      (selectedCategories.length === 0 || selectedCategories.includes(event.category))
    );
  };

  const renderView = () => {
    switch (currentView) {
      case 'day':
        return (
          <DayView
            currentDate={selectedDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            getFilteredEventsForDay={getFilteredEventsForDay}
          />
        );
      case 'month':
        return (
          <MonthView
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            getFilteredEventsForDay={getFilteredEventsForDay}
          />
        );
      case 'year':
        return (
          <YearView
            currentYear={currentMonth.getFullYear()}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            getFilteredEventsForDay={getFilteredEventsForDay}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-7.5rem)] bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800 mx-2">
      <div className="flex-1 px-4 py-3 flex flex-col">
        <CalendarHeader
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          setSelectedDate={setSelectedDate}
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        <div className="flex-1 overflow-auto rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2">
          {renderView()}
        </div>
      </div>

      <div className="w-80 border-l px-4 py-3 overflow-y-auto dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
        <h3 className="text-md font-medium mb-3 text-gray-800 dark:text-white">
          {format(selectedDate, "EEEE',' d 'de' MMMM", { locale: ptBR })}
        </h3>
        <EventList events={getFilteredEventsForDay(selectedDate)} />
      </div>
    </div>
  );
};

export default Calendar;
