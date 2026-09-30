import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  VSKP_FACILITIES,
  VSKP_FOOD_OUTLETS,
  VSKP_NEARBY,
} from '../data/seedData';
import {
  Train,
  MapPin,
  Clock,
  Compass,
  Zap,
  Phone,
  PhoneCall,
  ShieldCheck,
  Building,
  Wifi,
  Navigation,
  Car,
  Utensils,
  Share2,
  Printer,
  ChevronRight,
  Layers,
  ArrowRight,
  Star,
  CheckCircle,
  AlertTriangle,
  HeartPulse,
  DoorOpen,
  Briefcase,
  HelpCircle,
} from 'lucide-react';

export const StationServicesPage: React.FC = () => {
  const {
    stations,
    selectedStationForView,
    setSelectedStationForView,
    setActiveView,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('Visakhapatnam Junction (VSKP)');
  const [assistancePassenger, setAssistancePassenger] = useState('Snehith Varma');
  const [assistancePnr, setAssistancePnr] = useState('4821903421');
  const [assistanceService, setAssistanceService] = useState('Wheelchair + Attendant');
  const [assistanceTime, setAssistanceTime] = useState('09:45 AM (Gate 1)');
  const [blueprintExpanded, setBlueprintExpanded] = useState(false);

  const activeStation = selectedStationForView || stations[0];

  const handleStationChipClick = (code: string) => {
    const found = stations.find(s => s.code === code);
    if (found) {
      setSelectedStationForView(found);
      setSearchQuery(`${found.name} (${found.code})`);
      showToast(`Loaded terminal guide for ${found.name}`);
    }
  };

  const handleBookAssistance = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Assistance booked! Porch assistant assigned at Gate 1 for PNR ${assistancePnr}`);
  };

  return (
    <div className="w-full min-h-[calc(100vh-16rem)] py-6 space-y-6">
      {/* Breadcrumb & Status Bar (Screenshot 10) */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#8d90a0]">
          <button onClick={() => setActiveView('dashboard')} className="hover:text-blue-600 transition-colors">
            Dashboard
          </button>
          <span>/</span>
          <span className="hover:text-blue-600">Stations & Travel Services</span>
          <span>/</span>
          <span className="text-blue-700 dark:text-[#7bd0ff] font-bold">
            {activeStation.name} ({activeStation.code})
          </span>
        </nav>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="text-[11px] font-bold text-blue-800 dark:text-[#7bd0ff] uppercase tracking-wider">
            Live Station Hub Telemetry Active • PRS Integrated
          </span>
        </div>
      </section>

      {/* Title & Subtitle Block */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-[#7bd0ff] text-[11px] uppercase tracking-widest font-bold">
              Terminal Information & Navigation
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-widest font-semibold">
              {activeStation.division}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Station Services & Terminal Guide
          </h1>
          <p className="text-sm text-slate-600 dark:text-[#c3c6d7] max-w-3xl mt-1 leading-relaxed">
            Everything you need to know before, during, and after your station visit — platforms, terminal facilities,
            schematic wayfinding, dining options, and multimodal ground connections.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              showToast('Station Guide link copied to clipboard!');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 transition-all shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600 dark:text-[#7bd0ff]" />
            <span>Share Guide</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 transition-all shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-amber-500" />
            <span>Print Blueprint</span>
          </button>
        </div>
      </section>

      {/* Section 2: Interactive Station Search Strip (Screenshot 10) */}
      <section className="p-4 rounded-2xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Station Name or Station Code (e.g. VSKP, HYB, BZA, SC, MAS)..."
              className="w-full pl-10 pr-24 py-3 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={() => handleStationChipClick('VSKP')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-700 dark:text-[#7bd0ff] text-xs font-bold flex items-center gap-1 shadow-2xs"
            >
              <Navigation className="w-3 h-3" /> Near Me
            </button>
          </div>

          <button
            onClick={() => showToast(`Synchronized real-time dispatch for ${searchQuery}`)}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Search Station</span>
          </button>
        </div>

        {/* Quick Station Filter Chips */}
        <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-bold uppercase text-slate-400 text-[10px] tracking-wider mr-1">
            Frequent Terminals:
          </span>
          {['VSKP', 'HYB', 'BZA', 'SC', 'MAS', 'HWH'].map(code => (
            <button
              key={code}
              onClick={() => handleStationChipClick(code)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeStation.code === code
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#14233c] hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeStation.code === code ? 'bg-white' : 'bg-blue-600'}`}></span>
              <span>{code}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Section 3: Station Hero Overview Card (Screenshot 10) */}
      <section className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex flex-col xl:flex-row gap-6 justify-between relative z-10">
          {/* Station Identity Column */}
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-mono font-black text-sm tracking-wider">
                  {activeStation.code}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase">
                  {activeStation.zone}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-[#ffb95f] text-xs font-bold uppercase">
                  {activeStation.category}
                </span>
                {activeStation.isEcoSmart && (
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" /> Platinum Eco-Smart Station
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {activeStation.name} Railway Station
              </h2>
              <p className="text-xs text-slate-600 dark:text-[#8d90a0] flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {activeStation.city}, {activeStation.state} • Coastal Rail Corridor Terminal
                </span>
              </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Platforms</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-black text-blue-700 dark:text-[#7bd0ff]">{activeStation.platforms}</span>
                  <span className="text-slate-500">Active (1-{activeStation.platforms})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Electrification</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-black text-slate-900 dark:text-white">100%</span>
                  <span className="text-blue-700 dark:text-[#7bd0ff] font-semibold">25kV AC</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Daily Footfall</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-black text-amber-600 dark:text-[#ffb95f]">{activeStation.dailyFootfall}</span>
                  <span className="text-slate-500">passengers</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Elevation</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-black text-slate-900 dark:text-white">{activeStation.elevation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry & Action Box */}
          <div className="xl:w-80 flex flex-col justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 font-bold">
                <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">Terminal Status</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Fully Operational
                </span>
              </div>

              <div className="space-y-1.5 text-slate-600 dark:text-[#c3c6d7]">
                <div className="flex justify-between">
                  <span>Concourse & Gates:</span>
                  <strong className="text-blue-700 dark:text-[#7bd0ff]">Open 24/7</strong>
                </div>
                <div className="flex justify-between">
                  <span>Active Track Lines:</span>
                  <strong className="text-slate-800 dark:text-slate-200">8 of 8 Normal</strong>
                </div>
                <div className="flex justify-between">
                  <span>Lifts & Escalators:</span>
                  <strong className="text-amber-700 dark:text-[#ffb95f]">10/10 In Service</strong>
                </div>
                <div className="flex justify-between">
                  <span>RailWire 5G Wi-Fi:</span>
                  <strong className="text-blue-700 dark:text-[#7bd0ff]">142 Mbps (Latency 8ms)</strong>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => showToast(`GPS Coordinates: 17.7215° N, 83.2982° E`)}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex flex-col items-center justify-center gap-0.5 text-slate-700 dark:text-slate-200 font-semibold"
              >
                <Compass className="w-4 h-4 text-amber-500" />
                <span className="text-[10px]">Map Pin</span>
              </button>
              <button
                onClick={() => showToast('Opening turn-by-turn navigation')}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex flex-col items-center justify-center gap-0.5 text-slate-700 dark:text-slate-200 font-semibold"
              >
                <Navigation className="w-4 h-4 text-blue-600 dark:text-[#7bd0ff]" />
                <span className="text-[10px]">Navigate</span>
              </button>
              <button
                onClick={() => showToast('Station bookmarked in favorites')}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex flex-col items-center justify-center gap-0.5 text-slate-700 dark:text-slate-200 font-semibold"
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-[10px]">Favorite</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Two-Column Split - Live Platform Timetable & Schematic Blueprint (Screenshot 10) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Live Platform Timetable */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 rounded bg-blue-600"></span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Live Platform Timetable & Track Status
              </h3>
            </div>
            <span className="text-xs font-bold text-blue-700 dark:text-[#7bd0ff] flex items-center gap-1 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Auto-updating
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              {
                pf: 'PF 01',
                num: '11020',
                name: 'Konark Express',
                route: 'Hyderabad Deccan (HYB) → Bhubaneswar (BBS)',
                arr: '10:20 AM',
                dep: '10:30 AM',
                halt: '10 mins',
                status: 'On Time',
                statusColor: 'emerald',
              },
              {
                pf: 'PF 03',
                num: '12842',
                name: 'Coromandel Superfast Express',
                route: 'MGR Chennai Central (MAS) → Howrah Jn (HWH)',
                arr: '11:10 AM',
                dep: '11:25 AM',
                halt: '15 mins',
                status: 'Exp. 10m Late',
                statusColor: 'amber',
              },
              {
                pf: 'PF 05',
                num: '12727',
                name: 'Godavari Superfast Express',
                route: 'Hyderabad Deccan (HYB) → Visakhapatnam Jn (VSKP)',
                arr: '12:30 PM',
                dep: 'TERMINUS',
                halt: 'PF 5 East Exit',
                status: 'Arriving on Time',
                statusColor: 'emerald',
              },
              {
                pf: 'PF 02',
                num: '20834',
                name: 'Vande Bharat Express',
                route: 'Secunderabad (SC) → Visakhapatnam Jn (VSKP)',
                arr: '14:15 PM',
                dep: 'TERMINUS',
                halt: '16 Coaches (C1-E2)',
                status: 'Platform Allocated',
                statusColor: 'blue',
              },
              {
                pf: 'PF 08',
                num: '18519',
                name: 'Visakhapatnam - LTT Mumbai Express',
                route: 'Visakhapatnam (VSKP) → Lokmanya Tilak Terminus (LTT)',
                arr: '17:45 PM',
                dep: '18:20 PM',
                halt: '22 Coaches Rake',
                status: 'Rake Placed on PF',
                statusColor: 'amber',
              },
            ].map((trn, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 font-bold font-mono">
                      {trn.pf}
                    </span>
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white mr-1.5">
                        #{trn.num} {trn.name}
                      </span>
                      <span className="text-[11px] text-slate-500 block sm:inline">{trn.route}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] self-start sm:self-auto ${
                      trn.statusColor === 'emerald'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : trn.statusColor === 'blue'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    ● {trn.status}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-2 items-center bg-slate-50 dark:bg-[#14233c] p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Arrival</span>
                    <span className="font-bold text-slate-900 dark:text-white">{trn.arr}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Departure</span>
                    <span className="font-bold text-blue-700 dark:text-[#7bd0ff]">{trn.dep}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Halt / Bay</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{trn.halt}</span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => showToast(`Live track radar focused on ${trn.name} at ${trn.pf}`)}
                      className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                    >
                      <span>Track</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Schematic Terminal Blueprint (Screenshot 10) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 rounded bg-amber-500"></span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Terminal Schematic Blueprint
              </h3>
            </div>
            <span className="text-xs text-blue-700 dark:text-[#7bd0ff] font-bold">VSKP Hub Map</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600 dark:text-[#7bd0ff]" />
                <span className="font-bold text-slate-900 dark:text-white">Wayfinding Layer 01</span>
              </div>
              <span className="text-slate-400 font-mono text-[10px]">Lat: 17.7215° N, 83.2982° E</span>
            </div>

            {/* High-Tech Layout Diagram */}
            <div className="bg-slate-50 dark:bg-[#14233c] p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
              {/* Gate 1 */}
              <div className="p-2 rounded-lg bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-700 text-center flex items-center justify-between px-3">
                <span className="font-bold text-amber-700 dark:text-[#ffb95f] flex items-center gap-1">
                  <DoorOpen className="w-3.5 h-3.5" /> GATE 1 (City Side / Main Porch)
                </span>
                <span className="text-[10px] text-slate-400 uppercase">Prepaid Taxi • Auto Stand</span>
              </div>

              {/* Concourse Row */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                <div className="p-2 rounded bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-700 text-blue-700 dark:text-[#7bd0ff]">
                  Security & Scanner
                </div>
                <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200">
                  UTS / ATVM Hub
                </div>
                <div className="p-2 rounded bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-700 text-blue-700 dark:text-[#7bd0ff]">
                  AC Executive Lounge
                </div>
              </div>

              {/* Overbridges */}
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900 text-slate-700 dark:text-slate-300 text-[11px]">
                <span className="text-blue-700 dark:text-[#7bd0ff] font-bold">FOB 1 (Lifts)</span>
                <span className="text-slate-400 font-medium">↔ Skywalk ↔</span>
                <span className="text-amber-700 dark:text-[#ffb95f] font-bold">FOB 2 (Escalators)</span>
              </div>

              {/* Platform Strips */}
              <div className="space-y-1.5">
                {[
                  { id: '1', title: 'Platform 1 (Main Platform)', tags: ['Food Track', 'VIP Lounge', 'Medical'] },
                  { id: '2-3', title: 'Island Platform 2 & 3', tags: ['Vande Bharat', 'Lift Access'] },
                  { id: '4-5', title: 'Island Platform 4 & 5', tags: ['Jan Aahaar', 'Water ATM'] },
                  { id: '6-8', title: 'Platforms 6, 7 & 8', tags: ['Escalator Tower', 'Parcel Depot'] },
                ].map((pf, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {pf.id}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-white text-[11px]">{pf.title}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px]">
                      {pf.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Gate 2 */}
              <div className="p-2 rounded-lg bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-700 text-center flex items-center justify-between px-3">
                <span className="font-bold text-amber-700 dark:text-[#ffb95f] flex items-center gap-1">
                  <DoorOpen className="w-3.5 h-3.5" /> GATE 2 (Gnanapuram Rear Entry)
                </span>
                <span className="text-[10px] text-slate-400 uppercase">Secondary UTS • EV Fast Charge</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setBlueprintExpanded(p => !p)}
                className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-[#14233c] hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold transition-colors"
              >
                {blueprintExpanded ? 'Minimize Blueprint' : 'Expand Blueprint'}
              </button>
              <button
                onClick={() => showToast('Station terminal map dispatched via SMS to your registered mobile number')}
                className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-[#14233c] hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold transition-colors"
              >
                Send Map via SMS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Comprehensive Terminal Facilities 8-Card Grid (Screenshot 10) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 rounded bg-blue-600"></span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Comprehensive Terminal Facilities
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Standardized amenities, waiting zones, and digital accessibility services across all 8 platforms.
            </p>
          </div>
          <span className="text-xs text-blue-700 dark:text-[#7bd0ff] font-bold">Updated 15 mins ago</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {VSKP_FACILITIES.map(fac => (
            <div
              key={fac.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-[#7bd0ff] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform font-bold">
                  <Building className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{fac.name}</h4>
                <p className="text-slate-600 dark:text-[#c3c6d7] mt-1 leading-relaxed text-[11px]">
                  {fac.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold">
                <span className="text-blue-700 dark:text-[#7bd0ff]">{fac.badge}</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#14233c] text-slate-600 dark:text-slate-300">
                  {fac.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: Dine & Refresh at Visakhapatnam Terminal (Screenshot 10) */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Dine & Refresh at Visakhapatnam Terminal
              </h3>
            </div>
            <p className="text-xs text-slate-500">Order freshly prepared meals right to your seat or enjoy quick station dining.</p>
          </div>

          <button
            onClick={() => {
              setActiveView('travel-services');
              showToast('e-Catering menu initialized for seat delivery');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs self-start md:self-auto"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Order Seat Delivery via PNR</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          {VSKP_FOOD_OUTLETS.map(food => (
            <div
              key={food.id}
              className="rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 p-4 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 font-bold text-[10px]">
                    {food.location}
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> {food.rating} ({food.reviewsCount})
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{food.name}</h4>
                <p className="text-slate-600 dark:text-[#c3c6d7] mt-1 text-[11px] leading-relaxed">
                  {food.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {(food.tags || []).map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveView('travel-services');
                  showToast(`Selected ${food.name}`);
                }}
                className="w-full py-2 rounded-lg bg-white dark:bg-[#0f1d33] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700"
              >
                View Dine-in Menu & Rates
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: Ground Transportation Links (Screenshot 10) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Ground Transportation & Station Transit Links
              </h3>
            </div>
            <p className="text-xs text-slate-500">Seamless multimodal connections connecting to airport, beaches, and city nodes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {[
            {
              title: 'Prepaid Taxis & App Cabs',
              tag: 'Fixed Rate',
              desc: 'Dedicated Ola & Uber pickup lanes at Gate 1 (City Side) and Gate 2. Police-administered prepaid taxi counter at Main Exit concourse.',
              bay: 'Pickup Bay: Zone A (Gate 1)',
              rate: 'Direct fixed rates to Airport (~₹350)',
            },
            {
              title: 'City Auto-Rickshaw Stand',
              tag: 'Digital Meter',
              desc: 'Prepaid auto booth verified by Traffic Police. Guaranteed digital meter compliance to Dwaraka RTC Bus Stand, Jagadamba, and Beach Road.',
              bay: 'Pickup Bay: Gate 1 Forecourt',
              rate: 'Operating 24 Hours with standard night fares',
            },
            {
              title: 'RTC City Bus Terminal',
              tag: 'APSRTC Direct',
              desc: 'Buses every 5-10 minutes directly to Dwaraka Bus Station (RTC Complex), RK Beach, Simhachalam Temple, Gajuwaka, and Steel Plant.',
              bay: 'Bus Stop: 120m from Gate 1',
              rate: 'Direct Airport Shuttle (Route 38A)',
            },
            {
              title: 'Park & Ride / EV Hub',
              tag: '60kW DC Fast',
              desc: 'Secure 24-hour monitored overnight vehicle parking with FASTag integration and 4 dedicated DC fast chargers for electric vehicles.',
              bay: 'Location: Gate 2 (Gnanapuram)',
              rate: 'Hourly & Multi-day safe parking',
            },
          ].map((trans, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-[#7bd0ff] flex items-center justify-center font-bold">
                    <Car className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-bold text-[10px]">
                    {trans.tag}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{trans.title}</h4>
                <p className="text-slate-600 dark:text-[#c3c6d7] mt-1 text-[11px] leading-relaxed">
                  {trans.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                <span className="font-bold text-slate-800 dark:text-white block">{trans.bay}</span>
                <span className="text-slate-400">{trans.rate}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 8: Priority Transit Assistance Desk (Screenshot 10) */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-[#7bd0ff] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Priority Transit Assistance • Divyangjan Services
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Differently-Abled & Senior Citizen Assistance Desk
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
              Midnight Express and Indian Railways provide round-the-clock complimentary wheelchair support and motorized
              golf buggy transit between platforms. Dedicated trained escorts assist from the main station porch
              directly to your train coach berth.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block">Free Wheelchair Facility</span>
                <span className="text-slate-500 text-[11px]">Available at Gate 1 Information Desk & Station Master</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block">Battery Golf Buggy</span>
                <span className="text-slate-500 text-[11px]">Seamless transfer across Platforms 1 through 8 via lifts</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1 text-xs text-slate-600 dark:text-[#c3c6d7]">
              <span>Direct Assistance Hotline: <strong className="text-blue-700 dark:text-[#7bd0ff]">+91 891 2746200</strong></span>
              <span>Rail Madad: <strong className="text-amber-600">139 (Dial 6)</strong></span>
            </div>
          </div>

          {/* Quick Request Form */}
          <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Book Station Assistance</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px]">Free Service</span>
            </div>

            <form onSubmit={handleBookAssistance} className="space-y-2.5 pt-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-0.5">
                  Passenger Name
                </label>
                <input
                  type="text"
                  required
                  value={assistancePassenger}
                  onChange={e => setAssistancePassenger(e.target.value)}
                  className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-0.5">
                    PNR Number
                  </label>
                  <input
                    type="text"
                    required
                    value={assistancePnr}
                    onChange={e => setAssistancePnr(e.target.value)}
                    className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-0.5">
                    Service Type
                  </label>
                  <select
                    value={assistanceService}
                    onChange={e => setAssistanceService(e.target.value)}
                    className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1.5 text-xs font-medium"
                  >
                    <option>Wheelchair + Attendant</option>
                    <option>Battery Buggy Transfer</option>
                    <option>Visual/Blind Escort</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-0.5">
                  Arrival at Gate
                </label>
                <input
                  type="text"
                  value={assistanceTime}
                  onChange={e => setAssistanceTime(e.target.value)}
                  className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-xs font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm mt-2"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Confirm Assistance Booking</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Section 9: Around Station & Passenger Checklist (Screenshot 10) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded bg-blue-600"></span>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Around Visakhapatnam Junction
            </h3>
          </div>
          <button
            onClick={() => setActiveView('travel-services')}
            className="text-xs font-bold text-blue-700 dark:text-[#7bd0ff] hover:underline flex items-center gap-1"
          >
            <span>Explore Vizag Transit Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {VSKP_NEARBY.map(point => (
            <div
              key={point.id}
              className="p-4 rounded-xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 font-bold text-[10px]">
                    {point.distance} • {point.driveTime}
                  </span>
                  {point.rating && (
                    <span className="text-amber-600 font-bold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500" /> {point.rating}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{point.name}</h4>
                <p className="text-slate-600 dark:text-[#c3c6d7] mt-1 text-[11px] leading-relaxed">
                  {point.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {point.price && <span className="font-bold text-slate-900 dark:text-white">{point.price}</span>}
                <button
                  onClick={() => showToast(`Selected ${point.name}`)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
                >
                  Book / Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advisory Checklist Strip */}
      <section className="p-5 rounded-2xl bg-blue-50/70 dark:bg-[#14233c] border border-blue-200 dark:border-blue-900/60 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-blue-700 dark:text-[#7bd0ff]" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Passenger Advisory Checklist: Before You Arrive at the Station
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          {[
            'Keep Digital Ticket QR ready on mobile',
            'Arrive 30-45 mins prior to departure',
            'Check Coach Display Boards (CDB) on PF',
            'Carry valid Gov ID (Aadhaar/DL/Passport)',
            'Keep contact tags on all checked baggage',
            'Rail Madad installed for on-train help',
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white dark:bg-[#0f1d33] border border-slate-200/80 dark:border-slate-700 flex items-start gap-2 shadow-2xs"
            >
              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-[#7bd0ff] shrink-0 mt-0.5" />
              <span className="font-medium text-slate-800 dark:text-slate-200 text-[11px] leading-snug">
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
