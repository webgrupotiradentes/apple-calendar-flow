
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
      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 flex justify-end">
            <CategoryFilter 
              selectedCategories={selectedCategories} 
              setSelectedCategories={setSelectedCategories} 
            />
          </div>
          <Calendar selectedCategories={selectedCategories} />
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-apple-gray">
        <p>&copy; {new Date().getFullYear()} Calendar Flow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CalendarPage;
