
import React, { createContext, useContext, useState, useEffect } from 'react';

export type EventCategory = 'meeting' | 'personal' | 'holiday' | 'reminder' | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  category: EventCategory;
  color: string;
  description?: string;
}

interface EventContextType {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: Date) => CalendarEvent[];
  getEventsByMonth: (year: number, month: number) => CalendarEvent[];
  getEventsByCategory: (category: EventCategory) => CalendarEvent[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// Helper function to get color based on category
export const getCategoryColor = (category: EventCategory): string => {
  switch (category) {
    case 'meeting':
      return 'bg-apple-blue';
    case 'personal':
      return 'bg-apple-purple';
    case 'holiday':
      return 'bg-apple-red';
    case 'reminder':
      return 'bg-apple-yellow';
    case 'other':
    default:
      return 'bg-apple-gray';
  }
};

// Mock initial data
const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Product Launch Meeting',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 10, 0),
    category: 'meeting',
    color: 'bg-apple-blue',
    description: 'Discuss the new product launch strategy'
  },
  {
    id: '2',
    title: 'Team Building',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 14, 0),
    category: 'personal',
    color: 'bg-apple-purple',
    description: 'Team building activities at the park'
  },
  {
    id: '3',
    title: 'Independence Day',
    date: new Date(new Date().getFullYear(), 6, 4),
    category: 'holiday',
    color: 'bg-apple-red',
    description: 'National Holiday'
  }
];

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  // Load events from local storage on initial render
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        // Convert string dates back to Date objects
        const eventsWithDateObjects = parsedEvents.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
        setEvents(eventsWithDateObjects);
      } catch (error) {
        console.error('Error parsing saved events', error);
      }
    }
  }, []);

  // Save events to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = {
      ...event,
      id: Math.random().toString(36).substring(2, 9),
      color: event.color || getCategoryColor(event.category)
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (updatedEvent: CalendarEvent) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getEventsByDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const getEventsByMonth = (year: number, month: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  };

  const getEventsByCategory = (category: EventCategory) => {
    return events.filter(event => event.category === category);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventsByDate,
        getEventsByMonth,
        getEventsByCategory
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
