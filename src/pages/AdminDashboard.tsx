import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Station, Train } from '../types';
import {
  Database,
  Users,
  Train as TrainIcon,
  MapPin,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  PlusCircle,
  Trash2,
  Edit3,
  FileText,
  Download,
  Terminal,
  Play,
  Layers,
  Search,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    stations,
    trains,
    bookings,
    addStation,
    deleteStation,
    addTrain,
    deleteTrain,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'stations' | 'trains' | 'bookings' | 'dbms'>('overview');

  // New station form modal state
  const [showAddStation, setShowAddStation] = useState(false);
  const [newStnCode, setNewStnCode] = useState('');
  const [newStnName, setNewStnName] = useState('');
  const [newStnCity, setNewStnCity] = useState('');
  const [newStnPlatforms, setNewStnPlatforms] = useState(6);
  const [newStnZone, setNewStnZone] = useState('South Central Railway (SCR)');

  // New train form state
  const [showAddTrain, setShowAddTrain] = useState(false);
  const [newTrnNum, setNewTrnNum] = useState('');
  const [newTrnName, setNewTrnName] = useState('');
  const [newTrnSource, setNewTrnSource] = useState('HYB');
  const [newTrnDest, setNewTrnDest] = useState('VSKP');
  const [newTrnDep, setNewTrnDep] = useState('07:30 AM');
  const [newTrnArr, setNewTrnArr] = useState('14:00 PM');
  const [newTrnType, setNewTrnType] = useState<'Superfast' | 'Vande Bharat' | 'Express'>('Superfast');

  // SQL Query Runner simulation
  const [sqlQuery, setSqlQuery] = useState(`SELECT b.pnr, b.train_name, b.total_fare, b.booking_status, p.txn_id 
FROM bookings b 
JOIN payments p ON b.id = p.booking_id 
ORDER BY b.booked_at DESC 
LIMIT 5;`);
  const [sqlOutput, setSqlOutput] = useState<string | null>(null);

  // Compute metrics
  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'SUCCESS')
    .reduce((acc, curr) => acc + curr.totalFare, 0);

  const totalCancellations = bookings.filter(b => b.bookingStatus === 'CANCELLED').length;
  const activeBookingsCount = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length;

  const handleCreateStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStnCode.trim()) return;

    const newStn: Station = {
      id: 'stn-' + newStnCode.toLowerCase(),
      code: newStnCode.toUpperCase(),
      name: newStnName,
      city: newStnCity,
      state: 'Andhra Pradesh',
      platforms: newStnPlatforms,
      zone: newStnZone,
      division: 'Div-01',
      category: 'NSG-2 Major Terminal',
      elevation: '25 m Above MSL',
      dailyFootfall: '~75,000',
      isEcoSmart: true,
    };

    addStation(newStn);
    setNewStnCode('');
    setNewStnName('');
    setNewStnCity('');
    setShowAddStation(false);
  };

  const handleCreateTrain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrnNum.trim()) return;

    const newTrainObj: Train = {
      id: 'trn-' + newTrnNum,
      number: newTrnNum,
      name: newTrnName,
      type: newTrnType,
      sourceStation: newTrnSource === 'HYB' ? 'Hyderabad Deccan' : newTrnSource,
      sourceCode: newTrnSource,
      destStation: newTrnDest === 'VSKP' ? 'Visakhapatnam Jn' : newTrnDest,
      destCode: newTrnDest,
      departureTime: newTrnDep,
      arrivalTime: newTrnArr,
      duration: '6h 30m',
      distanceKm: 420,
      runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      speedKmh: 105,
      pantryAvailable: true,
      wifiOnboard: true,
      coachesConfig: '22 Coach LHB Rake',
      classes: [
        { classType: '2A', className: 'AC 2 Tier', fare: 1350, availableSeats: 32, status: 'AVAILABLE' },
        { classType: '3A', className: 'AC 3 Tier', fare: 950, availableSeats: 64, status: 'AVAILABLE' },
        { classType: 'SL', className: 'Sleeper', fare: 380, availableSeats: 120, status: 'AVAILABLE' },
      ],
      route: [
        { stationCode: newTrnSource, stationName: newTrnSource, sequence: 1, arrivalTime: 'Source', departureTime: newTrnDep, haltMinutes: 0, distanceKm: 0, platform: 'PF 01', dayCount: 1 },
        { stationCode: newTrnDest, stationName: newTrnDest, sequence: 2, arrivalTime: newTrnArr, departureTime: 'Terminus', haltMinutes: 0, distanceKm: 420, platform: 'PF 02', dayCount: 1 },
      ],
    };

    addTrain(newTrainObj);
    setNewTrnNum('');
    setNewTrnName('');
    setShowAddTrain(false);
  };

  const handleRunSql = () => {
    setSqlOutput(`Running relational query engine...
---------------------------------------------------------------------------------------
Rows fetched: 3 rows in 2.14 ms (Index Scan on idx_pnr)

| PNR        | TRAIN_NAME                  | TOTAL_FARE | BOOKING_STATUS | TXN_ID             |
|------------|-----------------------------|------------|----------------|--------------------|
| 4827163950 | Godavari Superfast Express  | ₹1,240.00  | CONFIRMED      | TXN-984271892187   |
| 2910482019 | Seshadri Express            | ₹865.00    | CONFIRMED      | TXN-821947219034   |
| 1109384729 | Charminar Express           | ₹1,580.00  | CONFIRMED      | TXN-719384918234   |
---------------------------------------------------------------------------------------
✓ Transaction Log: Serializable isolation enforced. Zero lock contention.`);
    showToast('SQL Query executed successfully in MySQL Relational Engine simulator');
  };

  const exportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,PNR,TrainNumber,TrainName,Date,Class,TotalFare,Status\n' +
      bookings.map(b => `${b.pnr},${b.trainNumber},"${b.trainName}",${b.journeyDate},${b.classType},${b.totalFare},${b.bookingStatus}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'midnight_express_bookings_ledger.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV export downloaded successfully');
  };

  return (
    <div className="w-full min-h-[calc(100vh-16rem)] py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300 font-mono text-[10px] font-bold uppercase">
              CHIEF CONTROLLER ACCESS
            </span>
            <span className="text-xs text-slate-500">v4.2.0-SECURE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Railway Operations & Relational DBMS Hub
          </h1>
        </div>

        <button
          onClick={exportCsv}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#14233c] hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-blue-600 dark:text-[#7bd0ff]" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Bookings</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{activeBookingsCount}</span>
            <span className="text-emerald-600 font-semibold">100% CNF</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Revenue</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-blue-700 dark:text-[#7bd0ff]">
              ₹{totalRevenue.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Fleet Trains</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{trains.length}</span>
            <span className="text-slate-500">Live Corridors</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Cancellations</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-rose-600">{totalCancellations}</span>
            <span className="text-slate-500">Auto-Refunded</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'Operations Overview' },
          { id: 'stations', label: `Manage Stations (${stations.length})` },
          { id: 'trains', label: `Manage Trains (${trains.length})` },
          { id: 'bookings', label: `Passenger Ledger (${bookings.length})` },
          { id: 'dbms', label: 'DBMS Relational Schema & SQL Simulator' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OPERATIONS OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Recent Reservations Log */}
          <div className="bg-white dark:bg-[#0f1d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Recent Booking Transactions
            </h3>
            <div className="space-y-2">
              {bookings.slice(0, 5).map(b => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-bold text-blue-700 dark:text-[#7bd0ff]">PNR #{b.pnr}</span>
                    <span className="text-slate-900 dark:text-white font-semibold ml-2">{b.trainName}</span>
                    <div className="text-[11px] text-slate-400">
                      {b.userName} • {b.fromCode} → {b.toCode} • {b.passengers.length} Berth(s)
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-white block">₹{b.totalFare.toFixed(2)}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">{b.bookingStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Fleet Utilization */}
          <div className="bg-white dark:bg-[#0f1d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TrainIcon className="w-4 h-4 text-blue-600 dark:text-[#7bd0ff]" /> Fleet Capacity & Load Factor
            </h3>
            <div className="space-y-2.5">
              {trains.map(t => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 space-y-1"
                >
                  <div className="flex justify-between font-semibold">
                    <span>
                      #{t.number} {t.name}
                    </span>
                    <span className="text-blue-700 dark:text-[#7bd0ff] font-bold">
                      {t.sourceCode} → {t.destCode}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{t.coachesConfig}</span>
                    <span>88% Avg Berth Load Factor</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE STATIONS */}
      {activeTab === 'stations' && (
        <div className="bg-white dark:bg-[#0f1d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white text-sm">Railway Stations Directory</span>
            <button
              onClick={() => setShowAddStation(p => !p)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Add Station
            </button>
          </div>

          {/* Add Station Modal Form */}
          {showAddStation && (
            <form
              onSubmit={handleCreateStation}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <span className="font-bold text-slate-900 dark:text-white block">Add New Railway Station</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-0.5">Station Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TPTY"
                    value={newStnCode}
                    onChange={e => setNewStnCode(e.target.value.toUpperCase())}
                    className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-0.5">Station Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tirupati Main"
                    value={newStnName}
                    onChange={e => setNewStnName(e.target.value)}
                    className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-0.5">Platforms</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={newStnPlatforms}
                    onChange={e => setNewStnPlatforms(parseInt(e.target.value) || 1)}
                    className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
              </div>
              <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">
                Save Station
              </button>
            </form>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5">Code</th>
                  <th>Station Name</th>
                  <th>Division / Zone</th>
                  <th>Platforms</th>
                  <th>Category</th>
                  <th>Footfall</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stations.map(stn => (
                  <tr key={stn.id} className="hover:bg-slate-50 dark:hover:bg-[#14233c]/60">
                    <td className="py-2.5 font-mono font-bold text-blue-700 dark:text-[#7bd0ff]">{stn.code}</td>
                    <td className="font-semibold text-slate-900 dark:text-white">{stn.name}</td>
                    <td className="text-slate-500">{stn.zone}</td>
                    <td className="font-semibold">{stn.platforms} PFs</td>
                    <td>{stn.category}</td>
                    <td className="text-slate-500">{stn.dailyFootfall}</td>
                    <td className="text-right">
                      <button
                        onClick={() => deleteStation(stn.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete Station"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE TRAINS */}
      {activeTab === 'trains' && (
        <div className="bg-white dark:bg-[#0f1d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white text-sm">Active Fleet Trains</span>
            <button
              onClick={() => setShowAddTrain(p => !p)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Add Train
            </button>
          </div>

          {showAddTrain && (
            <form
              onSubmit={handleCreateTrain}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <span className="font-bold text-slate-900 dark:text-white block">Add Fleet Train to PRS Dispatch</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-0.5">Train Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12760"
                    value={newTrnNum}
                    onChange={e => setNewTrnNum(e.target.value)}
                    className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 font-mono font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-0.5">Train Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Charminar Superfast Express"
                    value={newTrnName}
                    onChange={e => setNewTrnName(e.target.value)}
                    className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-0.5">Type</label>
                  <select
                    value={newTrnType}
                    onChange={e => setNewTrnType(e.target.value as any)}
                    className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1.5"
                  >
                    <option value="Superfast">Superfast</option>
                    <option value="Vande Bharat">Vande Bharat</option>
                    <option value="Express">Express</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">
                Save Train Schedule
              </button>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5">Number</th>
                  <th>Train Name</th>
                  <th>Route Segment</th>
                  <th>Timing</th>
                  <th>Type</th>
                  <th>Classes</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {trains.map(trn => (
                  <tr key={trn.id} className="hover:bg-slate-50 dark:hover:bg-[#14233c]/60">
                    <td className="py-2.5 font-mono font-bold text-blue-700 dark:text-[#7bd0ff]">#{trn.number}</td>
                    <td className="font-semibold text-slate-900 dark:text-white">{trn.name}</td>
                    <td className="text-slate-600 dark:text-slate-300">
                      {trn.sourceCode} → {trn.destCode}
                    </td>
                    <td className="font-mono">
                      {trn.departureTime} - {trn.arrivalTime}
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-[10px]">
                        {trn.type}
                      </span>
                    </td>
                    <td className="text-slate-500">
                      {trn.classes.map(c => c.classType).join(', ')}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => deleteTrain(trn.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete Train"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PASSENGER LEDGER */}
      {activeTab === 'bookings' && (
        <div className="bg-white dark:bg-[#0f1d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white text-sm">Full Reservation Records Ledger</span>
            <span className="font-mono text-slate-500">Total: {bookings.length} Bookings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5">PNR</th>
                  <th>Passenger</th>
                  <th>Train</th>
                  <th>Route</th>
                  <th>Coach & Berth</th>
                  <th>Fare</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-[#14233c]/60">
                    <td className="py-2.5 font-mono font-bold text-blue-700 dark:text-[#7bd0ff]">{b.pnr}</td>
                    <td className="font-semibold text-slate-900 dark:text-white">{b.userName}</td>
                    <td>
                      #{b.trainNumber} {b.trainName}
                    </td>
                    <td className="text-slate-500">
                      {b.fromCode} → {b.toCode}
                    </td>
                    <td className="font-bold text-blue-600 dark:text-[#7bd0ff]">
                      {b.passengers[0]?.assignedCoach} • {b.passengers[0]?.assignedBerth}
                    </td>
                    <td className="font-mono font-bold">₹{b.totalFare.toFixed(2)}</td>
                    <td className="text-slate-500">{b.paymentMethod.split(' ')[0]}</td>
                    <td>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.bookingStatus === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: DBMS RELATIONAL SCHEMA & SQL SIMULATOR (University / B.Tech Project Showcase) */}
      {activeTab === 'dbms' && (
        <div className="space-y-6 text-xs">
          {/* Relational Schema Architecture Visualizer */}
          <div className="bg-white dark:bg-[#0f1d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600 dark:text-[#7bd0ff]" />
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  Relational Database Architecture (3NF Normal Form)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-mono font-bold text-[10px]">
                MySQL 8.0 Compatible
              </span>
            </div>

            <p className="text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
              Designed as a formal student DBMS project demonstrating Third Normal Form (3NF), Primary & Foreign Key integrity constraints, composite indexes for high-frequency PRS searches, and ACID transaction safety for simultaneous seat reservations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  table: 'USERS',
                  pk: 'user_id (UUID)',
                  fks: 'None',
                  cols: 'email, password_hash, full_name, mobile, role, aadhaar_status, created_at',
                },
                {
                  table: 'STATIONS',
                  pk: 'station_id (UUID)',
                  fks: 'None (Unique code: HYB, VSKP)',
                  cols: 'code, name, city, state, platforms, zone, division, category, elevation',
                },
                {
                  table: 'TRAINS',
                  pk: 'train_id (INT)',
                  fks: 'source_station_id, dest_station_id',
                  cols: 'train_number, train_name, train_type, departure_time, arrival_time, distance_km',
                },
                {
                  table: 'TRAIN_ROUTES',
                  pk: 'route_id (INT)',
                  fks: 'train_id, station_id',
                  cols: 'sequence_number, arrival_time, departure_time, halt_minutes, platform_no',
                },
                {
                  table: 'BOOKINGS',
                  pk: 'booking_id (UUID)',
                  fks: 'user_id, train_id',
                  cols: 'pnr (CHAR 10 UNIQUE), journey_date, class_code, quota, total_fare, booking_status',
                },
                {
                  table: 'BOOKING_PASSENGERS',
                  pk: 'passenger_id (UUID)',
                  fks: 'booking_id, seat_id',
                  cols: 'full_name, age, gender, berth_preference, assigned_coach, assigned_berth',
                },
                {
                  table: 'PAYMENTS',
                  pk: 'payment_id (UUID)',
                  fks: 'booking_id',
                  cols: 'txn_id (UNIQUE), amount, payment_method, payment_status, paid_at',
                },
                {
                  table: 'CANCELLATIONS',
                  pk: 'cancellation_id (UUID)',
                  fks: 'booking_id',
                  cols: 'cancellation_charge, refund_amount, refund_txn_id, cancelled_at',
                },
                {
                  table: 'SEATS & COACHES',
                  pk: 'seat_id (INT)',
                  fks: 'coach_id, train_id',
                  cols: 'coach_number, seat_number, berth_type (LB, MB, UB, SL), status (AVAILABLE, BOOKED)',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 space-y-1.5"
                >
                  <div className="flex items-center justify-between font-mono font-bold text-blue-700 dark:text-[#7bd0ff] text-sm">
                    <span>{item.table}</span>
                    <span className="text-[10px] text-slate-400">TABLE</span>
                  </div>
                  <div className="text-[11px]">
                    <span className="text-amber-600 font-bold">PK: </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{item.pk}</span>
                  </div>
                  <div className="text-[11px]">
                    <span className="text-slate-400 font-bold">FK: </span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">{item.fks}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                    {item.cols}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACID Transaction Logic Diagram */}
          <div className="bg-white dark:bg-[#0f1d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              ACID Transaction Flow: Reservation & Seat Locking
            </h3>
            <div className="p-4 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs leading-relaxed overflow-x-auto shadow-inner">
              <p className="text-slate-400">-- 1. Begin atomic transaction to prevent race conditions & double-booking</p>
              <p className="text-emerald-400">START TRANSACTION;</p>
              <p className="pl-4">SELECT * FROM seats WHERE train_id = 12727 AND coach = 'B1' AND status = 'AVAILABLE' FOR UPDATE;</p>
              <p className="pl-4">INSERT INTO bookings (id, pnr, train_id, user_id, journey_date, total_fare, booking_status)</p>
              <p className="pl-8">VALUES ('bk-4827163950', '4827163950', 12727, 'user-01', '2026-09-28', 1240.00, 'CONFIRMED');</p>
              <p className="pl-4">INSERT INTO booking_passengers (id, booking_id, full_name, coach, berth) VALUES (...);</p>
              <p className="pl-4">INSERT INTO payments (id, booking_id, txn_id, amount, status) VALUES (...);</p>
              <p className="pl-4">UPDATE seats SET status = 'BOOKED' WHERE seat_id IN (21, 22);</p>
              <p className="text-emerald-400">COMMIT;</p>
              <p className="text-slate-400 mt-2">-- If any seat becomes unavailable or payment times out: ROLLBACK;</p>
            </div>
          </div>

          {/* Interactive SQL Console Simulation */}
          <div className="bg-white dark:bg-[#0f1d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-600 dark:text-[#7bd0ff]" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Interactive MySQL Console Simulator
                </h3>
              </div>
              <button
                onClick={handleRunSql}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Play className="w-3.5 h-3.5" /> Run Query
              </button>
            </div>

            <textarea
              rows={4}
              value={sqlQuery}
              onChange={e => setSqlQuery(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl outline-none border border-slate-700 shadow-inner"
            />

            {sqlOutput && (
              <pre className="p-3 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                {sqlOutput}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
