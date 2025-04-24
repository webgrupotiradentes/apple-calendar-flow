import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarEvent, EventCategory } from '@/context/EventContext';
import EventList from './EventList';
import ViewSelector from './ViewSelector';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const getFilteredEventsForDay = (day: Date): CalendarEvent[] => {
    return events.filter(event => 
      isSameDay(event.date, day) &&
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

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden">
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
        
        <div className="grid grid-cols-7 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>
        
        <div className="flex-1 grid grid-cols-7 gap-1 auto-rows-fr">
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
                  "p-1 border transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800",
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
      
      <div className="w-80 border-l p-4 overflow-y-auto dark:border-gray-700">
        <h3 className="text-sm font-medium mb-4 dark:text-white">
          {format(selectedDate, "EEEE',' d 'de' MMMM", { locale: ptBR })}
        </h3>
        <EventList events={getFilteredEventsForDay(selectedDate)} />
      </div>
    </div>
  );
};

export default Calendar;
