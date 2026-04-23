import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { OnboardingTour } from '../common/OnboardingTour';
import { useAppContext } from '../../context/AppContext';

export const Layout: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!state.settings.hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, [state.settings.hasSeenOnboarding]);

  const handleCloseOnboarding = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { hasSeenOnboarding: true } });
    setShowOnboarding(false);
  };

  return (
    <div className="flex bg-[var(--c-bg)] min-h-screen text-[var(--c-text)] transition-colors relative">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <Header 
          onOpenHelp={() => setShowOnboarding(true)} 
          onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="flex-1 p-6" role="main">
          <div className="max-w-6xl mx-auto ln-page-enter"><Outlet /></div>
        </main>
      </div>
      <OnboardingTour run={showOnboarding} onFinish={handleCloseOnboarding} />
    </div>
  );
};
