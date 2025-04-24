
import React from 'react';
import { Button } from '@/components/ui/button';

interface ViewSelectorProps {
  currentView: 'day' | 'month' | 'year';
  onViewChange: (view: 'day' | 'month' | 'year') => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={currentView === 'day' ? 'default' : 'outline'}
        onClick={() => onViewChange('day')}
        size="sm"
      >
        Dia
      </Button>
      <Button
        variant={currentView === 'month' ? 'default' : 'outline'}
        onClick={() => onViewChange('month')}
        size="sm"
      >
        Mês
      </Button>
      <Button
        variant={currentView === 'year' ? 'default' : 'outline'}
        onClick={() => onViewChange('year')}
        size="sm"
      >
        Ano
      </Button>
    </div>
  );
};

export default ViewSelector;
