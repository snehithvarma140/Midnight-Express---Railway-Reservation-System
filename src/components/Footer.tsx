import React from 'react';
import { useApp } from '../context/AppContext';
import { Train, ShieldCheck, Lock, Headphones, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="w-full bg-slate-100 dark:bg-[#030e20] border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-[#c3c6d7] transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Overview */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-[#2563eb] text-white flex items-center justify-center shadow-sm">
                <Train className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-[#d7e3fc]">
                  National Railway Transit Authority
                </span>
                <span className="text-[11px] text-blue-600 dark:text-[#7bd0ff] font-semibold tracking-wider uppercase">
                  Midnight Express Rail Systems
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#8d90a0] max-w-md leading-relaxed">
              Next-generation passenger network delivering continuous train tracking, automated berth allocations, and
              ticket reservation services across overnight nocturnal corridors.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs">
              <Headphones className="w-4 h-4 text-amber-600 dark:text-[#ffb95f]" />
              <span>
                24/7 National Rail Helpline:{' '}
                <a href="tel:139" className="font-bold text-blue-700 dark:text-[#7bd0ff] hover:underline">
                  1800-419-RAIL (139)
                </a>
              </span>
            </div>
          </div>

          {/* Passenger Info Links */}
          <div className="flex flex-col gap-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-900 dark:text-[#d7e3fc] mb-1">
              Passenger Transit
            </span>
            <button
              onClick={() => setActiveView('search-trains')}
              className="text-left text-slate-600 dark:text-[#8d90a0] hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              Search Trains & Corridors
            </button>
            <button
              onClick={() => setActiveView('my-bookings')}
              className="text-left text-slate-600 dark:text-[#8d90a0] hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              My Bookings & PNR Tracking
            </button>
            <button
              onClick={() => setActiveView('travel-services')}
              className="text-left text-slate-600 dark:text-[#8d90a0] hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              Hotels, Cabs & E-Catering
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-left text-blue-600 dark:text-[#7bd0ff] font-semibold hover:underline transition-colors"
            >
              Express Dashboard &amp; Live Status
            </button>
          </div>

          {/* Security & Legal */}
          <div className="flex flex-col gap-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-900 dark:text-[#d7e3fc] mb-1">
              Security & Compliance
            </span>
            <div className="text-left text-slate-600 dark:text-[#8d90a0]">
              256-Bit IRCTC SSL Encryption
            </div>
            <button
              onClick={() => setActiveView('my-bookings')}
              className="text-left text-slate-600 dark:text-[#8d90a0] hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              Instant Refund & Cancellation
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className="text-left text-blue-600 dark:text-[#7bd0ff] font-semibold hover:underline flex items-center gap-1"
            >
              <span>DBMS Architecture & Schema</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-white/70 dark:bg-[#071325]/70 px-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
          <p className="text-slate-500 dark:text-[#8d90a0]">
            © 2026 Midnight Express Transit System • B.Tech Relational DBMS Project Simulation
          </p>
          <div className="flex items-center gap-4 font-semibold text-slate-600 dark:text-[#c3c6d7]">
            <span className="flex items-center gap-1.5 text-blue-700 dark:text-[#7bd0ff]">
              <Lock className="w-3.5 h-3.5" /> 256-bit Encrypted Gateway
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> ISO 27001 Certified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
