import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle,
  Train,
  Ticket,
  Printer,
  Download,
  Share2,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Sparkles,
  Copy,
  Utensils,
  MapPin,
  Clock,
  Compass,
} from 'lucide-react';

export const ConfirmationPage: React.FC = () => {
  const { selectedBookingForView, setActiveView, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const booking = selectedBookingForView;
  if (!booking) {
    return (
      <div className="py-16 text-center space-y-3">
        <h2 className="text-xl font-bold">No active confirmation selected</h2>
        <button
          onClick={() => setActiveView('dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleCopyPnr = () => {
    navigator.clipboard?.writeText(booking.pnr);
    setCopied(true);
    showToast(`PNR ${booking.pnr} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-[calc(100vh-16rem)] py-6 space-y-6">
      {/* Top Banner Celebration */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/25 shrink-0">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Booking Confirmed!
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold text-xs">
                CNF / ALLOTTED
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#c3c6d7] mt-0.5">
              Electronic Reservation Slip (ERS) dispatched to{' '}
              <strong className="text-slate-900 dark:text-white">{booking.contactEmail}</strong> and SMS to{' '}
              <strong className="text-slate-900 dark:text-white">{booking.contactMobile}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Printer className="w-4 h-4 text-blue-600 dark:text-[#7bd0ff]" />
            <span>Print E-Ticket</span>
          </button>
          <button
            onClick={() => setActiveView('my-bookings')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AUTHENTIC PERFORATED BOARDING PASS TICKET (Direct match with Screenshot 6) */}
      <div className="relative w-full bg-white dark:bg-[#0f1d33] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden print:border-none print:shadow-none">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Main Ticket Pane (9 cols) */}
          <div className="lg:col-span-9 p-6 sm:p-7 flex flex-col justify-between gap-6">
            {/* Ticket Header Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-[#7bd0ff] flex items-center justify-center shadow-xs">
                  <Train className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      {booking.trainNumber} {booking.trainName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#14233c] text-slate-700 dark:text-slate-300 text-[11px] font-mono font-bold">
                      {booking.trainType.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-[#8d90a0]">
                    Scheduled Departure: {booking.journeyDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  CONFIRMED (CNF)
                </span>
                <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-[#14233c] text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700">
                  {booking.platform}
                </div>
              </div>
            </div>

            {/* Journey Visual Timeline */}
            <div className="py-2 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Origin */}
              <div className="sm:col-span-4 flex flex-col">
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none font-mono">
                  {booking.departureTime}
                </span>
                <span className="text-base font-extrabold text-blue-600 dark:text-[#7bd0ff] mt-1">
                  {booking.fromCode}
                </span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">
                  {booking.fromStation}
                </span>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">
                  Platform 04 • Gate 2A
                </span>
              </div>

              {/* Track Vector Graphic */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center px-2 my-2 sm:my-0">
                <div className="w-full flex items-center justify-between text-slate-400 text-xs font-semibold pb-1.5">
                  <span>5h 30m non-stop</span>
                  <span>349 KM</span>
                </div>

                <div className="relative w-full flex items-center">
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                  <div className="absolute left-0 w-2/3 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-amber-500 rounded-full"></div>
                  <div className="absolute left-2/3 -top-2 w-5 h-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-md border-2 border-amber-500">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-blue-700 dark:text-[#7bd0ff] text-xs font-bold pt-2">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Corridor Clear • No Signal Delays</span>
                </div>
              </div>

              {/* Destination */}
              <div className="sm:col-span-4 flex flex-col sm:text-right">
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none font-mono">
                  {booking.arrivalTime}
                </span>
                <span className="text-base font-extrabold text-amber-600 dark:text-[#ffb95f] mt-1">
                  {booking.toCode}
                </span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">
                  {booking.toStation}
                </span>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">
                  Platform 01 Scheduled
                </span>
              </div>
            </div>

            {/* Passenger, Coach & Berth Grid (Matches Screenshot 6) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-[#14233c] border border-slate-200/80 dark:border-slate-700/80 p-4 rounded-xl text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Passenger</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {booking.passengers[0]?.fullName || booking.userName}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {booking.passengers.length} Adult(s) • Male
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coach & Berth</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-blue-700 dark:text-[#7bd0ff]">
                    {booking.passengers[0]?.assignedCoach || 'Coach A1'}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                    {booking.classType} Tier
                  </span>
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Berth {booking.passengers[0]?.assignedBerth || '02'} ({booking.passengers[0]?.assignedBerthType?.split(' ')[0] || 'Lower'})
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PNR Number</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-mono font-black text-slate-900 dark:text-white tracking-wider">
                    {booking.pnr}
                  </span>
                  <button
                    onClick={handleCopyPnr}
                    className="text-slate-400 hover:text-blue-600 transition-colors"
                    title="Copy PNR"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  Class: {booking.classType} • Quota: GN
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Fare</span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  ₹{booking.totalFare.toFixed(2)}
                </span>
                <span className="text-slate-500 dark:text-slate-400 truncate">
                  Paid via {booking.paymentMethod}
                </span>
              </div>
            </div>

            {/* Ticket Action Cluster */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-xs transition-all"
              >
                <Download className="w-4 h-4" />
                <span>View Digital Pass</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  showToast('E-Catering order opened for Coach ' + (booking.passengers[0]?.assignedCoach || 'A1'));
                  setActiveView('travel-services');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#14233c] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold flex items-center gap-2 transition-colors"
              >
                <Utensils className="w-4 h-4 text-slate-500" />
                <span>Pre-Book Meals</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(`Midnight Express Booking Confirmed! PNR: ${booking.pnr} for ${booking.trainName} on ${booking.journeyDate}`);
                  showToast('Booking summary copied for sharing via SMS/WhatsApp');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#14233c] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold flex items-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Share Itinerary</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('my-bookings')}
                className="ml-auto text-blue-600 dark:text-[#7bd0ff] hover:underline font-bold flex items-center gap-1"
              >
                <Clock className="w-4 h-4" /> Live NTES Status Tracker
              </button>
            </div>
          </div>

          {/* Right Perforated Stub Pane (3 cols) */}
          <div className="lg:col-span-3 bg-slate-50/80 dark:bg-[#071325]/90 p-6 flex flex-col items-center justify-between border-t lg:border-t-0 lg:border-l border-dashed border-slate-300 dark:border-slate-700 relative">
            <div className="w-full flex flex-col items-center text-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Digital Boarding Token
              </span>

              {/* High Contrast Scalable QR Code Pattern */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs my-1 flex flex-col items-center justify-center">
                <svg fill="#0f172a" height="128" viewBox="0 0 100 100" width="128">
                  {/* Corner Locators */}
                  <rect fill="#0f172a" height="28" width="28" x="5" y="5"></rect>
                  <rect fill="white" height="18" width="18" x="10" y="10"></rect>
                  <rect fill="#0f172a" height="10" width="10" x="14" y="14"></rect>
                  <rect fill="#0f172a" height="28" width="28" x="67" y="5"></rect>
                  <rect fill="white" height="18" width="18" x="72" y="10"></rect>
                  <rect fill="#0f172a" height="10" width="10" x="76" y="14"></rect>
                  <rect fill="#0f172a" height="28" width="28" x="5" y="67"></rect>
                  <rect fill="white" height="18" width="18" x="10" y="72"></rect>
                  <rect fill="#0f172a" height="10" width="10" x="14" y="76"></rect>
                  {/* Data Elements */}
                  <rect height="8" width="8" x="38" y="8"></rect>
                  <rect height="6" width="12" x="50" y="12"></rect>
                  <rect height="6" width="20" x="38" y="24"></rect>
                  <rect height="6" width="12" x="8" y="38"></rect>
                  <rect height="8" width="8" x="24" y="42"></rect>
                  <rect height="10" width="10" x="38" y="38"></rect>
                  <rect height="16" width="8" x="54" y="38"></rect>
                  <rect height="6" width="22" x="68" y="40"></rect>
                  <rect height="8" width="12" x="74" y="52"></rect>
                  <rect height="12" width="12" x="38" y="54"></rect>
                  <rect height="10" width="18" x="8" y="50"></rect>
                  <rect height="6" width="18" x="38" y="72"></rect>
                  <rect height="18" width="8" x="62" y="66"></rect>
                  <rect height="10" width="14" x="76" y="68"></rect>
                </svg>
              </div>

              <span className="text-xs font-mono font-bold text-blue-700 dark:text-[#7bd0ff]">
                {booking.qrToken}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-[#8d90a0] text-center max-w-[200px]">
                Scan at Platform 04 TTE Automated Gate Validator
              </span>
            </div>

            {/* Quick Security Verification */}
            <div className="w-full pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>ID Card Required On-Board</span>
              </div>
              <span className="text-[11px] font-medium text-slate-400">Aadhaar • Passport • DL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Post-booking Navigation CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setActiveView('search-trains')}
          className="p-4 rounded-xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 hover:border-blue-400 text-left transition-all group"
        >
          <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center justify-between">
            <span>Book Another Journey</span>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <span className="text-xs text-slate-500">Search routes across 14+ rail hubs</span>
        </button>

        <button
          onClick={() => setActiveView('station-services')}
          className="p-4 rounded-xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 hover:border-amber-400 text-left transition-all group"
        >
          <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center justify-between">
            <span>View Terminal Blueprint</span>
            <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <span className="text-xs text-slate-500">Wayfinding, Lounges, and Cabs at {booking.toCode}</span>
        </button>

        <button
          onClick={() => setActiveView('my-bookings')}
          className="p-4 rounded-xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 hover:border-emerald-400 text-left transition-all group"
        >
          <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center justify-between">
            <span>Manage Reservation</span>
            <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <span className="text-xs text-slate-500">Instant TDR, Cancellation & Berth details</span>
        </button>
      </div>
    </div>
  );
};
