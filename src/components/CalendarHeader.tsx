
import React from 'react';
import { format, subMonths, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ViewSelector from './ViewSelector';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CalendarHeaderProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  currentView: 'day' | 'month' | 'year';
  onViewChange: (view: 'day' | 'month' | 'year') => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  currentMonth, 
  setCurrentMonth, 
  setSelectedDate,
  currentView,
  onViewChange
}) => {
  const { toast } = useToast();

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

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 text-apple-blue dark:text-blue-400" />
        <h2 className="text-lg font-medium dark:text-white">Calendário</h2>
      </div>
      <div className="flex items-center gap-4">
        <ViewSelector currentView={currentView} onViewChange={onViewChange} />
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
            onClick={goToToday}
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
  );
};

export default CalendarHeader;
