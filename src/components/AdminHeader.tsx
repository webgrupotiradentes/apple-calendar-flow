
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft } from 'lucide-react';

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-white border-b border-apple-gray5 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 text-apple-gray">
            <ChevronLeft className="h-4 w-4" /> Back to Calendar
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-apple-blue" />
          <h1 className="text-lg font-medium">Calendar Admin</h1>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
