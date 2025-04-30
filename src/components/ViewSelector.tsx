
import React from 'react';
import { Button } from '@/components/ui/button';

interface ViewSelectorProps {
  currentView: 'day' | 'month' | 'year';
  onViewChange: (view: 'day' | 'month' | 'year') => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
      <Button
        variant={currentView === 'day' ? 'default' : 'ghost'}
        onClick={() => onViewChange('day')}
        size="sm"
        className={currentView === 'day' 
          ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-gray-700 shadow-sm" 
          : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"}
      >
        Dia
      </Button>
      <Button
        variant={currentView === 'month' ? 'default' : 'ghost'}
        onClick={() => onViewChange('month')}
        size="sm"
        className={currentView === 'month' 
          ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-gray-700 shadow-sm" 
          : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"}
      >
        Mês
      </Button>
      <Button
        variant={currentView === 'year' ? 'default' : 'ghost'}
        onClick={() => onViewChange('year')}
        size="sm"
        className={currentView === 'year' 
          ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-gray-700 shadow-sm" 
          : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"}
      >
        Ano
      </Button>
    </div>
  );
};

export default ViewSelector;
