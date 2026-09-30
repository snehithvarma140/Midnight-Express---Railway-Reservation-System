import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Train as TrainIcon, MapPin, Ticket, ShieldCheck, ArrowRight, X, Clock, HelpCircle, Utensils, Bath, Car, Wifi } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    globalSearchOpen,
    setGlobalSearchOpen,
    trains,
    stations,
    bookings,
    setActiveView,
    startBookingForTrain,
    setSelectedStationForView,
    setSelectedBookingForView,
    toggleDarkMode,
    isDarkMode,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (globalSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [globalSearchOpen]);

  if (!globalSearchOpen) return null;

  const q = query.trim().toLowerCase();

  // Search Trains
  const matchedTrains = trains.filter(
    t =>
      t.number.includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.sourceStation.toLowerCase().includes(q) ||
      t.destStation.toLowerCase().includes(q) ||
      t.sourceCode.toLowerCase().includes(q) ||
      t.destCode.toLowerCase().includes(q)
  );

  // Search Stations
  const matchedStations = stations.filter(
    s =>
      s.code.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q)
  );

  // Search PNRs
  const matchedBookings = bookings.filter(
    b =>
      b.pnr.includes(q) ||
      b.trainName.toLowerCase().includes(q) ||
      b.trainNumber.includes(q) ||
      b.userName.toLowerCase().includes(q)
  );

  // Facility & Travel Service keywords
  const facilityKeywords = [
    { title: 'Food Track & Gourmet E-Catering', icon: Utensils, view: 'travel-services' },
    { title: 'Executive Transit Hotels & Retiring Pods', icon: Clock, view: 'travel-services' },
    { title: 'Prepaid Station Cabs & Transfers', icon: Car, view: 'travel-services' },
    { title: 'Free High-Speed RailWire Wi-Fi', icon: Wifi, view: 'travel-services' },
    { title: 'Wheelchair & Passenger Assistance', icon: ShieldCheck, view: 'travel-services' },
  ].filter(f => f.title.toLowerCase().includes(q));

  const handleSelectTrain = (trn: typeof trains[0]) => {
    setGlobalSearchOpen(false);
    startBookingForTrain(trn, trn.classes[0].classType);
  };

  const handleSelectStation = (stn: typeof stations[0]) => {
    setGlobalSearchOpen(false);
    setActiveView('search-trains');
  };

  const handleSelectBooking = (bk: typeof bookings[0]) => {
    setGlobalSearchOpen(false);
    setSelectedBookingForView(bk);
    setActiveView('my-bookings');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-200"
      onClick={() => setGlobalSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#14233c]">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search trains, station codes (HYB, VSKP), 10-digit PNR, or facilities..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium text-base outline-none border-none p-0 focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Search Results Content */}
        <div className="overflow-y-auto p-3 space-y-4 text-sm divide-y divide-slate-100 dark:divide-slate-800/60">
          {/* Quick Actions if query is empty */}
          {!q && (
            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">
                Quick Shortcuts
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    setGlobalSearchOpen(false);
                    setActiveView('search-trains');
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#192b47] text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <TrainIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Plan Next Journey</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Search 14+ high-speed corridors</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    setGlobalSearchOpen(false);
                    setActiveView('travel-services');
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#192b47] text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Travel Services &amp; Hotels</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Transit pods, cabs &amp; e-catering</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    setGlobalSearchOpen(false);
                    setActiveView('my-bookings');
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#192b47] text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">My Bookings & PNR</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Active tickets & cancellation</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    toggleDarkMode();
                    setGlobalSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#192b47] text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Toggle {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Atmospheric contrast switch</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* Trains Section */}
          {matchedTrains.length > 0 && (
            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2 flex items-center justify-between">
                <span>Trains ({matchedTrains.length})</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400">Click to Select & Book</span>
              </div>
              <div className="space-y-1">
                {matchedTrains.slice(0, 4).map(trn => (
                  <div
                    key={trn.id}
                    onClick={() => handleSelectTrain(trn)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/70 dark:hover:bg-blue-900/20 cursor-pointer transition-colors group border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-mono font-bold text-xs">
                        #{trn.number}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {trn.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {trn.sourceCode} ({trn.departureTime}) → {trn.destCode} ({trn.arrivalTime}) • {trn.duration}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
                        ₹{trn.classes[0]?.fare}
                      </span>
                      <span className="block text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        {trn.classes[0]?.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stations Section */}
          {matchedStations.length > 0 && (
            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">
                Railway Stations ({matchedStations.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {matchedStations.slice(0, 4).map(stn => (
                  <div
                    key={stn.id}
                    onClick={() => handleSelectStation(stn)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#192b47] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono font-bold text-xs text-slate-800 dark:text-slate-300">
                        {stn.code}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white leading-tight">{stn.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {stn.city}, {stn.state} • {stn.platforms} PFs
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PNR Lookups */}
          {matchedBookings.length > 0 && (
            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">
                Active Bookings / PNR Matches ({matchedBookings.length})
              </div>
              <div className="space-y-1">
                {matchedBookings.slice(0, 3).map(bk => (
                  <div
                    key={bk.id}
                    onClick={() => handleSelectBooking(bk)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/70 dark:hover:bg-emerald-950/20 cursor-pointer transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                        <Ticket className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="font-mono text-blue-600 dark:text-blue-400">{bk.pnr}</span>
                          <span>• {bk.trainName}</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {bk.fromCode} → {bk.toCode} • {bk.journeyDate} • {bk.passengers[0]?.assignedCoach || 'Berth Assigned'}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                      {bk.bookingStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facilities */}
          {facilityKeywords.length > 0 && (
            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">
                Station Terminal Facilities
              </div>
              <div className="space-y-1">
                {facilityKeywords.map((fac, idx) => {
                  const Icon = fac.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setGlobalSearchOpen(false);
                        setActiveView(fac.view);
                      }}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#192b47] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">{fac.title}</span>
                      </div>
                      <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        View Service <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No results */}
          {q &&
            matchedTrains.length === 0 &&
            matchedStations.length === 0 &&
            matchedBookings.length === 0 &&
            facilityKeywords.length === 0 && (
              <div className="p-8 text-center">
                <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <div className="font-semibold text-slate-800 dark:text-slate-200">No matching rail records found</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Try searching for 'HYB', 'Godavari', '12727', 'VSKP', or 10-digit PNR '4827163950'.
                </p>
              </div>
            )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#0b172a] border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded text-[10px]">Esc</kbd> to close
            </span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">PRS Database v3.8 Active</span>
          </div>
          <span className="hidden sm:inline">Midnight Express Rail Systems</span>
        </div>
      </div>
    </div>
  );
};
