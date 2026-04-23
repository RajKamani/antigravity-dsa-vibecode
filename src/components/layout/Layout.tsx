import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout: React.FC = () => {
  return (
    <div className="flex bg-[var(--c-bg)] min-h-screen text-[var(--c-text)] transition-colors">
      <Sidebar />
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6" role="main">
          <div className="max-w-6xl mx-auto ln-page-enter"><Outlet /></div>
        </main>
      </div>
    </div>
  );
};
