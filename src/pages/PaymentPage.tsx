import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  Wallet,
  ArrowRight,
  ArrowLeft,
  Lock,
  CheckCircle,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const {
    bookingDraft,
    searchState,
    currentUser,
    completeBooking,
    setActiveView,
    showToast,
  } = useApp();

  const [paymentMode, setPaymentMode] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [upiId, setUpiId] = useState(() => `${(currentUser?.name || 'snehith').toLowerCase().replace(/\s+/g, '')}@okhdfcbank`);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('781');
  const [cardName, setCardName] = useState(() => currentUser?.name || 'Snehith Varma');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [isProcessing, setIsProcessing] = useState(false);

  const train = bookingDraft.train;
  const paxCount = bookingDraft.passengers.length;
  const classObj = train?.classes.find(c => c.classType === bookingDraft.selectedClass) || train?.classes[0];
  const unitFare = classObj?.fare || 890;
  const baseTicket = unitFare * paxCount;
  const totalAmount =
    baseTicket +
    40 * paxCount +
    45 * paxCount +
    Math.round(baseTicket * 0.05 * 10) / 10 +
    (bookingDraft.passengers.filter(p => p.foodOption !== 'NONE').length * 70) +
    (bookingDraft.options.travelInsurance ? 0.45 * paxCount : 0) +
    15.0;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const modeName =
      paymentMode === 'upi'
        ? `UPI (${upiId})`
        : paymentMode === 'card'
        ? `Card (${cardNumber.slice(-4)})`
        : paymentMode === 'netbanking'
        ? `Net Banking (${selectedBank.split(' ')[0]})`
        : 'IRCTC RailPay Wallet';

    setTimeout(() => {
      completeBooking(modeName);
      setIsProcessing(false);
      setActiveView('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  return (
    <div className="w-full min-h-[calc(100vh-16rem)] py-6 max-w-4xl mx-auto space-y-6">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-blue-700 dark:text-[#7bd0ff] uppercase tracking-wider block">
            Payment & Confirmation Step
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Select Payment Method
          </h1>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
          <Lock className="w-3.5 h-3.5" /> 256-bit Secure Gateway
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Form: Payment Modes */}
        <div className="md:col-span-8 bg-white dark:bg-[#0f1d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          {/* Payment Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMode('upi')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                paymentMode === 'upi'
                  ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-600 text-blue-700 dark:text-[#7bd0ff] shadow-xs'
                  : 'bg-slate-50 dark:bg-[#14233c] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span className="text-xs font-bold">UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMode('card')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                paymentMode === 'card'
                  ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-600 text-blue-700 dark:text-[#7bd0ff] shadow-xs'
                  : 'bg-slate-50 dark:bg-[#14233c] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-xs font-bold">Debit / Credit</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMode('netbanking')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                paymentMode === 'netbanking'
                  ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-600 text-blue-700 dark:text-[#7bd0ff] shadow-xs'
                  : 'bg-slate-50 dark:bg-[#14233c] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Building className="w-5 h-5" />
              <span className="text-xs font-bold">Net Banking</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMode('wallet')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                paymentMode === 'wallet'
                  ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-600 text-blue-700 dark:text-[#7bd0ff] shadow-xs'
                  : 'bg-slate-50 dark:bg-[#14233c] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span className="text-xs font-bold">RailPay Wallet</span>
            </button>
          </div>

          {/* Mode Form Content */}
          <form onSubmit={handlePay} className="space-y-4">
            {paymentMode === 'upi' && (
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Instant UPI Auto-Verification</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Zero Surcharge</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                    Enter Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {['@okaxis', '@okhdfcbank', '@paytm', '@ybl', '@ibl'].map(vpa => (
                    <button
                      key={vpa}
                      type="button"
                      onClick={() => setUpiId(`snehith${vpa}`)}
                      className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px]"
                    >
                      {vpa}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentMode === 'card' && (
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 text-xs">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3.5 py-2 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                      Valid Thru (MM/YY)
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3.5 py-2 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3.5 py-2 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            )}

            {paymentMode === 'netbanking' && (
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">Select Retail Bank</span>
                <select
                  value={selectedBank}
                  onChange={e => setSelectedBank(e.target.value)}
                  className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3.5 py-2 text-sm font-bold text-slate-900 dark:text-white outline-none"
                >
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank</option>
                  <option>Bank of Baroda</option>
                </select>
              </div>
            )}

            {paymentMode === 'wallet' && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">RailPay Balance:</span>
                  <span className="font-mono text-base font-black text-emerald-600">₹8,450.00</span>
                </div>
                <p className="text-slate-500">
                  Instant one-tap deduction with zero OTP required for pre-authenticated passenger accounts.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all duration-200"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authorizing with Railway PRS...</span>
                </div>
              ) : (
                <>
                  <span>Pay ₹{totalAmount.toFixed(2)} & Generate PNR</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Summary Sidebar */}
        <div className="md:col-span-4 bg-white dark:bg-[#0f1d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm block">Payment Summary</span>
            <span className="text-slate-500">{paxCount} Passenger(s) • {train?.name}</span>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-[#c3c6d7]">
            <div className="flex justify-between font-semibold">
              <span>Total Payable</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Journey Date</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{searchState.journeyDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Class</span>
              <span className="font-semibold text-blue-700 dark:text-[#7bd0ff]">{bookingDraft.selectedClass} Tier</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Instant Berth Allocation on Success
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> Auto-Refund within 15 mins upon cancellation
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveView('booking-config')}
            className="w-full py-2 rounded-lg bg-slate-100 dark:bg-[#14233c] text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Modify Passenger Details
          </button>
        </div>
      </div>
    </div>
  );
};
