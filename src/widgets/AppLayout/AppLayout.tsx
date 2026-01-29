import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};
