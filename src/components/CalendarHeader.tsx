
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Calendário</h2>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <ViewSelector currentView={currentView} onViewChange={onViewChange} />
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadPDF}
          className="gap-2 border-gray-300"
        >
          <Download className="h-4 w-4" />
          PDF
        </Button>
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-gray-700 rounded-md"
          >
            Hoje
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="mx-2 font-medium text-gray-800 dark:text-white">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-md"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
