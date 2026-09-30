import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { Train, TrainClassType, Booking, Passenger } from '../types';
import {
  Train as TrainIcon,
  Ticket,
  Search,
  CheckCircle,
  Clock,
  ArrowRight,
  Printer,
  Trash2,
  ShieldCheck,
  Radar,
  X,
  CreditCard,
  MapPin,
  Calendar,
  Utensils,
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  QrCode,
  FileText,
  User,
  Phone,
  Mail,
  Users,
  Plus,
  ArrowLeftRight,
  ChevronDown,
  Layers,
  Zap,
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const {
    bookings,
    cancelBooking,
    findBookingByPnr,
    currentUser,
    stations,
    trains,
    bookingDraft,
    setBookingDraft,
    completeBooking,
    showToast,
  } = useApp();

  // Mode switcher: 'book-new' (default/interactive) vs 'ledger' (my active & past tickets)
  const [activeMode, setActiveMode] = useState<'book-new' | 'ledger'>('book-new');

  // Booking step: 1: Select Train, 2: Enter IRCTC Passenger Data, 3: Payment, 4: Confirmed Ticket
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4>(1);

  // Train selection states
  const [fromCode, setFromCode] = useState('NDLS');
  const [toCode, setToCode] = useState('MAS');
  const [travelDate, setTravelDate] = useState('29 Sep 2026');
  const [sectionFilter, setSectionFilter] = useState<'ALL' | 'AC' | 'NON_AC'>('ALL');
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(trains[0] || null);
  const [selectedClass, setSelectedClass] = useState<TrainClassType>('2A');

  // IRCTC Passenger & Booking Data Form
  const [passengers, setPassengers] = useState<
    Array<{
      id: string;
      fullName: string;
      age: number;
      gender: 'M' | 'F' | 'TG';
      berthPreference: 'LB' | 'MB' | 'UB' | 'SL' | 'SU' | 'NONE';
      foodOption: 'VEG' | 'NONVEG' | 'JAIN' | 'NONE';
    }>
  >([
    {
      id: 'pax-1',
      fullName: currentUser?.name || 'Snehith Varma',
      age: 24,
      gender: 'M',
      berthPreference: 'LB',
      foodOption: 'VEG',
    },
  ]);

  // Contact info
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || 'snehith@midnight.express');
  const [boardingStation, setBoardingStation] = useState('NDLS');

  // Destination Address & IRCTC PRS Fields
  const [destAddressLine, setDestAddressLine] = useState('Flat 402, Royal Palms, Beach Road');
  const [destPinCode, setDestPinCode] = useState('530002');
  const [destCity, setDestCity] = useState('Visakhapatnam');
  const [destState, setDestState] = useState('Andhra Pradesh');

  // Optional Infant & Nominee Details
  const [hasInfant, setHasInfant] = useState(false);
  const [infantName, setInfantName] = useState('');
  const [infantAge, setInfantAge] = useState(2);
  const [infantGender, setInfantGender] = useState<'M' | 'F'>('M');
  const [nomineeName, setNomineeName] = useState('Varma Family Trust');

  // IRCTC options
  const [autoUpgrade, setAutoUpgrade] = useState(true);
  const [confirmOnly, setConfirmOnly] = useState(false);
  const [travelInsurance, setTravelInsurance] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARDS' | 'NETBANKING' | 'WALLET'>('UPI');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Generated confirmed booking
  const [confirmedBookingResult, setConfirmedBookingResult] = useState<Booking | null>(null);

  // Ledger states
  const [ledgerTab, setLedgerTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [pnrSearchInput, setPnrSearchInput] = useState('');
  const [trackedBooking, setTrackedBooking] = useState<Booking | null>(null);
  const [copiedPnr, setCopiedPnr] = useState<string | null>(null);
  const [viewTicketModal, setViewTicketModal] = useState<Booking | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelSuccessData, setCancelSuccessData] = useState<{ refund: number; charge: number } | null>(null);

  // Filter matching trains for train selection
  const matchingTrains = useMemo(() => {
    const f = fromCode.toUpperCase().trim();
    const t = toCode.toUpperCase().trim();

    let list = trains.filter(trn => {
      if (f && t && trn.sourceCode === f && trn.destCode === t) return true;
      if (f && t && trn.route && trn.route.length > 0) {
        const fromStop = trn.route.find(r => r.stationCode.toUpperCase() === f);
        const toStop = trn.route.find(r => r.stationCode.toUpperCase() === t);
        if (fromStop && toStop && fromStop.sequence < toStop.sequence) return true;
      }
      if (f && !t && (trn.sourceCode === f || trn.route?.some(r => r.stationCode.toUpperCase() === f))) return true;
      if (!f && t && (trn.destCode === t || trn.route?.some(r => r.stationCode.toUpperCase() === t))) return true;
      return false;
    });

    if (list.length === 0) list = trains.slice(0, 8);

    if (sectionFilter === 'AC') {
      list = list.filter(trn => trn.classes.some(c => ['1A', '2A', '3A', '3E', 'EC', 'CC'].includes(c.classType)));
    } else if (sectionFilter === 'NON_AC') {
      list = list.filter(trn => trn.classes.some(c => ['SL', '2S'].includes(c.classType)));
    }

    return list;
  }, [trains, fromCode, toCode, sectionFilter]);

  // Fare calculations
  const fareBreakdown = useMemo(() => {
    if (!selectedTrain) return { base: 0, total: 0, gst: 0, insurance: 0 };
    const classObj = selectedTrain.classes.find(c => c.classType === selectedClass) || selectedTrain.classes[0];
    const basePerPax = classObj ? classObj.fare : 1200;
    const paxCount = passengers.length;
    const baseTotal = basePerPax * paxCount;
    const surcharge = 60 * paxCount;
    const gst = Math.round(baseTotal * 0.05);
    const insurance = travelInsurance ? 0.45 * paxCount : 0;
    const total = baseTotal + surcharge + gst + insurance + 15; // 15 gateway fee

    return {
      base: baseTotal,
      surcharge,
      gst,
      insurance,
      gateway: 15,
      total: Math.round(total * 100) / 100,
    };
  }, [selectedTrain, selectedClass, passengers.length, travelInsurance]);

  // Handle adding co-passenger
  const handleAddPassenger = () => {
    if (passengers.length >= 6) {
      showToast('Maximum 6 passengers allowed per IRCTC booking');
      return;
    }
    const newId = `pax-${passengers.length + 1}`;
    setPassengers(prev => [
      ...prev,
      {
        id: newId,
        fullName: '',
        age: 22,
        gender: 'M',
        berthPreference: 'NONE',
        foodOption: 'VEG',
      },
    ]);
  };

  const handleRemovePassenger = (id: string) => {
    if (passengers.length <= 1) return;
    setPassengers(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdatePassenger = (id: string, field: string, value: any) => {
    setPassengers(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Complete Payment & Generate Confirmed Ticket
  const handleFinalizeBooking = () => {
    if (!selectedTrain) return;

    // Validate
    const invalidPax = passengers.find(p => !p.fullName.trim());
    if (invalidPax) {
      showToast('Please enter full passenger name for all travelers');
      setBookingStep(2);
      return;
    }

    setIsProcessingPayment(true);
    showToast('Authorizing payment with IRCTC Payment Gateway...');

    setTimeout(() => {
      const generatedPnr = Math.floor(2000000000 + Math.random() * 7999999999).toString();
      const primaryPaxName = passengers[0]?.fullName || currentUser?.name || 'Snehith Varma';

      const newBooking: Booking = {
        id: `bk-${generatedPnr}`,
        pnr: generatedPnr,
        userId: currentUser?.id || 'user-01',
        userEmail: contactEmail,
        userName: primaryPaxName,
        trainNumber: selectedTrain.number,
        trainName: selectedTrain.name,
        trainType: selectedTrain.type,
        fromStation: `${selectedTrain.sourceStation} (${selectedTrain.sourceCode})`,
        fromCode: selectedTrain.sourceCode,
        toStation: `${selectedTrain.destStation} (${selectedTrain.destCode})`,
        toCode: selectedTrain.destCode,
        boardingStation: boardingStation,
        boardingCode: boardingStation,
        departureTime: selectedTrain.departureTime,
        arrivalTime: selectedTrain.arrivalTime,
        journeyDate: travelDate,
        classType: selectedClass,
        quota: 'General',
        passengers: passengers.map((p, idx) => ({
          id: p.id,
          fullName: p.fullName,
          age: p.age,
          gender: p.gender,
          berthPreference: p.berthPreference,
          foodOption: p.foodOption,
          nationality: 'India',
          assignedCoach: selectedClass.startsWith('1') ? 'Coach H1' : selectedClass.startsWith('2') ? 'Coach A1' : 'Coach B2',
          assignedBerth: String(idx * 3 + 2).padStart(2, '0'),
          assignedBerthType: p.berthPreference === 'NONE' ? 'Lower Berth' : p.berthPreference,
          status: 'CONFIRMED',
          aadhaarVerified: true,
        })),
        contactMobile: contactPhone,
        contactEmail: contactEmail,
        baseFare: fareBreakdown.base,
        reservationSurcharge: fareBreakdown.surcharge || 60,
        superfastLevy: 60,
        gstAmount: fareBreakdown.gst,
        cateringCharge: 180,
        insuranceCharge: fareBreakdown.insurance,
        gatewayFee: 15,
        totalFare: fareBreakdown.total,
        paymentMethod: paymentMethod === 'UPI' ? 'UPI • Google Pay' : paymentMethod === 'WALLET' ? 'IRCTC Rail e-Wallet' : 'Credit Card',
        transactionId: `TXN-${Date.now().toString().slice(-10)}`,
        paymentStatus: 'SUCCESS',
        bookingStatus: 'CONFIRMED',
        bookedAt: 'Just Now',
        platform: 'Platform 04',
        qrToken: `ME-PASS-${generatedPnr}-GATE01`,
      };

      // Add to bookings array in AppContext
      completeBooking(paymentMethod === 'UPI' ? 'UPI • Google Pay' : paymentMethod === 'WALLET' ? 'IRCTC Rail e-Wallet' : 'Credit Card');
      setConfirmedBookingResult(newBooking);
      setIsProcessingPayment(false);
      setBookingStep(4);
      showToast(`Booking Confirmed! PNR ${generatedPnr} generated.`);
    }, 1000);
  };

  const handleCopyPnr = (pnr: string) => {
    navigator.clipboard?.writeText(pnr);
    setCopiedPnr(pnr);
    showToast(`PNR ${pnr} copied to clipboard!`);
    setTimeout(() => setCopiedPnr(null), 2500);
  };

  const handlePnrSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrSearchInput.trim()) return;
    const found = findBookingByPnr(pnrSearchInput.trim());
    if (found) {
      setTrackedBooking(found);
      showToast(`PNR ${pnrSearchInput} found in database!`);
    } else {
      setTrackedBooking(null);
      showToast(`PNR ${pnrSearchInput} not found in database`);
    }
  };

  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    const { refundAmount, charge } = cancelBooking(cancelModalBooking.id);
    setCancelSuccessData({ refund: refundAmount, charge });
  };

  const ledgerList = useMemo(() => {
    if (ledgerTab === 'all') return bookings;
    if (ledgerTab === 'upcoming') return bookings.filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'RAC');
    if (ledgerTab === 'completed') return bookings.filter(b => b.bookingStatus === 'COMPLETED');
    return bookings.filter(b => b.bookingStatus === 'CANCELLED');
  }, [bookings, ledgerTab]);

  return (
    <div className="w-full min-h-[calc(100vh-14rem)] py-4 space-y-6">
      {/* Top Header & Mode Navigation */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#7bd0ff] font-bold block mb-1">
            IRCTC Next Generation eTicketing Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            My Bookings &amp; Train Reservation Desk
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Select trains, configure complete passenger data, choose AC/Non-AC sections, and manage active tickets
          </p>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/50 border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode('book-new')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'book-new'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Book New Ticket</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('ledger')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'ledger'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>My Booked Tickets ({bookings.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: BOOK NEW TICKET WORKSPACE (SELECT TRAIN & ENTER IRCTC DATA)        */}
      {/* ========================================================================= */}
      {activeMode === 'book-new' && (
        <div className="space-y-6">
          {/* Step Progression Bar */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono font-bold">
            <button
              onClick={() => setBookingStep(1)}
              className={`p-2.5 rounded-xl border transition-all ${
                bookingStep === 1
                  ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg'
                  : 'glass-panel-subtle text-slate-400 border-white/5'
              }`}
            >
              1. Select Train &amp; Route
            </button>
            <button
              onClick={() => setBookingStep(2)}
              className={`p-2.5 rounded-xl border transition-all ${
                bookingStep === 2
                  ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg'
                  : 'glass-panel-subtle text-slate-400 border-white/5'
              }`}
            >
              2. IRCTC Passenger Details
            </button>
            <button
              onClick={() => setBookingStep(3)}
              className={`p-2.5 rounded-xl border transition-all ${
                bookingStep === 3
                  ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg'
                  : 'glass-panel-subtle text-slate-400 border-white/5'
              }`}
            >
              3. Review &amp; Payment
            </button>
            <button
              disabled={!confirmedBookingResult}
              onClick={() => setBookingStep(4)}
              className={`p-2.5 rounded-xl border transition-all ${
                bookingStep === 4
                  ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-lg'
                  : 'glass-panel-subtle text-slate-400 border-white/5'
              }`}
            >
              4. Confirmed Ticket ERS
            </button>
          </div>

          {/* STEP 1: SELECT TRAIN / TRAVEL */}
          {bookingStep === 1 && (
            <section className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/15 space-y-6 shadow-2xl">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                  Step 1: Choose Travel Corridor &amp; Select Train
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Filter by AC vs Non-AC section and select from over 25+ direct corridor services
                </p>
              </div>

              {/* Station & Section Filter Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-end">
                {/* From Place */}
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#7bd0ff] mb-1">
                    From Place
                  </label>
                  <select
                    value={fromCode}
                    onChange={e => {
                      setFromCode(e.target.value);
                      setBoardingStation(e.target.value);
                    }}
                    className="glass-input p-2.5 rounded-xl text-xs font-bold text-white w-full outline-none"
                  >
                    {stations.map(stn => (
                      <option key={stn.code} value={stn.code}>
                        {stn.name} ({stn.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* To Place */}
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 mb-1">
                    To Place
                  </label>
                  <select
                    value={toCode}
                    onChange={e => setToCode(e.target.value)}
                    className="glass-input p-2.5 rounded-xl text-xs font-bold text-white w-full outline-none"
                  >
                    {stations.map(stn => (
                      <option key={stn.code} value={stn.code}>
                        {stn.name} ({stn.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* When (Date) */}
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300 mb-1">
                    When (Travel Date)
                  </label>
                  <div className="glass-input p-2 rounded-xl flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                    <input
                      type="text"
                      value={travelDate}
                      onChange={e => setTravelDate(e.target.value)}
                      className="bg-transparent text-xs font-bold text-white w-full outline-none"
                      placeholder="29 Sep 2026"
                    />
                  </div>
                </div>

                {/* Section Filter (AC vs Non-AC) */}
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#ffb95f] mb-1">
                    Section Filter
                  </label>
                  <select
                    value={sectionFilter}
                    onChange={e => setSectionFilter(e.target.value as any)}
                    className="glass-input p-2.5 rounded-xl text-xs font-bold text-white w-full outline-none"
                  >
                    <option value="ALL">All Sections (AC &amp; Non-AC)</option>
                    <option value="AC">AC Section Only (1A, 2A, 3A, CC, EC)</option>
                    <option value="NON_AC">Non-AC Section Only (SL Sleeper, 2S)</option>
                  </select>
                </div>
              </div>

              {/* Trains List to Select */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Available Trains ({matchingTrains.length})</span>
                  <span>Click "Select Train" to proceed to IRCTC passenger data entry</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                  {matchingTrains.map(trn => {
                    const isSelected = selectedTrain?.id === trn.id;
                    return (
                      <div
                        key={trn.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                          isSelected
                            ? 'glass-panel border-blue-400 shadow-lg ring-1 ring-blue-500/40'
                            : 'glass-panel-subtle border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#7bd0ff]">#{trn.number}</span>
                              <span className="font-bold text-sm text-white">{trn.name}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {trn.sourceStation} → {trn.destStation}
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-[#7bd0ff] border border-blue-400/30">
                            {trn.type}
                          </span>
                        </div>

                        {/* Timing */}
                        <div className="grid grid-cols-3 gap-2 text-xs font-mono py-1 border-y border-white/5">
                          <div>
                            <div className="text-white font-bold">{trn.departureTime}</div>
                            <div className="text-slate-400 text-[10px]">{trn.sourceCode}</div>
                          </div>
                          <div className="text-center text-slate-400 text-[10px]">{trn.duration}</div>
                          <div className="text-right">
                            <div className="text-white font-bold">{trn.arrivalTime}</div>
                            <div className="text-slate-400 text-[10px]">{trn.destCode}</div>
                          </div>
                        </div>

                        {/* Classes Pills & Action */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono">
                            {trn.classes.map(c => (
                              <button
                                key={c.classType}
                                type="button"
                                onClick={() => {
                                  setSelectedTrain(trn);
                                  setSelectedClass(c.classType);
                                }}
                                className={`px-2 py-1 rounded transition-colors ${
                                  isSelected && selectedClass === c.classType
                                    ? 'bg-blue-600 text-white font-bold'
                                    : 'bg-black/40 text-slate-300 hover:text-white border border-white/10'
                                }`}
                              >
                                {c.classType} ₹{c.fare}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTrain(trn);
                              setBookingStep(2);
                              showToast(`Selected ${trn.name} (${selectedClass}). Proceeding to passenger details...`);
                            }}
                            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shrink-0 transition-transform active:scale-95 flex items-center gap-1.5"
                          >
                            <span>Select Train</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* STEP 2: COMPLETE IRCTC PASSENGER & JOURNEY DATA FORM */}
          {bookingStep === 2 && selectedTrain && (
            <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/15 space-y-6 shadow-2xl">
              {/* Selected Train Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/60 border border-blue-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <TrainIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {selectedTrain.name} (#{selectedTrain.number})
                    </div>
                    <div className="text-xs text-slate-300">
                      {fromCode} → {toCode} • Date: {travelDate} • Dep: {selectedTrain.departureTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono uppercase">Selected Class</span>
                    <div className="text-sm font-bold text-[#ffb95f] font-mono">
                      {selectedClass} ({['1A', '2A', '3A', '3E', 'EC', 'CC'].includes(selectedClass) ? 'AC Section' : 'Non-AC Section'})
                    </div>
                  </div>
                  <button
                    onClick={() => setBookingStep(1)}
                    className="px-2.5 py-1 text-xs text-slate-300 hover:text-white underline"
                  >
                    Change Train
                  </button>
                </div>
              </div>

              {/* Passenger Info Form */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    Passenger Information ({passengers.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddPassenger}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 border border-blue-400/30 text-[#7bd0ff] hover:text-white text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Co-Passenger</span>
                  </button>
                </div>

                {passengers.map((pax, pIdx) => (
                  <div
                    key={pax.id}
                    className="p-4 sm:p-5 rounded-xl glass-panel-subtle border border-white/10 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs font-bold text-[#7bd0ff] uppercase tracking-wider font-mono">
                        Passenger #{pIdx + 1} {pIdx === 0 ? '(Primary Traveler)' : ''}
                      </span>
                      {pIdx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePassenger(pax.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3">
                      {/* Name */}
                      <div className="md:col-span-4">
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">
                          Full Name (as on Govt ID) *
                        </label>
                        <input
                          type="text"
                          required
                          value={pax.fullName}
                          onChange={e => handleUpdatePassenger(pax.id, 'fullName', e.target.value)}
                          placeholder="e.g. Snehith Varma"
                          className="glass-input p-2.5 rounded-xl text-xs font-bold text-white w-full outline-none"
                        />
                      </div>

                      {/* Age */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">
                          Age *
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={120}
                          value={pax.age}
                          onChange={e => handleUpdatePassenger(pax.id, 'age', parseInt(e.target.value) || 20)}
                          className="glass-input p-2.5 rounded-xl text-xs font-bold text-white w-full outline-none font-mono"
                        />
                      </div>

                      {/* Gender */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">
                          Gender *
                        </label>
                        <select
                          value={pax.gender}
                          onChange={e => handleUpdatePassenger(pax.id, 'gender', e.target.value as any)}
                          className="glass-input p-2.5 rounded-xl text-xs font-bold text-white w-full outline-none"
                        >
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                          <option value="TG">Transgender</option>
                        </select>
                      </div>

                      {/* Berth Preference */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">
                          Berth Preference
                        </label>
                        <select
                          value={pax.berthPreference}
                          onChange={e => handleUpdatePassenger(pax.id, 'berthPreference', e.target.value as any)}
                          className="glass-input p-2.5 rounded-xl text-xs font-bold text-white w-full outline-none"
                        >
                          <option value="NONE">No Choice</option>
                          <option value="LB">Lower Berth (LB)</option>
                          <option value="MB">Middle Berth (MB)</option>
                          <option value="UB">Upper Berth (UB)</option>
                          <option value="SL">Side Lower (SL)</option>
                          <option value="SU">Side Upper (SU)</option>
                        </select>
                      </div>

                      {/* Food Choice */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">
                          Food Choice
                        </label>
                        <select
                          value={pax.foodOption}
                          onChange={e => handleUpdatePassenger(pax.id, 'foodOption', e.target.value as any)}
                          className="glass-input p-2.5 rounded-xl text-xs font-bold text-white w-full outline-none"
                        >
                          <option value="VEG">Veg Meals</option>
                          <option value="NONVEG">Non-Veg Meals</option>
                          <option value="JAIN">Jain Meal</option>
                          <option value="NONE">No Food</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Information & Section Choice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-white/10">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Contact Mobile Number *
                  </label>
                  <div className="glass-input p-2 rounded-xl flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                      className="bg-transparent text-xs font-mono font-bold text-white w-full outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Contact Email Address *
                  </label>
                  <div className="glass-input p-2 rounded-xl flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      className="bg-transparent text-xs font-mono font-bold text-white w-full outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Section Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={e => setSelectedClass(e.target.value as any)}
                    className="glass-input p-2.5 rounded-xl text-xs font-bold text-white w-full outline-none"
                  >
                    <optgroup label="AC Section">
                      <option value="1A">AC First Class (1A)</option>
                      <option value="2A">AC 2-Tier (2A)</option>
                      <option value="3A">AC 3-Tier (3A)</option>
                      <option value="3E">AC 3-Economy (3E)</option>
                      <option value="EC">Executive Chair Car (EC)</option>
                      <option value="CC">AC Chair Car (CC)</option>
                    </optgroup>
                    <optgroup label="Non-AC Section">
                      <option value="SL">Sleeper (SL)</option>
                      <option value="2S">Second Sitting (2S)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Boarding Station
                  </label>
                  <select
                    value={boardingStation}
                    onChange={e => setBoardingStation(e.target.value)}
                    className="glass-input p-2.5 rounded-xl text-xs font-bold text-white w-full outline-none"
                  >
                    <option value={selectedTrain.sourceCode}>
                      {selectedTrain.sourceStation} ({selectedTrain.sourceCode})
                    </option>
                    {selectedTrain.route?.map(r => (
                      <option key={r.stationCode} value={r.stationCode}>
                        {r.stationName} ({r.stationCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination Address (As required by IRCTC for Covid & PRS Waybill) */}
              <div className="p-4 sm:p-5 rounded-xl glass-panel-subtle border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Destination Address (As Required in IRCTC Booking)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 text-xs font-mono">
                  <div className="md:col-span-5">
                    <label className="block text-[10px] text-slate-400 mb-1">
                      Street / Flat / Colony Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={destAddressLine}
                      onChange={e => setDestAddressLine(e.target.value)}
                      placeholder="Flat 402, Royal Palms, Beach Road"
                      className="glass-input p-2.5 rounded-xl text-xs font-bold text-white w-full outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-slate-400 mb-1">
                      Destination PIN *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={destPinCode}
                      onChange={e => setDestPinCode(e.target.value)}
                      placeholder="530002"
                      className="glass-input p-2.5 rounded-xl text-xs font-bold text-white w-full outline-none font-mono"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-slate-400 mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      required
                      value={destCity}
                      onChange={e => setDestCity(e.target.value)}
                      placeholder="Visakhapatnam"
                      className="glass-input p-2.5 rounded-xl text-xs font-bold text-white w-full outline-none"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] text-slate-400 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={destState}
                      onChange={e => setDestState(e.target.value)}
                      placeholder="Andhra Pradesh"
                      className="glass-input p-2.5 rounded-xl text-xs font-bold text-white w-full outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Infant Without Berth */}
              <div className="p-4 rounded-xl glass-panel-subtle border border-white/10 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                    <input
                      type="checkbox"
                      checked={hasInfant}
                      onChange={e => setHasInfant(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 bg-black/60 border-white/20"
                    />
                    <span>Traveling with Infant (Below 5 years - No berth allotted, Free ticket)</span>
                  </label>
                </div>
                {hasInfant && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Infant Full Name</label>
                      <input
                        type="text"
                        value={infantName}
                        onChange={e => setInfantName(e.target.value)}
                        placeholder="e.g. Baby Aarav"
                        className="glass-input p-2 rounded-lg text-xs w-full text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Age (1-4 yrs)</label>
                      <input
                        type="number"
                        min={1}
                        max={4}
                        value={infantAge}
                        onChange={e => setInfantAge(parseInt(e.target.value) || 2)}
                        className="glass-input p-2 rounded-lg text-xs w-full text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Gender</label>
                      <select
                        value={infantGender}
                        onChange={e => setInfantGender(e.target.value as any)}
                        className="glass-input p-2 rounded-lg text-xs w-full text-white font-bold"
                      >
                        <option value="M">Male Infant</option>
                        <option value="F">Female Infant</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* IRCTC Preferences Checkboxes */}
              <div className="p-4 rounded-xl glass-panel-subtle border border-white/10 space-y-2 text-xs">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoUpgrade}
                    onChange={e => setAutoUpgrade(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-black/60 border-white/20"
                  />
                  <span className="text-slate-200">
                    Consider for Automatic Free Upgradation (Free upgrade to higher AC class if vacant)
                  </span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmOnly}
                    onChange={e => setConfirmOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-black/60 border-white/20"
                  />
                  <span className="text-slate-200">
                    Book only if confirm berths are allotted
                  </span>
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={travelInsurance}
                      onChange={e => setTravelInsurance(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 bg-black/60 border-white/20"
                    />
                    <span className="text-slate-200">
                      Travel Insurance (₹0.45 per passenger - Covers up to ₹10 Lakhs)
                    </span>
                  </label>
                  {travelInsurance && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono">
                      <span className="text-slate-400">Nominee:</span>
                      <input
                        type="text"
                        value={nomineeName}
                        onChange={e => setNomineeName(e.target.value)}
                        className="glass-input px-2 py-1 rounded text-white text-xs w-36 font-bold"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Proceed to Review Button */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="font-mono">
                  <span className="text-[10px] text-slate-400 block">Total Estimated Fare ({passengers.length} Pax)</span>
                  <span className="text-xl font-bold text-white">₹{fareBreakdown.total}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setBookingStep(3)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-transform active:scale-95"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {/* STEP 3: REVIEW & PAYMENT GATEWAY */}
          {bookingStep === 3 && selectedTrain && (
            <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/15 space-y-6 shadow-2xl max-w-3xl mx-auto">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  Step 3: Review Itinerary &amp; Pay via IRCTC Gateway
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Secure 256-Bit SSL tunnel • Instant digital ticket issuance upon authorization
                </p>
              </div>

              {/* Journey Summary */}
              <div className="p-4 rounded-xl glass-panel-subtle border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-sm font-bold text-white border-b border-white/10 pb-2">
                  <span>{selectedTrain.name} (#{selectedTrain.number})</span>
                  <span className="text-[#ffb95f]">{selectedClass} Class</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Route: {fromCode} → {toCode}</div>
                  <div className="text-right">Travel Date: {travelDate}</div>
                  <div>Departure: {selectedTrain.departureTime}</div>
                  <div className="text-right">Boarding: {boardingStation}</div>
                </div>
                <div className="border-t border-white/5 pt-2">
                  <span className="text-slate-400 text-[10px] block">Passengers:</span>
                  <div className="text-white font-bold">
                    {passengers.map(p => `${p.fullName} (${p.age}, ${p.gender})`).join(' • ')}
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'UPI', label: 'UPI / GPay / PhonePe', badge: 'Zero Surcharge' },
                    { id: 'WALLET', label: 'IRCTC e-Wallet', badge: '₹4,850 Balance' },
                    { id: 'CARDS', label: 'Debit / Credit Card', badge: 'Visa/RuPay' },
                    { id: 'NETBANKING', label: 'NetBanking', badge: 'SBI / HDFC' },
                  ].map(m => (
                    <div
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === m.id
                          ? 'bg-blue-600/30 border-blue-400 text-white ring-1 ring-blue-500/40'
                          : 'glass-panel-subtle border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs">{m.label}</div>
                      <div className="text-[10px] text-emerald-400 mt-1 font-mono">{m.badge}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fare Breakdown Table */}
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs font-mono space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Base Ticket Fare ({passengers.length} Pax):</span>
                  <span>₹{fareBreakdown.base}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Reservation &amp; Superfast Levy:</span>
                  <span>₹{fareBreakdown.surcharge}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>GST (5%):</span>
                  <span>₹{fareBreakdown.gst}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Travel Insurance:</span>
                  <span>₹{fareBreakdown.insurance}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>IRCTC Gateway Clerkage:</span>
                  <span>₹15.00</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white border-t border-white/10 pt-2">
                  <span>Total Amount Payable:</span>
                  <span className="text-emerald-400">₹{fareBreakdown.total}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setBookingStep(2)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  ← Edit Passenger Data
                </button>

                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleFinalizeBooking}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isProcessingPayment ? 'Authorizing Payment...' : `Pay ₹${fareBreakdown.total} & Book Ticket`}
                  </span>
                </button>
              </div>
            </section>
          )}

          {/* STEP 4: CONFIRMED TICKET ERS SLIP */}
          {bookingStep === 4 && confirmedBookingResult && (
            <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-emerald-400/40 space-y-6 shadow-2xl max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 block">
                      RESERVATION STATUS: CONFIRMED (CNF)
                    </span>
                    <h2 className="text-xl font-black text-white">
                      Ticket Successfully Booked!
                    </h2>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs text-slate-400">10-Digit PNR</div>
                  <div className="text-base font-extrabold text-[#ffb95f]">
                    {confirmedBookingResult.pnr}
                  </div>
                </div>
              </div>

              {/* Electronic Reservation Slip Body */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/15 space-y-4 font-mono text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="font-bold text-sm text-white">
                    {confirmedBookingResult.trainName} (#{confirmedBookingResult.trainNumber})
                  </span>
                  <span className="text-emerald-400 font-bold">{confirmedBookingResult.classType} Class</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-[10px] text-slate-400">Origin</div>
                    <div className="font-bold text-white">{confirmedBookingResult.fromStation}</div>
                    <div className="text-[#7bd0ff]">{confirmedBookingResult.departureTime}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-slate-400">Date</div>
                    <div className="font-bold text-white">{confirmedBookingResult.journeyDate}</div>
                    <div className="text-amber-400">{confirmedBookingResult.platform}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Destination</div>
                    <div className="font-bold text-white">{confirmedBookingResult.toStation}</div>
                    <div className="text-emerald-400">{confirmedBookingResult.arrivalTime}</div>
                  </div>
                </div>

                {/* Allotted Berths Table */}
                <div className="pt-2 border-t border-white/10">
                  <span className="text-[10px] text-slate-400 block mb-1">Confirmed Passenger Allocation:</span>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-400 text-[10px] border-b border-white/5">
                        <th className="py-1">Passenger</th>
                        <th className="py-1">Coach / Berth</th>
                        <th className="py-1">Berth Type</th>
                        <th className="py-1">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {confirmedBookingResult.passengers.map((p, i) => (
                        <tr key={i} className="text-white">
                          <td className="py-1 font-bold">{p.fullName} ({p.age}, {p.gender})</td>
                          <td className="py-1 text-[#ffb95f] font-bold">{p.assignedCoach} · {p.assignedBerth}</td>
                          <td className="py-1">{p.assignedBerthType}</td>
                          <td className="py-1 text-emerald-400 font-bold">CONFIRMED</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* QR Code and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white p-1 rounded-xl">
                      <QrCode className="w-full h-full text-slate-950" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Digital Boarding Token</div>
                      <div className="text-[10px] text-slate-400">Scan at station platform gate</div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-[10px] text-slate-400">Total Paid</div>
                    <div className="text-base font-bold text-emerald-400">₹{confirmedBookingResult.totalFare}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('ledger');
                    setBookingStep(1);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white"
                >
                  View All My Booked Tickets →
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      window.print();
                      showToast('Printing official reservation voucher...');
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print ERS Ticket</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingStep(1);
                      setConfirmedBookingResult(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase"
                  >
                    Book Another Journey
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: MY BOOKED TICKETS & PNR LEDGER                                    */}
      {/* ========================================================================= */}
      {activeMode === 'ledger' && (
        <div className="space-y-6">
          {/* PNR Status Quick Tracker Bar */}
          <section className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#ffb95f] border border-amber-400/30 flex items-center justify-center shrink-0">
                <Radar className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>Track PNR Reservation Status</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">Live CRIS</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Verify passenger chart preparation, coach allotment, and confirmation probability
                </p>
              </div>
            </div>

            <form onSubmit={handlePnrSearch} className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Enter 10-Digit PNR..."
                value={pnrSearchInput}
                onChange={e => setPnrSearchInput(e.target.value.replace(/\D/g, ''))}
                className="glass-input px-3.5 py-2 rounded-xl text-xs font-mono text-white w-full md:w-56 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0"
              >
                Track PNR
              </button>
            </form>
          </section>

          {/* Searched PNR card */}
          {trackedBooking && (
            <div className="p-4 rounded-xl glass-panel border border-emerald-400/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  PNR #{trackedBooking.pnr} • {trackedBooking.trainName} ({trackedBooking.trainNumber})
                </span>
                <div className="text-xs text-slate-300">
                  {trackedBooking.fromStation} → {trackedBooking.toStation} • Date: {trackedBooking.journeyDate} • Coach {trackedBooking.passengers[0]?.assignedCoach}, Berth {trackedBooking.passengers[0]?.assignedBerth}
                </div>
              </div>
              <button
                onClick={() => setViewTicketModal(trackedBooking)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
              >
                View E-Ticket Slip
              </button>
            </div>
          )}

          {/* Ledger Filter Tabs */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              {[
                { id: 'upcoming', label: 'Upcoming Journeys' },
                { id: 'completed', label: 'Completed' },
                { id: 'cancelled', label: 'Cancelled' },
                { id: 'all', label: 'All Records' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setLedgerTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    ledgerTab === t.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveMode('book-new')}
              className="text-xs text-[#7bd0ff] hover:underline font-bold"
            >
              + Book Another Ticket
            </button>
          </div>

          {/* Booked Tickets List */}
          <div className="space-y-4">
            {ledgerList.map(bk => {
              const isCnf = bk.bookingStatus === 'CONFIRMED';
              const isCan = bk.bookingStatus === 'CANCELLED';

              return (
                <div
                  key={bk.id}
                  className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/15 space-y-4 relative overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${
                      isCnf ? 'bg-emerald-500' : isCan ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                  />

                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-[#7bd0ff] border border-blue-400/30 flex items-center justify-center font-bold">
                        <Ticket className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-base text-white">{bk.trainName}</span>
                          <span className="font-mono text-xs font-bold text-[#7bd0ff]">#{bk.trainNumber}</span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300">
                            {bk.classType} Class
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 font-mono">
                          PNR: <strong className="text-white">{bk.pnr}</strong> • Booked: {bk.bookedAt}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono self-start sm:self-auto ${
                        isCnf
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isCan
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {bk.bookingStatus}
                    </span>
                  </div>

                  {/* Journey Info */}
                  <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">Departure</div>
                      <div className="font-bold text-white text-sm">{bk.departureTime}</div>
                      <div className="text-[#7bd0ff]">{bk.fromStation}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-slate-400">Date</div>
                      <div className="font-bold text-white">{bk.journeyDate}</div>
                      <div className="text-amber-400">{bk.platform}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Arrival</div>
                      <div className="font-bold text-white text-sm">{bk.arrivalTime}</div>
                      <div className="text-emerald-400">{bk.toStation}</div>
                    </div>
                  </div>

                  {/* Passenger berths */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 font-mono block mb-1">
                      Passengers ({bk.passengers.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      {bk.passengers.map(p => (
                        <div key={p.id} className="flex justify-between items-center">
                          <span className="font-bold text-white">{p.fullName}</span>
                          <span className="text-[#ffb95f] font-mono font-bold">
                            {p.assignedCoach} · {p.assignedBerth} ({p.assignedBerthType})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-xs font-mono text-slate-300">
                      Total Fare: <strong className="text-white text-sm">₹{bk.totalFare}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewTicketModal(bk)}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Print E-Ticket (ERS)</span>
                      </button>

                      {isCnf && (
                        <button
                          onClick={() => {
                            setCancelModalBooking(bk);
                            setCancelSuccessData(null);
                          }}
                          className="px-3.5 py-1.5 rounded-lg border border-rose-500/40 hover:bg-rose-500/20 text-rose-400 text-xs font-bold"
                        >
                          Cancel Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== ERS TICKET MODAL ==================== */}
      {viewTicketModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass-panel p-6 rounded-2xl border border-white/20 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono font-bold text-xs uppercase text-[#7bd0ff]">
                IRCTC Electronic Reservation Slip (ERS)
              </span>
              <button onClick={() => setViewTicketModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-white">
                <span>{viewTicketModal.trainName} (#{viewTicketModal.trainNumber})</span>
                <span className="text-[#ffb95f]">PNR: {viewTicketModal.pnr}</span>
              </div>
              <div className="text-slate-300">
                {viewTicketModal.fromStation} → {viewTicketModal.toStation} • Date: {viewTicketModal.journeyDate} • Class: {viewTicketModal.classType}
              </div>
              <div className="border-t border-white/10 pt-2">
                <span className="text-[10px] text-slate-400 block mb-1">Passengers:</span>
                {viewTicketModal.passengers.map(p => (
                  <div key={p.id} className="flex justify-between py-0.5">
                    <span>{p.fullName} ({p.age}, {p.gender})</span>
                    <span className="text-emerald-400 font-bold">{p.assignedCoach} / {p.assignedBerth} (CNF)</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between items-center font-bold">
                <span>Total Fare Paid:</span>
                <span className="text-emerald-400 text-sm">₹{viewTicketModal.totalFare}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  window.print();
                  showToast('Opening print dialog...');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CANCELLATION MODAL ==================== */}
      {cancelModalBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-bold text-sm text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Cancel Reservation
              </span>
              <button onClick={() => setCancelModalBooking(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!cancelSuccessData ? (
              <>
                <p className="text-xs text-slate-300">
                  Cancel PNR <strong className="font-mono text-white">{cancelModalBooking.pnr}</strong> for {cancelModalBooking.trainName}?
                </p>
                <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Ticket Fare:</span>
                    <span>₹{cancelModalBooking.totalFare}</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>Cancellation Clerkage:</span>
                    <span>- ₹{cancelModalBooking.classType.startsWith('1') ? 240 : 180}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-400 pt-1 border-t border-white/10">
                    <span>Refund to Source:</span>
                    <span>₹{Math.max(0, cancelModalBooking.totalFare - (cancelModalBooking.classType.startsWith('1') ? 240 : 180)).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setCancelModalBooking(null)}
                    className="px-4 py-2 text-xs text-slate-400"
                  >
                    Keep Ticket
                  </button>
                  <button
                    onClick={handleConfirmCancel}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-3 space-y-2 font-mono">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white">Ticket Cancelled</h4>
                <p className="text-xs text-slate-300">
                  Refund of ₹{cancelSuccessData.refund} initiated back to your payment source.
                </p>
                <button
                  onClick={() => setCancelModalBooking(null)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold mt-2"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
