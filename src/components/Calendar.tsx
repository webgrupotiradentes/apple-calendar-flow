
import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarEvent, EventCategory } from '@/context/EventContext';
import EventList from './EventList';
import ViewSelector from './ViewSelector';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DayView from './DayView';
import MonthView from './MonthView';
import YearView from './YearView';

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
  }, [selectedDate]);

  const getFilteredEventsForDay = (day: Date): CalendarEvent[] => {
    return events.filter(event =>
      new Date(event.date).getDate() === day.getDate() &&
      new Date(event.date).getMonth() === day.getMonth() &&
      new Date(event.date).getFullYear() === day.getFullYear() &&
      (selectedCategories.length === 0 || selectedCategories.includes(event.category))
    );
  };

  const handleDownloadPDF = async () => {
    const { data, error } = await supabase
      .from('calendar_pdfs')
      .select('url')
      .limit(1)
      .single();

    if (error || !data?.url) {
      toast({
        title: "Erro",
        description: "PDF do calendário não encontrado",
        variant: "destructive",
      });
      return;
    }

    window.open(data.url, '_blank');
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
    <div className="flex h-[calc(100vh-20rem)] bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden">
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-apple-blue dark:text-blue-400" />
            <h2 className="text-lg font-medium dark:text-white">Calendário</h2>
          </div>
          <div className="flex items-center gap-4">
            <ViewSelector currentView={currentView} onViewChange={setCurrentView} />
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCurrentMonth(new Date());
                  setSelectedDate(new Date());
                }}
                className="text-apple-blue dark:text-blue-400"
              >
                Hoje
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="mx-2 font-medium dark:text-white">
                {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
              </span>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {renderView()}
      </div>

      <div className="w-80 border-l p-4 overflow-y-auto dark:border-gray-700 ml-4">
        <h3 className="text-sm font-medium mb-4 dark:text-white">
          {format(selectedDate, "EEEE',' d 'de' MMMM", { locale: ptBR })}
        </h3>
        <EventList events={getFilteredEventsForDay(selectedDate)} />
      </div>
    </div>
  );
};

export default Calendar;
