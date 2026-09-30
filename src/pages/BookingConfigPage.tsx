import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Passenger, Infant } from '../types';
import {
  Train as TrainIcon,
  ShieldCheck,
  User,
  Users,
  Utensils,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Lock,
  RotateCcw,
  Sparkles,
  Baby,
  Mail,
  Smartphone,
  PhoneCall,
  Sliders,
  Receipt,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Trash2,
  PlusCircle,
  Clock,
  MapPin,
  Compass,
} from 'lucide-react';

export const BookingConfigPage: React.FC = () => {
  const {
    bookingDraft,
    setBookingDraft,
    setActiveView,
    searchState,
    currentUser,
    showToast,
  } = useApp();

  // Ensure passenger 1 reflects current signed-in user name
  React.useEffect(() => {
    if (currentUser?.name && bookingDraft.passengers.length > 0) {
      if (bookingDraft.passengers[0].fullName !== currentUser.name) {
        setBookingDraft(prev => ({
          ...prev,
          passengers: prev.passengers.map((p, idx) =>
            idx === 0 ? { ...p, fullName: currentUser.name } : p
          ),
          contactEmail: currentUser.email || prev.contactEmail,
        }));
      }
    }
  }, [currentUser?.name]);

  const train = bookingDraft.train;
  const [captchaInput, setCaptchaInput] = useState('7K9P2');
  const [captchaValid, setCaptchaValid] = useState(true);
  const [captchaCode, setCaptchaCode] = useState('7 K 9 P 2');

  const regenerateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length)) + ' ';
    }
    const clean = code.trim();
    setCaptchaCode(clean);
    setCaptchaInput(clean.replace(/\s+/g, ''));
    setCaptchaValid(true);
    showToast('Security verification refreshed');
  };

  const selectedClass = bookingDraft.selectedClass;
  const classObj = train?.classes.find(c => c.classType === selectedClass) || train?.classes[0];
  const unitFare = classObj?.fare || 890;

  // Passengers handlers
  const handleUpdatePassenger = (index: number, field: keyof Passenger, value: any) => {
    setBookingDraft(prev => {
      const nextPax = [...prev.passengers];
      nextPax[index] = { ...nextPax[index], [field]: value };
      return { ...prev, passengers: nextPax };
    });
  };

  const handleAddPassenger = () => {
    if (bookingDraft.passengers.length >= 6) {
      showToast('Maximum 6 passengers allowed per e-ticket');
      return;
    }
    const newPax: Passenger = {
      id: 'pax-' + Date.now(),
      fullName: 'Ananya Sharma',
      age: 20,
      gender: 'F',
      berthPreference: 'SL',
      foodOption: 'VEG',
      nationality: 'India (🇮🇳)',
      status: 'CONFIRMED',
    };
    setBookingDraft(prev => ({
      ...prev,
      passengers: [...prev.passengers, newPax],
    }));
    showToast('Passenger added to booking');
  };

  const handleRemovePassenger = (index: number) => {
    if (bookingDraft.passengers.length <= 1) {
      showToast('At least 1 passenger is required');
      return;
    }
    setBookingDraft(prev => ({
      ...prev,
      passengers: prev.passengers.filter((_, i) => i !== index),
    }));
  };

  const handleAddInfant = () => {
    if (bookingDraft.infants.length >= 2) {
      showToast('Maximum 2 infants allowed per ticket');
      return;
    }
    const newInf: Infant = {
      id: 'inf-' + Date.now(),
      name: 'Baby Varma',
      age: 1,
      gender: 'F',
      accompaniedBy: bookingDraft.passengers[0]?.fullName || 'Snehith Varma',
    };
    setBookingDraft(prev => ({
      ...prev,
      infants: [...prev.infants, newInf],
    }));
    showToast('Infant added (Complimentary zero charge)');
  };

  const handleRemoveInfant = (index: number) => {
    setBookingDraft(prev => ({
      ...prev,
      infants: prev.infants.filter((_, i) => i !== index),
    }));
  };

  // Calculations matching screenshot 8
  const paxCount = bookingDraft.passengers.length;
  const baseTicketFare = unitFare * paxCount;
  const resSurcharge = 40 * paxCount;
  const superfastLevy = 45 * paxCount;
  const gstAmount = Math.round(baseTicketFare * 0.05 * 10) / 10;
  const mealsCount = bookingDraft.passengers.filter(p => p.foodOption !== 'NONE').length;
  const mealCost = mealsCount * 70;
  const insuranceAmount = bookingDraft.options.travelInsurance ? 0.45 * paxCount : 0;
  const irctcConvenience = 15.0;

  const totalPayable =
    baseTicketFare +
    resSurcharge +
    superfastLevy +
    gstAmount +
    mealCost +
    insuranceAmount +
    irctcConvenience;

  const handleProceedToPayment = () => {
    if (!captchaValid || !captchaInput) {
      showToast('Please complete the anti-bot verification');
      return;
    }
    setActiveView('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-[calc(100vh-16rem)] py-6 space-y-6">
      {/* Breadcrumb Navigation (Image 8) */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#8d90a0]">
        <button
          onClick={() => setActiveView('search-trains')}
          className="hover:text-blue-700 dark:hover:text-[#7bd0ff] transition-colors flex items-center gap-1 font-semibold"
        >
          <span>Search Trains</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
        <span className="text-slate-700 dark:text-[#d7e3fc] font-bold flex items-center gap-1">
          <TrainIcon className="w-3.5 h-3.5 text-blue-600 dark:text-[#7bd0ff]" />
          #{train?.number || '12727'} {train?.name || 'Godavari Superfast Express'}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
        <span className="text-blue-700 dark:text-[#7bd0ff] font-extrabold">Passenger & Journey Configuration</span>
      </nav>

      {/* Journey Overview Header Corridor Card (Screenshot 8) */}
      <section className="w-full bg-white dark:bg-[#0f1d33] rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-amber-500"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Train Identifier & Route Visualizer */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-[#7bd0ff] border border-blue-200 dark:border-blue-700 text-xs font-bold tracking-wider uppercase">
                Superfast Special #{train?.number || '12727'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#14233c] text-slate-600 dark:text-[#c3c6d7] border border-slate-200 dark:border-slate-700 text-xs font-medium">
                Daily Service
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                AVL {classObj?.availableSeats || 64} Berths
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {train?.name || 'Godavari Superfast Express'}
            </h1>

            {/* Timeline Telemetry */}
            <div className="flex items-center gap-6 mt-1 text-slate-900 dark:text-white">
              <div>
                <div className="text-xl font-black">{train?.departureTime || '06:00 AM'}</div>
                <div className="text-sm text-blue-700 dark:text-[#7bd0ff] font-bold">
                  {train?.sourceCode || 'HYB'} • {train?.sourceStation || 'Hyderabad Deccan'}
                </div>
                <div className="text-xs text-slate-500 dark:text-[#8d90a0]">PF #5 • Origin</div>
              </div>

              {/* Progress Line */}
              <div className="flex flex-col items-center px-2 flex-1 max-w-[200px]">
                <div className="text-xs text-slate-500 dark:text-[#8d90a0] font-medium">
                  {train?.duration || '5h 30m'} • {train?.distanceKm || 349} KM
                </div>
                <div className="relative w-full flex items-center my-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-900"></div>
                  <div className="h-1 flex-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-amber-500 rounded"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-900"></div>
                </div>
                <div className="text-[10px] text-amber-600 dark:text-[#ffb95f] font-bold uppercase tracking-wider">
                  Non-stop Corridor
                </div>
              </div>

              <div>
                <div className="text-xl font-black">{train?.arrivalTime || '11:30 AM'}</div>
                <div className="text-sm text-amber-700 dark:text-[#ffb95f] font-bold">
                  {train?.destCode || 'BZA'} • {train?.destStation || 'Vijayawada Jn'}
                </div>
                <div className="text-xs text-slate-500 dark:text-[#8d90a0]">PF #1 • Terminus</div>
              </div>
            </div>
          </div>

          {/* Class, Quota & Boarding Config Tile */}
          <div className="bg-slate-50 dark:bg-[#14233c] rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex flex-col gap-3 min-w-[300px]">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-[#8d90a0] uppercase tracking-wider">
                Class & Quota
              </span>
              <span className="text-lg text-slate-900 dark:text-white font-black">
                ₹{unitFare}.00 <span className="text-xs text-slate-500 font-normal">/ berth</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex-1 bg-white dark:bg-[#1a2b47] border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-2xs">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Class</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedClass} Tier</span>
              </div>
              <div className="flex-1 bg-white dark:bg-[#1a2b47] border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-2xs">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Quota</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{bookingDraft.quota} (GN)</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-blue-700 dark:text-[#7bd0ff] flex items-center gap-1 font-bold">
                <Compass className="w-3.5 h-3.5" /> Boarding Station Selector
              </label>
              <select
                value={bookingDraft.boardingStationCode}
                onChange={e =>
                  setBookingDraft(p => ({
                    ...p,
                    boardingStationCode: e.target.value,
                    boardingStationName: e.target.options[e.target.selectedIndex].text,
                  }))
                }
                className="w-full bg-white dark:bg-[#1a2b47] border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white text-xs rounded-lg px-3 py-2 outline-none cursor-pointer"
              >
                <option value="HYB">HYB - Hyderabad Deccan (Dep 06:00 AM)</option>
                <option value="SC">SC - Secunderabad Jn (Dep 06:25 AM)</option>
                <option value="KZJ">KZJ - Kazipet Jn (Dep 08:20 AM)</option>
                <option value="WL">WL - Warangal (Dep 08:35 AM)</option>
              </select>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-[#8d90a0] flex items-center justify-between pt-1">
              <span>Date: <strong className="text-slate-800 dark:text-slate-200">Mon, 28 Sep 2026</strong></span>
              <span className="text-blue-700 dark:text-[#7bd0ff] font-semibold">Upto: <strong className="text-slate-800 dark:text-slate-200">{train?.destCode || 'BZA'}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Main Booking Configuration */}
        <div className="lg:col-span-8 space-y-6">
          {/* A. Saved Master Passenger List */}
          <section className="bg-white dark:bg-[#0f1d33] rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-[#7bd0ff] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Saved Master Passenger List</h2>
              </div>
              <span className="text-xs text-blue-700 dark:text-[#7bd0ff] bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 px-2.5 py-0.5 rounded-full font-semibold">
                Quick Selection
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-[#8d90a0] mb-3">
              Fast-track booking by clicking profiles saved in your PRS account:
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Chip 1: Snehith */}
              <button
                type="button"
                className="group flex items-center gap-2 bg-blue-50/80 dark:bg-blue-950/60 border-2 border-blue-500 text-blue-900 dark:text-blue-200 rounded-xl px-3.5 py-2 shadow-2xs"
              >
                <CheckCircle className="w-4 h-4 text-blue-600 dark:text-[#7bd0ff]" />
                <div className="text-left">
                  <span className="text-xs font-bold block text-slate-900 dark:text-white">Snehith Varma</span>
                  <span className="text-[11px] text-slate-600 dark:text-[#8d90a0]">20 • M • LB • India</span>
                </div>
              </button>

              {/* Chip 2: Rahul */}
              <button
                type="button"
                className="group flex items-center gap-2 bg-slate-50 dark:bg-[#14233c] hover:bg-blue-50/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2"
              >
                <CheckCircle className="w-4 h-4 text-blue-600 dark:text-[#7bd0ff]" />
                <div className="text-left">
                  <span className="text-xs font-bold block text-slate-900 dark:text-white">Rahul Kumar</span>
                  <span className="text-[11px] text-slate-600 dark:text-[#8d90a0]">21 • M • MB • India</span>
                </div>
              </button>

              {/* Chip 3: Add Ananya */}
              <button
                type="button"
                onClick={handleAddPassenger}
                className="group flex items-center gap-2 bg-slate-50 dark:bg-[#14233c] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2"
              >
                <PlusCircle className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                <div className="text-left">
                  <span className="text-xs font-semibold block text-slate-800 dark:text-slate-200">Ananya Sharma</span>
                  <span className="text-[11px] text-slate-400">20 • F • SL • India</span>
                </div>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-[#8d90a0] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                Maximum 6 passengers allowed per General Quota e-ticket.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddPassenger}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-[#7bd0ff] hover:bg-blue-100 border border-blue-200 dark:border-blue-700 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> + Add New Passenger
                </button>
                <button
                  type="button"
                  onClick={handleAddInfant}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-800 dark:text-[#ffb95f] hover:bg-amber-100 border border-amber-200 dark:border-amber-700 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Baby className="w-3.5 h-3.5" /> + Add Infant (Under 5)
                </button>
              </div>
            </div>
          </section>

          {/* B. Configured Passengers Cards (Screenshot 8) */}
          <div className="space-y-4">
            {bookingDraft.passengers.map((pax, index) => (
              <article
                key={pax.id}
                className="bg-white dark:bg-[#0f1d33] rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                        Passenger {index + 1} {index === 0 ? '(Primary Adult)' : '(Adult)'}
                      </h3>
                      <span className="text-xs text-blue-700 dark:text-[#7bd0ff] font-semibold">
                        {index === 0 ? 'Lead Passenger • Contact Authority' : 'Accompanying Traveler'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {index === 0 ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                        <ShieldCheck className="w-3.5 h-3.5" /> Aadhaar Verified (DigiLocker)
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRemovePassenger(index)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 mb-4">
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Full Name (as per Govt Photo ID) <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={pax.fullName}
                      onChange={e => handleUpdatePassenger(index, 'fullName', e.target.value)}
                      className="w-full bg-white dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold rounded-lg px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="text-[11px] text-slate-400">Must strictly match PAN/Aadhaar/Passport.</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Age <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={120}
                      value={pax.age}
                      onChange={e => handleUpdatePassenger(index, 'age', parseInt(e.target.value) || 20)}
                      className="w-full bg-white dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold rounded-lg px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="text-[11px] text-slate-400">Years</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Gender <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={pax.gender}
                      onChange={e => handleUpdatePassenger(index, 'gender', e.target.value)}
                      className="w-full bg-white dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold rounded-lg px-3.5 py-2 outline-none cursor-pointer"
                    >
                      <option value="M">Male (M)</option>
                      <option value="F">Female (F)</option>
                      <option value="TG">Transgender (TG)</option>
                    </select>
                  </div>
                </div>

                {/* Preferences Row: Berth, Food, Nationality */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Berth Preference</label>
                    <select
                      value={pax.berthPreference}
                      onChange={e => handleUpdatePassenger(index, 'berthPreference', e.target.value)}
                      className="w-full bg-white dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none"
                    >
                      <option value="LB">Lower Berth (LB)</option>
                      <option value="MB">Middle Berth (MB)</option>
                      <option value="UB">Upper Berth (UB)</option>
                      <option value="SL">Side Lower (SL)</option>
                      <option value="SU">Side Upper (SU)</option>
                      <option value="NONE">No Preference</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Catering / Food Option</label>
                    <select
                      value={pax.foodOption}
                      onChange={e => handleUpdatePassenger(index, 'foodOption', e.target.value)}
                      className="w-full bg-white dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none"
                    >
                      <option value="VEG">Veg Breakfast & Thali (+₹70)</option>
                      <option value="NONVEG">Non-Veg Meals (+₹110)</option>
                      <option value="JAIN">Jain Pure Veg Meal (+₹70)</option>
                      <option value="NONE">No Food / Opt-out</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Nationality</label>
                    <select
                      value={pax.nationality}
                      onChange={e => handleUpdatePassenger(index, 'nationality', e.target.value)}
                      className="w-full bg-white dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none"
                    >
                      <option value="India (🇮🇳)">India (🇮🇳)</option>
                      <option value="United States (🇺🇸)">United States (🇺🇸)</option>
                      <option value="United Kingdom (🇬🇧)">United Kingdom (🇬🇧)</option>
                      <option value="Canada (🇨🇦)">Canada (🇨🇦)</option>
                    </select>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* C. Infant Details Section */}
          {bookingDraft.infants.length > 0 && (
            <section className="bg-white dark:bg-[#0f1d33] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Baby className="w-5 h-5 text-amber-600 dark:text-[#ffb95f]" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Infant Details (Under 5 Years - Traveling Without Berth)
                  </h3>
                </div>
                <span className="text-xs bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-[#ffb95f] px-2.5 py-0.5 rounded-full font-bold">
                  {bookingDraft.infants.length} Infant Added
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8d90a0] mb-3">
                Children under 5 years travel free without a separate berth as per Indian Railways PRS regulations.
              </p>

              {bookingDraft.infants.map((inf, idx) => (
                <div
                  key={inf.id}
                  className="bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 p-3 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-[#ffb95f] flex items-center justify-center font-bold">
                      <Baby className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white block">{inf.name}</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        Age: {inf.age} Years • {inf.gender === 'M' ? 'Male' : 'Female'} • Accompanied by {inf.accompaniedBy}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-700 dark:text-[#7bd0ff] bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 px-3 py-1 rounded-full font-semibold">
                      Zero Berth Charge (Complimentary)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInfant(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* D. Ticket Delivery & Real-Time PNR Dispatch */}
          <section className="bg-white dark:bg-[#0f1d33] rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-[#7bd0ff] flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ticket Delivery & Real-Time PNR Dispatch
                </h3>
              </div>
              <span className="text-xs text-blue-700 dark:text-[#7bd0ff] bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Encrypted Routing
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8d90a0] mb-4">
              Electronic Reservation Slips (ERS), Live Charting notifications, and delay alerts will be dispatched here:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Passenger Mobile (SMS / WhatsApp) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-blue-600 dark:text-[#7bd0ff] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="tel"
                    value={bookingDraft.contactMobile}
                    onChange={e => setBookingDraft(p => ({ ...p, contactMobile: e.target.value }))}
                    className="w-full bg-white dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg pl-9 pr-3 py-2 outline-none font-medium"
                  />
                </div>
                <span className="text-[10px] text-slate-400">Primary PNR notifications</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Email Address (E-Ticket PDF) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-[#7bd0ff] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    value={bookingDraft.contactEmail}
                    onChange={e => setBookingDraft(p => ({ ...p, contactEmail: e.target.value }))}
                    className="w-full bg-white dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg pl-9 pr-3 py-2 outline-none font-medium"
                  />
                </div>
                <span className="text-[10px] text-slate-400">Digital ticket + Tax invoice</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Emergency Contact (Optional)</label>
                <div className="relative">
                  <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="tel"
                    value={bookingDraft.emergencyContact}
                    onChange={e => setBookingDraft(p => ({ ...p, emergencyContact: e.target.value }))}
                    className="w-full bg-white dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg pl-9 pr-3 py-2 outline-none font-medium"
                  />
                </div>
                <span className="text-[10px] text-slate-400">Family / Alternate contact</span>
              </div>
            </div>
          </section>

          {/* E. Advanced Reservation Preferences */}
          <section className="bg-white dark:bg-[#0f1d33] rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Advanced Reservation Preferences
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8d90a0]">
              Algorithmic rules for automated coach matching and berth allocation:
            </p>

            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingDraft.options.autoUpgradation}
                  onChange={e =>
                    setBookingDraft(p => ({
                      ...p,
                      options: { ...p.options, autoUpgradation: e.target.checked },
                    }))
                  }
                  className="mt-1 w-4 h-4 rounded text-blue-600"
                />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Consider for Free Auto-Upgradation
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.2 rounded font-bold">
                      Recommended
                    </span>
                  </span>
                  <p className="text-slate-500 dark:text-[#8d90a0] mt-0.5">
                    Automatically upgrades passengers to AC 2 Tier or AC First at no extra cost if vacancies occur during final charting.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingDraft.options.vikalpOpted}
                  onChange={e =>
                    setBookingDraft(p => ({
                      ...p,
                      options: { ...p.options, vikalpOpted: e.target.checked },
                    }))
                  }
                  className="mt-1 w-4 h-4 rounded text-blue-600"
                />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Opt for VIKALP (Alternate Train Accommodation Scheme)
                  </span>
                  <p className="text-slate-500 dark:text-[#8d90a0] mt-0.5">
                    Grants consent to allot berths in alternate trains running on the corridor if current status slips to waitlist.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingDraft.options.sameCoachOnly}
                  onChange={e =>
                    setBookingDraft(p => ({
                      ...p,
                      options: { ...p.options, sameCoachOnly: e.target.checked },
                    }))
                  }
                  className="mt-1 w-4 h-4 rounded text-blue-600"
                />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Book only if all berths are confirmed in the exact same coach
                  </span>
                  <p className="text-slate-500 dark:text-[#8d90a0] mt-0.5">
                    Prevents party separation across different bogies (guarantees traveling together).
                  </p>
                </div>
              </label>
            </div>
          </section>

          {/* F. Anti-Bot Captcha Verification (Screenshot 8) */}
          <section className="bg-white dark:bg-[#0f1d33] rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs text-slate-500 dark:text-[#8d90a0] font-semibold block">
                  PRS Anti-Bot Verification
                </span>
                <span className="text-xs text-slate-900 dark:text-white font-bold">Enter security code shown:</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl shadow-xs select-none">
                <span className="text-xl font-black tracking-widest text-blue-700 dark:text-[#7bd0ff] font-mono skew-x-3">
                  {captchaCode}
                </span>
                <button
                  type="button"
                  onClick={regenerateCaptcha}
                  className="p-1 text-slate-400 hover:text-blue-600"
                  title="Regenerate CAPTCHA"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={captchaInput}
                onChange={e => {
                  setCaptchaInput(e.target.value.toUpperCase());
                  setCaptchaValid(e.target.value.trim().toUpperCase() === captchaCode.replace(/\s+/g, ''));
                }}
                className="w-full sm:w-36 bg-white dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-base font-black rounded-xl px-3 py-2 uppercase tracking-widest text-center outline-none focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> VERIFIED
              </span>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Sticky Booking Summary & Fare Breakdown (Screenshot 8) */}
        <aside className="lg:col-span-4 sticky top-20 space-y-4">
          {/* Journey Snapshot Mini-Card */}
          <div className="bg-white dark:bg-[#0f1d33] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="uppercase tracking-wider text-blue-700 dark:text-[#7bd0ff] font-black">
                Booking Itinerary
              </span>
              <span className="text-slate-400">Single Journey</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-[#7bd0ff] flex items-center justify-center shrink-0">
                <TrainIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-sm">
                  {train?.name || 'Godavari SF Exp'} (#{train?.number || '12727'})
                </span>
                <span className="text-slate-500 dark:text-[#8d90a0]">
                  Mon, 28 Sep 2026 • {selectedClass} Tier
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 py-2 bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">Boarding</span>
                <span className="font-bold text-blue-700 dark:text-[#7bd0ff]">
                  {train?.sourceCode || 'HYB'} ({train?.departureTime || '06:00 AM'})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Destination</span>
                <span className="font-bold text-amber-700 dark:text-[#ffb95f]">
                  {train?.destCode || 'BZA'} ({train?.arrivalTime || '11:30 AM'})
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-slate-500 dark:text-[#8d90a0]">
              <span>Quota: <strong className="text-slate-900 dark:text-white font-bold">{bookingDraft.quota}</strong></span>
              <span>Passengers: <strong className="text-slate-900 dark:text-white font-bold">{paxCount} Adults{bookingDraft.infants.length > 0 ? `, ${bookingDraft.infants.length} Infant` : ''}</strong></span>
            </div>
          </div>

          {/* Itemized Fare Summary Card (Matches Screenshot 8: ₹2,203.40) */}
          <div className="bg-white dark:bg-[#0f1d33] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">Fare Summary</h3>
              </div>
              <span className="text-xs text-blue-700 dark:text-[#7bd0ff] bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 px-2 py-0.5 rounded font-mono font-bold">
                {paxCount} BERTHS
              </span>
            </div>

            {/* Line Items */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-[#c3c6d7] pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-900 dark:text-white font-semibold">
                <span>Base Ticket Fare ({paxCount} × ₹{unitFare}.00)</span>
                <span className="font-mono font-bold">₹{baseTicketFare.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Reservation Surcharge</span>
                <span className="font-mono">₹{resSurcharge.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Superfast Transit Levy</span>
                <span className="font-mono">₹{superfastLevy.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Goods & Services Tax (5% AC {selectedClass})</span>
                <span className="font-mono">₹{gstAmount.toFixed(2)}</span>
              </div>
              {mealCost > 0 && (
                <div className="flex items-center justify-between">
                  <span>Pre-booked Meal ({mealsCount} Veg Thali)</span>
                  <span className="font-mono">₹{mealCost.toFixed(2)}</span>
                </div>
              )}
              {insuranceAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span>Optional Travel Insurance ({paxCount} × ₹0.45)</span>
                  <span className="font-mono">₹{insuranceAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>IRCTC Gateway Convenience Fee</span>
                <span className="font-mono">₹{irctcConvenience.toFixed(2)}</span>
              </div>
            </div>

            {/* Total Banner */}
            <div className="pt-4 pb-3">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-slate-500 dark:text-[#8d90a0] uppercase tracking-wider font-extrabold">
                  Total Amount Payable
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  ₹{totalPayable.toFixed(2)}
                </span>
              </div>
              <span className="text-[11px] text-blue-700 dark:text-[#7bd0ff] font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> All institutional railway taxes included
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleProceedToPayment}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/25 active:scale-[0.99] group"
              >
                <span>Proceed to Payment & Review</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setActiveView('search-trains')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-[#14233c] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Train Results</span>
              </button>
            </div>

            {/* Trust Signals */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500 dark:text-[#8d90a0]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-[#7bd0ff]" />
                <span>256-bit Encrypted High-Velocity PRS Gateway</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-500" />
                <span>Instant auto-refund to source account on cancellation</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Final chart prepared 4 hours prior to departure</span>
              </div>
            </div>
          </div>

          {/* Coach Composition (3A) Diagram (Screenshot 8) */}
          <div className="bg-white dark:bg-[#0f1d33] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600 dark:text-[#7bd0ff]" /> Coach Composition (3A)
              </span>
              <span className="font-semibold text-blue-700 dark:text-[#7bd0ff]">B1 - B6</span>
            </div>

            <div className="overflow-x-auto py-2">
              <div className="flex items-center gap-1.5 min-w-[280px]">
                <div className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold text-[10px] text-slate-500">
                  ENG
                </div>
                <div className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold text-[10px] text-slate-500">
                  H1
                </div>
                <div className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold text-[10px] text-slate-500">
                  A1
                </div>
                <div className="px-2.5 py-1 bg-blue-600 text-white rounded font-mono font-bold text-[10px] shadow-sm ring-2 ring-blue-300 dark:ring-blue-800">
                  B1 ★
                </div>
                <div className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200 rounded font-mono font-bold text-[10px]">
                  B2
                </div>
                <div className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold text-[10px] text-slate-500">
                  B3
                </div>
                <div className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold text-[10px] text-slate-500">
                  B4
                </div>
                <div className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold text-[10px] text-slate-500">
                  SLR
                </div>
              </div>
            </div>

            <span className="text-slate-500 dark:text-[#8d90a0] block mt-1">
              Likely allocation: <strong className="text-slate-900 dark:text-white">Coach B1, Berths 21 (LB) & 22 (MB)</strong>
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
};
