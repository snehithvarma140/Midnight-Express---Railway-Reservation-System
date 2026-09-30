/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Pages
import { Dashboard } from './pages/Dashboard';
import { SearchAndResults } from './pages/SearchAndResults';
import { BookingConfigPage } from './pages/BookingConfigPage';
import { PaymentPage } from './pages/PaymentPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { StationServicesPage } from './pages/StationServicesPage';
import { TravelServicesPage } from './pages/TravelServicesPage';
import { ProfilePage } from './pages/ProfilePage';
import { HelpSupportPage } from './pages/HelpSupportPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthPortal } from './pages/AuthPortal';
import { CheckCircle2, Info, Search } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, toastMessage, setGlobalSearchOpen } = useApp();

  // Global keydown handler for Ctrl+K or Cmd+K or '/' to toggle persistent search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(true);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        setGlobalSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setGlobalSearchOpen]);

  // View router
  const renderCurrentView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'my-bookings':
      case 'bookings':
      case 'booking':
      case 'search-trains':
      case 'search':
        return <MyBookingsPage />;
      case 'travel-services':
        return <TravelServicesPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Dashboard />;
    }
  };

  // If in authentic landing/login portal, show the standalone nocturnal experience
  if (activeView === 'auth' || activeView === 'login') {
    return (
      <div className="min-h-screen night-sky-bg text-[#d7e3fc]">
        <AuthPortal />
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass-panel text-white border border-white/20 shadow-2xl backdrop-blur-xl max-w-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-sm font-medium tracking-wide leading-snug">
                {toastMessage}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col night-sky-bg text-[#d7e3fc] relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Ambient Celestial Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[750px] h-[750px] bg-blue-600/10 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute top-[35%] right-10 w-[600px] h-[600px] bg-amber-500/8 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] left-10 w-[700px] h-[700px] bg-sky-500/12 blur-[170px] rounded-full" />
      </div>

      {/* Top persistent glass navigation bar */}
      <div className="relative z-40">
        <Navbar />
      </div>

      {/* Main page content with top padding for fixed navbar */}
      <main className="flex-1 pt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {renderCurrentView()}
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>

      {/* Persistent Global Search Command Palette */}
      <GlobalSearchModal />

      {/* Persistent floating search quick-trigger on bottom right for mobile/convenience */}
      <button
        onClick={() => setGlobalSearchOpen(true)}
        aria-label="Open Global Search"
        title="Quick Search (Ctrl + K)"
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 px-4 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30 group"
      >
        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline font-bold text-xs tracking-wider uppercase">
          Search
        </span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-blue-700/60 rounded text-blue-100 border border-blue-500/40">
          ⌘K
        </kbd>
      </button>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 sm:bottom-8 sm:left-auto sm:right-24 sm:translate-x-0 z-50 animate-bounce duration-300">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/95 dark:bg-[#1a2638]/95 text-white border border-slate-700/80 shadow-2xl backdrop-blur-md max-w-sm sm:max-w-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium tracking-wide leading-snug">
              {toastMessage}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
