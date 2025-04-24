
import React from 'react';
import { Check, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EventCategory } from '@/context/EventContext';

interface CategoryFilterProps {
  selectedCategories: EventCategory[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<EventCategory[]>>;
}

const categories: { value: EventCategory; label: string; color: string }[] = [
  { value: 'meeting', label: 'Meetings', color: 'bg-apple-blue' },
  { value: 'personal', label: 'Personal', color: 'bg-apple-purple' },
  { value: 'holiday', label: 'Holidays', color: 'bg-apple-red' },
  { value: 'reminder', label: 'Reminders', color: 'bg-apple-yellow' },
  { value: 'other', label: 'Other', color: 'bg-apple-gray' },
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const toggleCategory = (category: EventCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
          {selectedCategories.length > 0 && (
            <span className="bg-apple-blue text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {selectedCategories.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {categories.map((category) => (
          <DropdownMenuCheckboxItem
            key={category.value}
            checked={selectedCategories.includes(category.value)}
            onCheckedChange={() => toggleCategory(category.value)}
            className="gap-2"
          >
            <span className={`w-3 h-3 rounded-full ${category.color}`} />
            {category.label}
          </DropdownMenuCheckboxItem>
        ))}
        
        {selectedCategories.length > 0 && (
          <div className="border-t mt-1 pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-apple-blue hover:text-apple-blue hover:bg-blue-50"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryFilter;
