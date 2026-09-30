import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { Train, TrainClassType } from '../types';
import {
  Train as TrainIcon,
  Search,
  ArrowLeftRight,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Copy,
  Check,
  Zap,
  Sparkles,
  Compass,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Info,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    currentUser,
    searchState,
    setSearchState,
    swapStations,
    setActiveView,
    bookings,
    stations,
    trains,
    startBookingForTrain,
    showToast,
  } = useApp();

  // Search input and dropdown states
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Near to user station selector
  const [nearestStationCode, setNearestStationCode] = useState('NDLS');
  const [copiedPnr, setCopiedPnr] = useState<string | null>(null);

  // Confirmed ticket for the Ticket Proof & QR widget
  const activeConfirmedBooking =
    bookings.find(b => b.bookingStatus === 'CONFIRMED') || bookings[0];

  // Previous completed travels
  const previousTravels = useMemo(() => {
    return bookings.filter(
      b => b.bookingStatus === 'COMPLETED' || b.id.includes('2083419028') || b.id.includes('9182736450')
    );
  }, [bookings]);

  // Autocomplete stations
  const filteredFromStations = useMemo(() => {
    const q = fromQuery.toLowerCase().trim();
    if (!q) return stations.slice(0, 7);
    return stations.filter(
      s => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
    );
  }, [stations, fromQuery]);

  const filteredToStations = useMemo(() => {
    const q = toQuery.toLowerCase().trim();
    if (!q) return stations.slice(0, 7);
    return stations.filter(
      s => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
    );
  }, [stations, toQuery]);

  // Train Search matching logic
  const searchResults = useMemo(() => {
    if (!hasSearched) return [];
    const from = (searchState.fromCode || '').toUpperCase().trim();
    const to = (searchState.toCode || '').toUpperCase().trim();

    let list = trains.filter(t => {
      if (from && to && t.sourceCode === from && t.destCode === to) return true;
      if (from && to && t.route && t.route.length > 0) {
        const fromStop = t.route.find(r => r.stationCode.toUpperCase() === from);
        const toStop = t.route.find(r => r.stationCode.toUpperCase() === to);
        if (fromStop && toStop && fromStop.sequence < toStop.sequence) return true;
      }
      if (from && !to && (t.sourceCode === from || t.route?.some(r => r.stationCode.toUpperCase() === from))) return true;
      if (!from && to && (t.destCode === to || t.route?.some(r => r.stationCode.toUpperCase() === to))) return true;
      return false;
    });

    if (list.length === 0) list = trains.slice(0, 6);
    return list;
  }, [trains, searchState.fromCode, searchState.toCode, hasSearched]);

  // Live Next Trains Near to User
  const nextTrainsNearUser = useMemo(() => {
    return [
      {
        trainNo: '12401',
        trainName: 'Midnight Express (Nocturnal Corridor)',
        destination: 'MGR Chennai Central (MAS)',
        departure: '21:30 PM',
        leavesIn: 'Leaves in 24 mins',
        platform: 'PF 04',
        status: 'Boarding Gate 4',
        type: 'Superfast',
        occupancy: '94% Full',
      },
      {
        trainNo: '22436',
        trainName: 'Vande Bharat Express',
        destination: 'Varanasi Junction (BSB)',
        departure: '22:15 PM',
        leavesIn: 'Leaves in 68 mins',
        platform: 'PF 16',
        status: 'On Time',
        type: 'Vande Bharat',
        occupancy: 'Available-18',
      },
      {
        trainNo: '12952',
        trainName: 'Tejas Rajdhani Express',
        destination: 'Mumbai Central (MMCT)',
        departure: '22:45 PM',
        leavesIn: 'Leaves in 1h 38m',
        platform: 'PF 03',
        status: 'On Time',
        type: 'Rajdhani',
        occupancy: 'Available-32',
      },
      {
        trainNo: '12622',
        trainName: 'Tamil Nadu Superfast Express',
        destination: 'MGR Chennai Central (MAS)',
        departure: '23:10 PM',
        leavesIn: 'Leaves in 2h 05m',
        platform: 'PF 02',
        status: 'Expected 10m Delay',
        type: 'Superfast',
        occupancy: 'RAC 04',
      },
    ];
  }, [nearestStationCode]);

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

  const handleExecuteSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    showToast(`Scanning trains for ${searchState.fromCode} → ${searchState.toCode}...`);
  };

  const handleProceedToBookInMyBookings = (train: Train, classType?: TrainClassType) => {
    startBookingForTrain(train, classType || train.classes[0].classType);
    setActiveView('my-bookings');
    showToast(`Loading IRCTC passenger booking form for ${train.name}...`);
  };

  const handleCopyPnr = (pnr: string) => {
    navigator.clipboard?.writeText(pnr);
    setCopiedPnr(pnr);
    showToast(`PNR ${pnr} copied to clipboard!`);
    setTimeout(() => setCopiedPnr(null), 2500);
  };

  return (
    <div className="w-full min-h-[calc(100vh-14rem)] py-4 space-y-8">
      {/* Top Greeting Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 sm:p-6 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#7bd0ff] font-bold">
              Passenger Transit Dashboard • System Synchronized
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {currentUser?.name || 'Snehith Varma'} 👋
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Registered Traveler ID: <span className="font-mono text-[#ffb95f]">ME-984201</span> • Verified Aadhaar KYC
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block font-mono text-xs">
            <div className="text-slate-400 text-[10px] uppercase">IRCTC e-Wallet</div>
            <div className="text-emerald-400 font-bold text-sm">₹4,850.00</div>
          </div>
          <button
            onClick={() => setActiveView('my-bookings')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-600/30 flex items-center gap-2"
          >
            <span>My Bookings Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ==================== 1. SEARCH THE TRAIN FEATURE (IN DASHBOARD ONLY) ==================== */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/15 relative overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-[#7bd0ff] border border-blue-400/30 flex items-center justify-center font-bold">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Search Trains
              </h2>
              <p className="text-xs text-slate-300">
                Check live route seats, section availability (AC &amp; Non-AC), and direct corridor schedules
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hidden sm:inline-block">
            ● Real-Time Indian Railways PRS Sync
          </span>
        </div>

        {/* Search Form Inputs */}
        <form onSubmit={handleExecuteSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
            {/* Origin */}
            <div className="md:col-span-5 relative">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#7bd0ff] mb-1">
                From Station (Origin)
              </label>
              <div
                onClick={() => setShowFromDropdown(true)}
                className="glass-input p-3 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-bold text-sm text-white truncate">
                    {searchState.fromCode ? `${searchState.fromCode} • ${searchState.fromName}` : 'Select From Station'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              {/* Autocomplete Dropdown */}
              {showFromDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-panel p-2 rounded-xl z-50 shadow-2xl border border-white/20 max-h-64 overflow-y-auto">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search city or code (e.g. NDLS, HYB, SC)..."
                    value={fromQuery}
                    onChange={e => setFromQuery(e.target.value)}
                    className="w-full p-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white outline-none mb-1 font-mono"
                  />
                  {filteredFromStations.map(stn => (
                    <div
                      key={stn.id}
                      onClick={() => handleSelectStation('from', stn)}
                      className="p-2 rounded-lg hover:bg-blue-600/30 cursor-pointer flex justify-between items-center text-xs"
                    >
                      <span className="font-bold text-[#7bd0ff] font-mono">{stn.code} - {stn.name}</span>
                      <span className="text-slate-400 text-[11px]">{stn.city}</span>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowFromDropdown(false)}
                    className="w-full text-center py-1 text-[11px] text-slate-400 hover:text-white"
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
                className="w-10 h-10 rounded-full bg-blue-600/20 hover:bg-blue-600 border border-blue-400/40 text-[#7bd0ff] hover:text-white transition-all flex items-center justify-center active:scale-95 shadow-lg"
                title="Swap Stations"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* Destination */}
            <div className="md:col-span-5 relative">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 mb-1">
                To Station (Destination)
              </label>
              <div
                onClick={() => setShowToDropdown(true)}
                className="glass-input p-3 rounded-xl flex items-center justify-between cursor-pointer hover:border-emerald-400 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-sm text-white truncate">
                    {searchState.toCode ? `${searchState.toCode} • ${searchState.toName}` : 'Select To Station'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              {/* Autocomplete Dropdown */}
              {showToDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-panel p-2 rounded-xl z-50 shadow-2xl border border-white/20 max-h-64 overflow-y-auto">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search city or code (e.g. MAS, VSKP, BZA)..."
                    value={toQuery}
                    onChange={e => setToQuery(e.target.value)}
                    className="w-full p-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white outline-none mb-1 font-mono"
                  />
                  {filteredToStations.map(stn => (
                    <div
                      key={stn.id}
                      onClick={() => handleSelectStation('to', stn)}
                      className="p-2 rounded-lg hover:bg-emerald-600/30 cursor-pointer flex justify-between items-center text-xs"
                    >
                      <span className="font-bold text-emerald-400 font-mono">{stn.code} - {stn.name}</span>
                      <span className="text-slate-400 text-[11px]">{stn.city}</span>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowToDropdown(false)}
                    className="w-full text-center py-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Date, Quota, Class, Search Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                Journey Date
              </label>
              <div className="glass-input p-2.5 rounded-xl flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                <input
                  type="text"
                  value={searchState.journeyDate}
                  onChange={e => setSearchState(prev => ({ ...prev, journeyDate: e.target.value }))}
                  className="bg-transparent font-bold text-xs text-white focus:outline-none w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                Booking Quota
              </label>
              <select
                value={searchState.quota}
                onChange={e => setSearchState(prev => ({ ...prev, quota: e.target.value as any }))}
                className="glass-input p-2.5 rounded-xl text-xs font-bold text-white w-full outline-none"
              >
                <option value="General">General (GN)</option>
                <option value="Tatkal">Tatkal (TQ)</option>
                <option value="Ladies">Ladies (LD)</option>
                <option value="Sr. Citizen">Lower Berth / Sr. Citizen (SS)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                Section / Class
              </label>
              <select
                value={searchState.classType}
                onChange={e => setSearchState(prev => ({ ...prev, classType: e.target.value as any }))}
                className="glass-input p-2.5 rounded-xl text-xs font-bold text-white w-full outline-none"
              >
                <option value="ALL">All Sections (AC &amp; Non-AC)</option>
                <option value="1A">AC First Class (1A)</option>
                <option value="2A">AC 2-Tier (2A)</option>
                <option value="3A">AC 3-Tier (3A)</option>
                <option value="SL">Sleeper (Non-AC SL)</option>
                <option value="EC">Executive Chair Car (EC)</option>
                <option value="CC">AC Chair Car (CC)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Search Live Trains</span>
              </button>
            </div>
          </div>
        </form>

        {/* Live Search Results in Dashboard */}
        {hasSearched && (
          <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold text-white">
                Found {searchResults.length} Trains for {searchState.fromCode} → {searchState.toCode}
              </span>
              <span className="text-[#ffb95f] font-mono text-[11px]">
                Click "Book This Train" to enter IRCTC passenger details
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {searchResults.map(trn => (
                <div
                  key={trn.id}
                  className="glass-panel-subtle p-4 rounded-xl border border-white/10 hover:border-blue-400/50 transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#7bd0ff]">#{trn.number}</span>
                        <span className="font-bold text-sm text-white">{trn.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {trn.sourceStation} ({trn.sourceCode}) → {trn.destStation} ({trn.destCode})
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-[#7bd0ff] border border-blue-400/30">
                      {trn.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono py-1 border-y border-white/5">
                    <div>
                      <div className="text-white font-bold">{trn.departureTime}</div>
                      <div className="text-slate-400 text-[10px]">{trn.sourceCode}</div>
                    </div>
                    <div className="text-slate-400 text-[10px]">{trn.duration}</div>
                    <div className="text-right">
                      <div className="text-white font-bold">{trn.arrivalTime}</div>
                      <div className="text-slate-400 text-[10px]">{trn.destCode}</div>
                    </div>
                  </div>

                  {/* Availability Pills */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono">
                      {trn.classes.slice(0, 3).map(cls => (
                        <span
                          key={cls.classType}
                          className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-slate-200"
                        >
                          <strong>{cls.classType}</strong>: ₹{cls.fare}{' '}
                          <span className="text-emerald-400 font-bold">AVL</span>
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleProceedToBookInMyBookings(trn)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] uppercase tracking-wider shrink-0 transition-transform active:scale-95"
                    >
                      Book in My Bookings
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ==================== 2. TICKET RESERVATION QR & TICKET PROOF ==================== */}
      <section className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/15 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Live Ticket Reservation QR &amp; Boarding Proof
              </h2>
              <p className="text-xs text-slate-300">
                Official Digital Boarding Pass with scannable entry token and verified coupe allocation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                window.print();
                showToast('Printing official reservation slip...');
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Proof</span>
            </button>
          </div>
        </div>

        {/* Boarding Pass Ticket Container */}
        {activeConfirmedBooking ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-[#0d1e3d]/80 to-slate-950/80 border border-white/15 shadow-xl relative overflow-hidden">
            {/* Left Ticket Details */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7bd0ff]">
                    INDIAN RAILWAYS NOCTURNAL TRANSIT PASS
                  </span>
                  <div className="text-lg font-extrabold text-white">
                    {activeConfirmedBooking.trainName} ({activeConfirmedBooking.trainNumber})
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#ffb95f]">
                      PNR: {activeConfirmedBooking.pnr}
                    </span>
                    <button
                      onClick={() => handleCopyPnr(activeConfirmedBooking.pnr)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="Copy PNR"
                    >
                      {copiedPnr === activeConfirmedBooking.pnr ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Confirmed • Chart Prepared
                  </span>
                </div>
              </div>

              {/* Journey Strip */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">From</div>
                  <div className="font-bold text-white text-sm">{activeConfirmedBooking.fromStation}</div>
                  <div className="text-[#7bd0ff]">{activeConfirmedBooking.departureTime}</div>
                </div>
                <div className="text-center flex flex-col items-center justify-center">
                  <div className="text-[10px] text-slate-400 uppercase">Travel Date</div>
                  <div className="font-bold text-white">{activeConfirmedBooking.journeyDate}</div>
                  <div className="text-amber-400 font-bold">{activeConfirmedBooking.platform || 'Platform 4'}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase">To</div>
                  <div className="font-bold text-white text-sm">{activeConfirmedBooking.toStation}</div>
                  <div className="text-emerald-400">{activeConfirmedBooking.arrivalTime}</div>
                </div>
              </div>

              {/* Passenger & Berth Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-400">Primary Passenger</div>
                  <div className="font-bold text-white truncate">
                    {activeConfirmedBooking.passengers[0]?.fullName || currentUser?.name || 'Snehith Varma'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Coach &amp; Berth</div>
                  <div className="font-bold text-[#ffb95f]">
                    {activeConfirmedBooking.passengers[0]?.assignedCoach || 'Coach A1'} · {activeConfirmedBooking.passengers[0]?.assignedBerth || '02'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Class &amp; Quota</div>
                  <div className="font-bold text-white">
                    {activeConfirmedBooking.classType} / {activeConfirmedBooking.quota}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Security Hash</div>
                  <div className="font-bold text-emerald-400 truncate">
                    IRCTC-PRS-9842
                  </div>
                </div>
              </div>
            </div>

            {/* Right Verified QR Code Ticket Proof */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-black/60 border border-white/10 text-center">
              <div className="w-36 h-36 bg-white p-2.5 rounded-2xl shadow-xl flex items-center justify-center mb-2">
                <QrCode className="w-full h-full text-slate-950" />
              </div>
              <div className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>IRCTC Gate Scan Verified</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
                Scan at platform barrier or show to TTE conductor during nocturnal corridor transit
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            No active reservation found. Book a journey below to generate digital boarding pass.
          </div>
        )}
      </section>

      {/* ==================== 3. WHAT TRAINS ARE NEXT NEAR TO USER ==================== */}
      <section className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/15 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#ffb95f] border border-amber-400/30 flex items-center justify-center">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Live Next Departures Near You
              </h2>
              <p className="text-xs text-slate-300">
                Next scheduled corridor departures from your nearest major junction
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Terminal Station:</span>
            <select
              value={nearestStationCode}
              onChange={e => setNearestStationCode(e.target.value)}
              className="glass-input px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-white outline-none"
            >
              <option value="NDLS">New Delhi (NDLS)</option>
              <option value="SC">Secunderabad (SC)</option>
              <option value="HYB">Hyderabad Deccan (HYB)</option>
              <option value="VSKP">Visakhapatnam (VSKP)</option>
              <option value="BZA">Vijayawada (BZA)</option>
              <option value="MAS">Chennai Central (MAS)</option>
            </select>
          </div>
        </div>

        {/* Live Trains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {nextTrainsNearUser.map(train => (
            <div
              key={train.trainNo}
              className="glass-panel-subtle p-4 rounded-xl border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between gap-3 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-[#ffb95f]">#{train.trainNo}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-400/20">
                    {train.leavesIn}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-[#7bd0ff] transition-colors leading-snug">
                  {train.trainName}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  To: <span className="text-slate-200 font-semibold">{train.destination}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-400">Scheduled</div>
                  <div className="font-bold text-white">{train.departure}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Dock</div>
                  <div className="font-bold text-amber-400">{train.platform}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Status</div>
                  <div className="font-bold text-emerald-400 text-[11px]">{train.status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 4. OUR PREVIOUS TRAVELS ==================== */}
      <section className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/15 relative overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Our Previous Travels
              </h2>
              <p className="text-xs text-slate-300">
                Completed nocturnal rail voyages and previous passenger itineraries
              </p>
            </div>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {previousTravels.length} Recorded Trips
          </span>
        </div>

        {/* Previous Travels List */}
        <div className="space-y-3">
          {previousTravels.map(prev => (
            <div
              key={prev.id}
              className="glass-panel-subtle p-4 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-purple-300 shrink-0">
                  <TrainIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white">{prev.trainName}</span>
                    <span className="font-mono text-xs text-slate-400">#{prev.trainNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Completed
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {prev.fromStation} → {prev.toStation} • Date: {prev.journeyDate}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono self-end md:self-auto">
                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">Fare Paid</div>
                  <div className="font-bold text-white">₹{prev.totalFare}</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">Berth Alloted</div>
                  <div className="font-bold text-[#ffb95f]">
                    {prev.passengers[0]?.assignedCoach || 'A1'} · {prev.passengers[0]?.assignedBerth || '02'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchState(p => ({
                      ...p,
                      fromCode: prev.fromCode,
                      fromName: prev.fromStation,
                      toCode: prev.toCode,
                      toName: prev.toStation,
                    }));
                    setActiveView('my-bookings');
                    showToast(`Re-booking corridor: ${prev.fromCode} → ${prev.toCode}`);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 border border-blue-400/40 text-[#7bd0ff] hover:text-white font-bold transition-all text-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Re-Book</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
