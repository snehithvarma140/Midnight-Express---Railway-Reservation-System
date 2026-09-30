import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Train,
  Search,
  Bell,
  Sun,
  Moon,
  Shield,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Clock,
  Compass,
  Building2,
  HelpCircle,
  Database,
  Ticket,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    isDarkMode,
    toggleDarkMode,
    currentUser,
    loginUser,
    logoutUser,
    activeView,
    setActiveView,
    setGlobalSearchOpen,
    bookings,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [utcTime, setUtcTime] = useState('03:42');

  // Live UTC system clock matching Image 1
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      setUtcTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'my-bookings', label: 'My Bookings', badge: bookings.filter(b => b.bookingStatus === 'CONFIRMED').length },
    { id: 'travel-services', label: 'Travel Services' },
  ];

  if (currentUser?.role === 'ADMIN') {
    navItems.push({ id: 'admin', label: 'Admin Control' });
  }

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#071325]/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-colors duration-200">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-700/60 flex items-center justify-center text-blue-600 dark:text-[#b4c5ff] transition-transform group-hover:scale-105 shadow-xs">
              <Train className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase text-slate-900 dark:text-[#d7e3fc] leading-none">
                Midnight Express
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-blue-600 dark:text-[#7bd0ff] tracking-widest uppercase mt-0.5">
                Rail Transit Authority
              </span>
            </div>
          </button>

          {/* Grid Online Pill (matches Image 1) */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-[#1f2a3d]/70 border border-slate-200/70 dark:border-slate-700/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#7bd0ff] animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-[#c3c6d7]">
              Grid Online
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map(item => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all relative ${
                  isActive
                    ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : 'text-slate-600 dark:text-[#c3c6d7] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#142032]'
                }`}
              >
                {item.label}
                {item.badge && item.badge > 0 ? (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Persistent Search Trigger Input / Button */}
          <button
            onClick={() => setGlobalSearchOpen(true)}
            className="flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#142032] border border-slate-200/90 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all text-xs text-slate-500 dark:text-[#8d90a0] shadow-2xs group"
            title="Search trains, stations, PNR (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-blue-600 dark:text-[#7bd0ff] group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline font-medium">Search trains, PNR...</span>
            <kbd className="hidden lg:inline-flex px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-[#1f2a3d] border border-slate-200 dark:border-slate-700 rounded shadow-xs">
              ⌘K
            </kbd>
          </button>

          {/* UTC System Clock Badge (Image 1) */}
          <div className="hidden lg:flex items-center gap-1 font-mono text-[11px] font-bold text-amber-600 dark:text-[#ffb95f] bg-amber-50 dark:bg-[#101c2e] border border-amber-200/70 dark:border-amber-900/40 px-2.5 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            <span>SYS UTC {utcTime}</span>
          </div>

          {/* Dark / Light Mode Switcher */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#142032] text-slate-600 dark:text-[#d7e3fc] hover:bg-slate-200 dark:hover:bg-[#1f2a3d] border border-slate-200 dark:border-slate-700/80 transition-colors shadow-2xs"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#ffb95f]" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setActiveView('my-bookings')}
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-[#142032] text-slate-600 dark:text-[#c3c6d7] hover:bg-slate-200 dark:hover:bg-[#1f2a3d] border border-slate-200 dark:border-slate-700/80 transition-colors shadow-2xs"
            title="Active Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              3
            </span>
          </button>

          {/* User Profile Pill / Menu */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#142032] hover:bg-slate-200 dark:hover:bg-[#1f2a3d] border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 dark:bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-[#7bd0ff] font-semibold leading-none">
                    {currentUser.role === 'ADMIN' ? 'Chief Controller' : 'Confirmed Berth'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-700/90 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 text-xs text-slate-700 dark:text-slate-200"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <Shield className="w-3 h-3" /> DigiLocker Aadhaar Verified
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveView('profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-[#1a2b47] flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-blue-600 dark:text-[#7bd0ff]" />
                      <span>My Profile & Saved Passengers</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('my-bookings');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-[#1a2b47] flex items-center gap-2"
                    >
                      <Ticket className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>My Bookings & PNR Status</span>
                    </button>

                    {/* Quick Role Switcher for project demonstration */}
                    <div className="px-4 py-1.5 my-1 bg-slate-50 dark:bg-[#14233c] text-[11px]">
                      <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wider">
                        Role Simulation
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            loginUser('USER');
                            setProfileDropdownOpen(false);
                          }}
                          className={`flex-1 py-1 rounded text-center font-bold ${
                            currentUser.role === 'USER'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          Passenger
                        </button>
                        <button
                          onClick={() => {
                            loginUser('ADMIN');
                            setProfileDropdownOpen(false);
                          }}
                          className={`flex-1 py-1 rounded text-center font-bold ${
                            currentUser.role === 'ADMIN'
                              ? 'bg-amber-600 text-white'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        logoutUser();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActiveView('auth')}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              Member Portal
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="xl:hidden p-2 rounded-xl bg-slate-100 dark:bg-[#142032] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1f2a3d] border border-slate-200 dark:border-slate-700 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071325] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {/* Quick search button for mobile */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setGlobalSearchOpen(true);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-[#142032] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium mb-3"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600 dark:text-[#7bd0ff]" />
              <span>Search trains, stations, PNR...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-[#1f2a3d] rounded border border-slate-300 dark:border-slate-600">
              Search
            </kbd>
          </button>

          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                activeView === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-[#d7e3fc] hover:bg-slate-100 dark:hover:bg-[#142032]'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-bold">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">SYS UTC {utcTime} • PRS v3.8</span>
            <button
              onClick={toggleDarkMode}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#142032] text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-blue-600" />}
              <span>{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
