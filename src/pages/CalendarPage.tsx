
import React, { useState } from 'react';
import Calendar from '@/components/Calendar';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import { EventCategory } from '@/context/EventContext';

const CalendarPage: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);

  return (
    <div className="min-h-screen flex flex-col bg-apple-gray6">
      <Header />
      <main className="flex-grow">
        <div className="max-w-full mx-auto">
          <div className="px-4 py-2 flex justify-end">
            <CategoryFilter 
              selectedCategories={selectedCategories} 
              setSelectedCategories={setSelectedCategories} 
            />
          </div>
          <Calendar selectedCategories={selectedCategories} />
        </div>
      </main>
      <footer className="py-2 text-center text-xs text-apple-gray">
        <p>&copy; {new Date().getFullYear()} Calendar Flow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CalendarPage;
