import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  PhoneCall,
  ShieldAlert,
  FileQuestion,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const HelpSupportPage: React.FC = () => {
  const { showToast } = useApp();
  const [supportName, setSupportName] = useState('Snehith Varma');
  const [supportPnr, setSupportPnr] = useState('4827163950');
  const [supportCategory, setSupportCategory] = useState('PNR & Seat Allocation');
  const [supportMessage, setSupportMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What are the Tatkal booking windows for AC and Non-AC coaches?',
      a: 'As per standard railway PRS protocols, Tatkal booking opens at 10:00 AM for all AC classes (1A, 2A, 3A, CC, EC) and at 11:00 AM for non-AC classes (Sleeper SL, Second Seating 2S), exactly 1 day prior to the train departure date from origin station.',
    },
    {
      q: 'How does the Free Auto-Upgradation algorithm operate?',
      a: 'When you select "Consider for Free Auto-Upgradation", the PRS algorithm automatically moves eligible confirmed passengers to higher vacant tiers (e.g. AC 3 Tier to AC 2 Tier, or AC 2 Tier to AC First) during final chart preparation 4 hours before departure at zero additional charge.',
    },
    {
      q: 'How quickly is the refund processed upon ticket cancellation?',
      a: 'Midnight Express utilizes automated real-time banking gateways. Once a cancellation is confirmed, the refund amount (fare minus cancellation levy) is credited back to your original payment mode (UPI, card, or wallet) within 15 minutes.',
    },
    {
      q: 'What photo identity proofs are mandatory during transit?',
      a: 'Any government issued original ID: Aadhaar Card, Driving License, Passport, Voter ID Card, or DigiLocker digital credentials are fully valid. Photocopies are not accepted.',
    },
    {
      q: 'When is the final train chart prepared?',
      a: 'First chart is prepared 4 hours prior to scheduled departure from the originating station. The second and final chart is finalized 30 minutes before departure after allocating any last-minute emergency vacancies.',
    },
  ];

  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    showToast(`Support ticket #RAIL-${Math.floor(100000 + Math.random() * 900000)} logged! Chief Controller response dispatched via SMS.`);
    setSupportMessage('');
  };

  return (
    <div className="w-full min-h-[calc(100vh-16rem)] py-6 max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold text-blue-700 dark:text-[#7bd0ff] uppercase tracking-wider block">
          24/7 Rail Madad & Passenger Grievance
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Help, Support & Rail Assistance
        </h1>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-base">Rail Madad 24x7 Security & Medical Hotline</span>
              <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 font-bold text-[10px]">
                DIAL 139
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5">
              Instant medical assistance, coach cleaning requests, onboard theft reporting, and women safety squads.
            </p>
          </div>
        </div>

        <a
          href="tel:139"
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold whitespace-nowrap shadow-sm"
        >
          Call 139 Now
        </a>
      </div>

      {/* Two Column Layout: FAQ + Contact Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* FAQs (7 cols) */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <FileQuestion className="w-5 h-5 text-blue-600 dark:text-[#7bd0ff]" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-[#14233c] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-slate-600 dark:text-[#c3c6d7] leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form (5 cols) */}
        <div className="md:col-span-5 bg-white dark:bg-[#0f1d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-900 dark:text-white text-sm">Submit Online Passenger Ticket</span>
          </div>

          <form onSubmit={handleSubmitSupport} className="space-y-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Passenger Name</label>
              <input
                type="text"
                required
                value={supportName}
                onChange={e => setSupportName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">10-Digit PNR (Optional)</label>
              <input
                type="text"
                value={supportPnr}
                onChange={e => setSupportPnr(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={supportCategory}
                onChange={e => setSupportCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none"
              >
                <option>PNR & Seat Allocation</option>
                <option>Refund & Cancellation Query</option>
                <option>Coach Cleanliness / Hygiene</option>
                <option>e-Catering Delay</option>
                <option>Luggage / Lost Property</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Describe Your Query</label>
              <textarea
                rows={3}
                required
                value={supportMessage}
                onChange={e => setSupportMessage(e.target.value)}
                placeholder="Provide coach number, station, or transaction reference..."
                className="w-full bg-slate-50 dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Grievance</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
