import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { Train, TrainClassType, RouteStop } from '../types';
import {
  Search,
  ArrowLeftRight,
  Calendar,
  Users,
  Clock,
  Sparkles,
  Zap,
  MapPin,
  Utensils,
  Wifi,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Eye,
  CheckCircle,
  AlertCircle,
  X,
  ChevronDown,
  Info,
} from 'lucide-react';

export const SearchAndResults: React.FC = () => {
  const {
    stations,
    trains,
    searchState,
    setSearchState,
    swapStations,
    startBookingForTrain,
    showToast,
    setActiveView,
  } = useApp();

  // Search input states
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // Filters & sorting
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'departure' | 'duration' | 'availability' | 'fare'>('departure');
  const [selectedRouteTrain, setSelectedRouteTrain] = useState<Train | null>(null);
  const [selectedClassMap, setSelectedClassMap] = useState<Record<string, TrainClassType>>({});

  // Station options filtered by input
  const filteredFromStations = useMemo(() => {
    const q = fromQuery.toLowerCase().trim();
    if (!q) return stations.slice(0, 8);
    return stations.filter(
      s => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
    );
  }, [stations, fromQuery]);

  const filteredToStations = useMemo(() => {
    const q = toQuery.toLowerCase().trim();
    if (!q) return stations.slice(0, 8);
    return stations.filter(
      s => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
    );
  }, [stations, toQuery]);

  // Real IRCTC Route Matching Algorithm:
  // Checks direct source/destination OR stops along the intermediate route!
  const matchingTrains = useMemo(() => {
    const from = (searchState.fromCode || '').toUpperCase().trim();
    const to = (searchState.toCode || '').toUpperCase().trim();
    const cls = searchState.classType;

    let list = trains.filter(train => {
      // 1. Direct match
      if (from && to && train.sourceCode === from && train.destCode === to) {
        return true;
      }

      // 2. Check route sequence
      if (from && to && train.route && train.route.length > 0) {
        const fromStop = train.route.find(r => r.stationCode.toUpperCase() === from);
        const toStop = train.route.find(r => r.stationCode.toUpperCase() === to);
        if (fromStop && toStop && fromStop.sequence < toStop.sequence) {
          return true;
        }
      }

      // 3. Match from only
      if (from && !to) {
        if (train.sourceCode === from) return true;
        if (train.route?.some(r => r.stationCode.toUpperCase() === from)) return true;
      }

      // 4. Match to only
      if (!from && to) {
        if (train.destCode === to) return true;
        if (train.route?.some(r => r.stationCode.toUpperCase() === to)) return true;
      }

      // 5. If no filter or general corridor search, show all trains
      if (!from && !to) return true;

      return false;
    });

    // If zero trains found for the exact pair, gracefully show all trains so user can book
    if (list.length === 0) {
      list = [...trains];
    }

    // Filter by class if selected
    if (cls && cls !== 'ALL') {
      list = list.filter(t => t.classes.some(c => c.classType === cls));
    }

    // Filter by train type
    if (activeTypeFilter !== 'ALL') {
      list = list.filter(t => t.type.toUpperCase() === activeTypeFilter.toUpperCase());
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'duration') {
        const getMinutes = (dur: string) => {
          const match = dur.match(/(\d+)h\s*(\d+)?m?/);
          if (!match) return 999;
          return parseInt(match[1]) * 60 + (match[2] ? parseInt(match[2]) : 0);
        };
        return getMinutes(a.duration) - getMinutes(b.duration);
      }
      if (sortBy === 'availability') {
        const aAvail = a.classes.reduce((sum, c) => sum + (c.availableSeats || 0), 0);
        const bAvail = b.classes.reduce((sum, c) => sum + (c.availableSeats || 0), 0);
        return bAvail - aAvail;
      }
      if (sortBy === 'fare') {
        const aFare = Math.min(...a.classes.map(c => c.fare));
        const bFare = Math.min(...b.classes.map(c => c.fare));
        return aFare - bFare;
      }
      // default: departure time
      return a.departureTime.localeCompare(b.departureTime);
    });

    return list;
  }, [trains, searchState.fromCode, searchState.toCode, searchState.classType, activeTypeFilter, sortBy]);

  // Quick Date Modifier
  const handleDateChange = (daysToAdd: number) => {
    const cur = new Date();
    cur.setDate(cur.getDate() + daysToAdd);
    const dateStr = cur.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setSearchState(prev => ({ ...prev, journeyDate: dateStr }));
    showToast(`Journey date shifted to ${dateStr}`);
  };

  const handleSelectStation = (type: 'from' | 'to', stn: (typeof stations)[0]) => {
    if (type === 'from') {
      setSearchState(prev => ({
        ...prev,
        fromCode: stn.code,
        fromName: `${stn.name} (${stn.code})`,
      }));
      setShowFromDropdown(false);
      setFromQuery('');
    } else {
      setSearchState(prev => ({
        ...prev,
        toCode: stn.code,
        toName: `${stn.name} (${stn.code})`,
      }));
      setShowToDropdown(false);
      setToQuery('');
    }
  };

  const handleSelectClass = (trainId: string, classType: TrainClassType) => {
    setSelectedClassMap(prev => ({ ...prev, [trainId]: classType }));
  };

  const handleBookTrain = (train: Train, classType?: TrainClassType) => {
    const chosenClass = classType || selectedClassMap[train.id] || train.classes[0].classType;
    startBookingForTrain(train, chosenClass);
  };

  return (
    <div className="w-full min-h-[calc(100vh-14rem)] py-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#8d90a0] font-semibold tracking-wider uppercase">
          <button onClick={() => setActiveView('dashboard')} className="hover:text-blue-600 dark:hover:text-[#7bd0ff] transition-colors flex items-center gap-1">
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
          <button onClick={() => setActiveView('my-bookings')} className="hover:text-blue-600 dark:hover:text-[#7bd0ff] transition-colors">
            <span>My Bookings</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
          <span className="text-blue-600 dark:text-[#7bd0ff] font-bold">Search &amp; Book Trains</span>
        </nav>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            IRCTC Live PRS Quota Active
          </span>
        </div>
      </div>

      {/* ==================== IRCTC CORE SEARCH BAR CARD ==================== */}
      <section className="w-full bg-white dark:bg-[#101c2e] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-lg relative z-20">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Book Train Ticket
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#8d90a0]">
                Official IRCTC e-Ticketing System • 25+ Express &amp; Vande Bharat Services
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-slate-400">Quick Dates:</span>
            <button
              onClick={() => handleDateChange(0)}
              className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#1a2b47] hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-[#d7e3fc] font-medium transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => handleDateChange(1)}
              className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#1a2b47] hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-[#d7e3fc] font-medium transition-colors"
            >
              Tomorrow
            </button>
            <button
              onClick={() => handleDateChange(2)}
              className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#1a2b47] hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-[#d7e3fc] font-medium transition-colors"
            >
              Day After
            </button>
          </div>
        </div>

        {/* Search Inputs Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* FROM Station */}
          <div className="md:col-span-4 relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8d90a0] mb-1">
              From Station
            </label>
            <div
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-[#071325] border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => setShowFromDropdown(true)}
            >
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {searchState.fromCode ? `${searchState.fromCode} - ${searchState.fromName.split('(')[0]}` : 'Select Origin'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {searchState.fromName || 'Click to choose origin city'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* From Dropdown */}
            {showFromDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-2 z-50 max-h-72 overflow-y-auto">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search city or station code..."
                    value={fromQuery}
                    onChange={e => setFromQuery(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0b1526] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="py-1">
                  {filteredFromStations.map(stn => (
                    <button
                      key={stn.id}
                      type="button"
                      onClick={() => handleSelectStation('from', stn)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <span className="font-bold text-blue-600 dark:text-[#7bd0ff]">{stn.code}</span>
                        <span className="text-slate-700 dark:text-slate-200 ml-2 font-medium">{stn.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{stn.city}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowFromDropdown(false)}
                  className="w-full text-center py-1.5 text-xs text-slate-400 hover:text-slate-600 border-t border-slate-100 dark:border-slate-800 mt-1"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center py-1">
            <button
              type="button"
              onClick={swapStations}
              title="Swap From and To"
              className="p-2.5 rounded-full bg-slate-100 dark:bg-[#1a2b47] hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-300 transition-all shadow-sm active:scale-95"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* TO Station */}
          <div className="md:col-span-4 relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8d90a0] mb-1">
              To Station
            </label>
            <div
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-[#071325] border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => setShowToDropdown(true)}
            >
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {searchState.toCode ? `${searchState.toCode} - ${searchState.toName.split('(')[0]}` : 'Select Destination'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {searchState.toName || 'Click to choose destination city'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* To Dropdown */}
            {showToDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-2 z-50 max-h-72 overflow-y-auto">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search city or station code..."
                    value={toQuery}
                    onChange={e => setToQuery(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0b1526] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="py-1">
                  {filteredToStations.map(stn => (
                    <button
                      key={stn.id}
                      type="button"
                      onClick={() => handleSelectStation('to', stn)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{stn.code}</span>
                        <span className="text-slate-700 dark:text-slate-200 ml-2 font-medium">{stn.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{stn.city}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowToDropdown(false)}
                  className="w-full text-center py-1.5 text-xs text-slate-400 hover:text-slate-600 border-t border-slate-100 dark:border-slate-800 mt-1"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8d90a0] mb-1">
              Date of Journey
            </label>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-[#071325] border border-slate-200 dark:border-slate-700">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <input
                type="text"
                value={searchState.journeyDate}
                onChange={e => setSearchState(prev => ({ ...prev, journeyDate: e.target.value }))}
                className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
                placeholder="29 Sep 2026"
              />
            </div>
          </div>
        </div>

        {/* Quota & Class Selector Line */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          {/* Quota Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8d90a0] mb-1">
              Quota
            </label>
            <select
              value={searchState.quota}
              onChange={e => setSearchState(prev => ({ ...prev, quota: e.target.value as any }))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#071325] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-[#d7e3fc] focus:outline-none focus:border-blue-500"
            >
              <option value="General">GENERAL (GN)</option>
              <option value="Tatkal">TATKAL (TQ)</option>
              <option value="Ladies">LADIES (LD)</option>
              <option value="Sr. Citizen">LOWER BERTH / SR. CITIZEN (SS)</option>
              <option value="Divyangjan">PERSON WITH DISABILITY (HP)</option>
              <option value="Premium Tatkal">PREMIUM TATKAL (PT)</option>
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8d90a0] mb-1">
              Class
            </label>
            <select
              value={searchState.classType}
              onChange={e => setSearchState(prev => ({ ...prev, classType: e.target.value as any }))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#071325] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-[#d7e3fc] focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Classes</option>
              <option value="1A">AC First Class (1A)</option>
              <option value="2A">AC 2 Tier (2A)</option>
              <option value="3A">AC 3 Tier (3A)</option>
              <option value="3E">AC 3 Economy (3E)</option>
              <option value="SL">Sleeper (SL)</option>
              <option value="EC">Exec Chair Car (EC)</option>
              <option value="CC">AC Chair Car (CC)</option>
              <option value="2S">Second Sitting (2S)</option>
            </select>
          </div>

          {/* Quick Clear / Reset Action */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSearchState(prev => ({
                  ...prev,
                  fromCode: 'NDLS',
                  fromName: 'New Delhi (NDLS)',
                  toCode: 'MAS',
                  toName: 'Chennai Central (MAS)',
                  classType: 'ALL',
                  quota: 'General',
                }));
                showToast('Reset to National Midnight Corridor (NDLS → MAS)');
              }}
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-[#1a2b47] hover:bg-slate-200 dark:hover:bg-[#23385a] text-slate-700 dark:text-[#d7e3fc] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Reset Popular Route</span>
            </button>
          </div>
        </div>
      </section>

      {/* Filter Chips & Sorting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#101c2e] border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl shadow-xs">
        {/* Type filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            Train Type:
          </span>
          {[
            { id: 'ALL', label: 'All Trains' },
            { id: 'Vande Bharat', label: '⚡ Vande Bharat' },
            { id: 'Rajdhani', label: '👑 Rajdhani' },
            { id: 'Superfast', label: '🚀 Superfast' },
            { id: 'Shatabdi', label: '⭐ Shatabdi' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveTypeFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTypeFilter === f.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#19263c] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#223350]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs shrink-0 self-end sm:self-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 dark:text-[#8d90a0]">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#071325] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
          >
            <option value="departure">Departure Time (Early First)</option>
            <option value="duration">Fastest (Shortest Duration)</option>
            <option value="availability">Highest Seat Availability</option>
            <option value="fare">Lowest Fare First</option>
          </select>
        </div>
      </div>

      {/* Available Trains Count Notice */}
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-[#c3c6d7] px-1">
        <span>
          Showing <strong className="text-blue-600 dark:text-[#7bd0ff]">{matchingTrains.length} trains</strong> for{' '}
          <strong>{searchState.fromCode || 'Any'}</strong> → <strong>{searchState.toCode || 'Any'}</strong> on{' '}
          <strong>{searchState.journeyDate}</strong> ({searchState.quota} Quota)
        </span>
        <span className="hidden sm:inline text-slate-400 text-[11px]">
          Auto-upgradation &amp; Tatkal booking enabled
        </span>
      </div>

      {/* ==================== TRAIN RESULTS LIST ==================== */}
      <div className="space-y-4">
        {matchingTrains.map(train => {
          const selectedClass = selectedClassMap[train.id] || train.classes[0].classType;
          const currentClassObj = train.classes.find(c => c.classType === selectedClass) || train.classes[0];

          return (
            <div
              key={train.id}
              className="w-full bg-white dark:bg-[#101c2e] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-amber-400 opacity-80"></div>

              {/* Train Header: Number, Name, Type, Running Days */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-[#7bd0ff] flex items-center justify-center font-bold text-sm shrink-0 border border-blue-500/20">
                    {train.number.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-base text-slate-900 dark:text-white">
                        {train.name}
                      </span>
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-[#7bd0ff] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30">
                        #{train.number}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          train.type === 'Vande Bharat'
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                            : train.type === 'Rajdhani'
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {train.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-[#8d90a0] mt-1">
                      <span>Runs On:</span>
                      <div className="flex items-center gap-1 font-mono text-[10px] font-bold">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, dIdx) => {
                          const isActive = train.runningDays?.includes(day);
                          return (
                            <span
                              key={dIdx}
                              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                isActive
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                  : 'text-slate-300 dark:text-slate-700'
                              }`}
                            >
                              {day}
                            </span>
                          );
                        })}
                      </div>
                      {train.pantryAvailable && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                          <Utensils className="w-3 h-3 text-amber-500" /> Pantry
                        </span>
                      )}
                      {train.wifiOnboard && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                          <Wifi className="w-3 h-3 text-blue-500" /> Wi-Fi
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedRouteTrain(train)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#1a2b47] text-xs font-semibold text-slate-700 dark:text-[#d7e3fc] flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    <span>Train Schedule ({train.route?.length || 0} Stops)</span>
                  </button>
                </div>
              </div>

              {/* Journey Timing Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-4 items-center">
                {/* Departure */}
                <div className="sm:col-span-3">
                  <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                    {train.departureTime}
                  </div>
                  <div className="font-bold text-xs text-blue-600 dark:text-[#7bd0ff] uppercase tracking-wide">
                    {train.sourceStation} ({train.sourceCode})
                  </div>
                  <div className="text-[11px] text-slate-400">Day 1 • Departure Dock</div>
                </div>

                {/* Duration & Progress Line */}
                <div className="sm:col-span-6 flex flex-col items-center justify-center px-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-[#8d90a0] mb-1">
                    {train.duration} • {train.distanceKm} km
                  </span>
                  <div className="w-full flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-blue-600 dark:border-blue-400 bg-white shrink-0"></span>
                    <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-700 relative">
                      <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#1a2b47] text-[10px] text-slate-500 font-mono">
                        {train.speedKmh ? `${train.speedKmh} km/h` : 'Express'}
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-600 dark:border-emerald-400 bg-emerald-500 shrink-0"></span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">Direct Nocturnal Corridor</span>
                </div>

                {/* Arrival */}
                <div className="sm:col-span-3 sm:text-right">
                  <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                    {train.arrivalTime}
                  </div>
                  <div className="font-bold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    {train.destStation} ({train.destCode})
                  </div>
                  <div className="text-[11px] text-slate-400">Final Terminus</div>
                </div>
              </div>

              {/* Class Availability Selection Grid */}
              <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-[#8d90a0] uppercase tracking-wider">
                    Select Class to Book (Real-Time Availability):
                  </span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    Quota: {searchState.quota}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {train.classes.map(cls => {
                    const isSelected = selectedClass === cls.classType;
                    const isAvailable = cls.status === 'AVAILABLE' && cls.availableSeats > 0;
                    const isRac = cls.status === 'RAC' || cls.availableSeats === 0;

                    return (
                      <div
                        key={cls.classType}
                        onClick={() => handleSelectClass(train.id, cls.classType)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50/80 dark:bg-blue-900/30 border-blue-600 dark:border-blue-400 shadow-sm ring-1 ring-blue-500/30'
                            : 'bg-slate-50/60 dark:bg-[#071325] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {cls.classType}
                          </span>
                          <span className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                            ₹{cls.fare}
                          </span>
                        </div>

                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mb-1">
                          {cls.className}
                        </div>

                        <div
                          className={`text-xs font-mono font-bold ${
                            isAvailable
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : isRac
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isAvailable ? `AVL ${cls.availableSeats}` : isRac ? `RAC ${cls.racNumber || 4}` : 'WL 12'}
                        </div>

                        {cls.tatkalAvailable !== undefined && (
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            Tatkal: {cls.tatkalAvailable} seats
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Selected Class Action Strip */}
                <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 dark:bg-[#14233c] border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {currentClassObj.classType}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {currentClassObj.className} • ₹{currentClassObj.fare} per passenger
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-[#c3c6d7]">
                        {currentClassObj.description || 'Linen provided, climatized comfort, confirmed berth allocation'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleBookTrain(train, currentClassObj.classType)}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Book Now ({currentClassObj.classType})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================== TRAIN SCHEDULE MODAL ==================== */}
      {selectedRouteTrain && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-[#101c2e] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-[#7bd0ff]">
                  #{selectedRouteTrain.number}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedRouteTrain.name} Schedule &amp; Halts
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedRouteTrain.sourceStation} ({selectedRouteTrain.sourceCode}) → {selectedRouteTrain.destStation} ({selectedRouteTrain.destCode})
                </p>
              </div>
              <button
                onClick={() => setSelectedRouteTrain(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Schedule Table */}
            <div className="p-5 overflow-y-auto flex-1 space-y-3">
              <div className="w-full border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-[#071325] text-slate-500 dark:text-[#8d90a0] font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Station</th>
                      <th className="py-2.5 px-3">Arrives</th>
                      <th className="py-2.5 px-3">Departs</th>
                      <th className="py-2.5 px-3">Halt</th>
                      <th className="py-2.5 px-3">Distance</th>
                      <th className="py-2.5 px-3">Platform</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {selectedRouteTrain.route?.map((stop, sIdx) => (
                      <tr key={sIdx} className="hover:bg-slate-50/50 dark:hover:bg-[#14233c]/50">
                        <td className="py-2.5 px-3 font-mono text-slate-400">{stop.sequence}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          {stop.stationName} <span className="font-mono text-blue-600 dark:text-[#7bd0ff]">({stop.stationCode})</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">{stop.arrivalTime}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">{stop.departureTime}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{stop.haltMinutes ? `${stop.haltMinutes}m` : '—'}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{stop.distanceKm} km</td>
                        <td className="py-2.5 px-3 font-bold text-amber-600 dark:text-amber-400">{stop.platform || 'PF 1'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#071325] flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Coaches: {selectedRouteTrain.coachesConfig}
              </span>
              <button
                type="button"
                onClick={() => {
                  const trainToBook = selectedRouteTrain;
                  setSelectedRouteTrain(null);
                  handleBookTrain(trainToBook);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase"
              >
                Proceed to Book This Train
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
