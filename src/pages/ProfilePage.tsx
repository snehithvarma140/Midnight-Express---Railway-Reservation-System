import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { SavedPassenger } from '../types';
import {
  User as UserIcon,
  ShieldCheck,
  Smartphone,
  Mail,
  Calendar,
  Lock,
  PlusCircle,
  Trash2,
  Edit2,
  CheckCircle,
  Save,
  Users,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, savedPassengers, showToast, updateUserName } = useApp();

  const [name, setName] = useState(currentUser?.name || 'Snehith Varma');
  const [email, setEmail] = useState(currentUser?.email || 'snehith@midnight.express');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [passengersList, setPassengersList] = useState<SavedPassenger[]>(savedPassengers);

  // Sync state if currentUser changes
  React.useEffect(() => {
    if (currentUser?.name) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const [newPaxName, setNewPaxName] = useState('');
  const [newPaxAge, setNewPaxAge] = useState(25);
  const [newPaxGender, setNewPaxGender] = useState<'M' | 'F' | 'TG'>('M');
  const [newPaxBerth, setNewPaxBerth] = useState<'LB' | 'MB' | 'UB' | 'SL' | 'SU' | 'NONE'>('LB');
  const [newPaxFood, setNewPaxFood] = useState<'VEG' | 'NONVEG' | 'JAIN' | 'NONE'>('VEG');
  const [showAddPax, setShowAddPax] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateUserName(name.trim());
    }
    showToast('Passenger profile credentials updated successfully.');
  };

  const handleAddNewSavedPax = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaxName.trim()) return;

    const pax = {
      id: 'sp-' + Date.now(),
      fullName: newPaxName,
      age: newPaxAge,
      gender: newPaxGender,
      berthPreference: newPaxBerth,
      foodOption: newPaxFood,
      nationality: 'India (🇮🇳)',
      aadhaarVerified: true,
    };

    setPassengersList(prev => [...prev, pax]);
    setNewPaxName('');
    setShowAddPax(false);
    showToast(`Added ${pax.fullName} to your Master Passenger List`);
  };

  const handleRemoveSavedPax = (id: string) => {
    setPassengersList(prev => prev.filter(p => p.id !== id));
    showToast('Passenger removed from Master List');
  };

  return (
    <div className="w-full min-h-[calc(100vh-16rem)] py-6 max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold text-blue-700 dark:text-[#7bd0ff] uppercase tracking-wider block">
          Passenger Terminal Credentials
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Account Profile & Master Passenger List
        </h1>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white dark:bg-[#0f1d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 dark:bg-[#2563eb] text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-600/25">
              <UserIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">{name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> DigiLocker Verified
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-[#8d90a0]">
                Member Since: {currentUser?.memberSince || 'Oct 2024'} • Role: {currentUser?.role || 'USER'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Mobile Number (SMS Dispatch)</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Aadhaar Status</label>
            <div className="w-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Aadhaar Linked (•••• •••• 9281)
            </div>
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" /> Save Profile Details
            </button>
          </div>
        </form>
      </div>

      {/* Saved Master Passenger List */}
      <div className="bg-white dark:bg-[#0f1d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-[#7bd0ff]" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Saved Master Passenger List
            </h3>
          </div>
          <button
            onClick={() => setShowAddPax(p => !p)}
            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-[#7bd0ff] font-bold text-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> {showAddPax ? 'Cancel' : 'Add Passenger'}
          </button>
        </div>

        {/* Add Form */}
        {showAddPax && (
          <form
            onSubmit={handleAddNewSavedPax}
            className="p-4 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 space-y-3 text-xs animate-in fade-in"
          >
            <span className="font-bold text-slate-900 dark:text-white block">Add Traveler Profile to PRS List</span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Varma"
                  value={newPaxName}
                  onChange={e => setNewPaxName(e.target.value)}
                  className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-xs font-semibold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Age</label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  value={newPaxAge}
                  onChange={e => setNewPaxAge(parseInt(e.target.value) || 25)}
                  className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-xs font-semibold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Gender</label>
                <select
                  value={newPaxGender}
                  onChange={e => setNewPaxGender(e.target.value as any)}
                  className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-xs font-medium"
                >
                  <option value="M">Male (M)</option>
                  <option value="F">Female (F)</option>
                  <option value="TG">Transgender (TG)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Berth Preference</label>
                <select
                  value={newPaxBerth}
                  onChange={e => setNewPaxBerth(e.target.value as any)}
                  className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="LB">Lower Berth (LB)</option>
                  <option value="MB">Middle Berth (MB)</option>
                  <option value="UB">Upper Berth (UB)</option>
                  <option value="SL">Side Lower (SL)</option>
                  <option value="SU">Side Upper (SU)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Food Option</label>
                <select
                  value={newPaxFood}
                  onChange={e => setNewPaxFood(e.target.value as any)}
                  className="w-full bg-white dark:bg-[#0f1d33] border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="VEG">Veg Breakfast & Thali</option>
                  <option value="NONVEG">Non-Veg Meals</option>
                  <option value="JAIN">Jain Satvik Meal</option>
                  <option value="NONE">No Food / Opt-out</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
            >
              Save Traveler
            </button>
          </form>
        )}

        {/* Existing List */}
        <div className="space-y-2 text-xs">
          {passengersList.map(pax => (
            <div
              key={pax.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-[#7bd0ff] flex items-center justify-center font-bold">
                  {pax.fullName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{pax.fullName}</span>
                    {pax.aadhaarVerified && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 px-1.5 py-0.2 rounded font-semibold">
                        Aadhaar Verified
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 dark:text-[#8d90a0]">
                    {pax.age} yrs • {pax.gender === 'M' ? 'Male' : 'Female'} • Pref: {pax.berthPreference} • Meal: {pax.foodOption}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleRemoveSavedPax(pax.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                title="Remove passenger"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
