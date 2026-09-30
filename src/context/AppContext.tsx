import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Station, Train, Booking, Passenger, Infant, TrainClassType } from '../types';
import { DEMO_USERS, INITIAL_STATIONS, INITIAL_TRAINS, INITIAL_BOOKINGS, SAVED_PASSENGERS_SEED } from '../data/seedData';
import confetti from 'canvas-confetti';

interface SearchState {
  fromCode: string;
  fromName: string;
  toCode: string;
  toName: string;
  journeyDate: string;
  classType: string;
  quota: 'General' | 'Tatkal' | 'Ladies' | 'Sr. Citizen';
  passengersCount: number;
  flexibleDays: boolean;
  directOnly: boolean;
  passPreference: boolean;
}

interface BookingDraft {
  train: Train | null;
  selectedClass: TrainClassType;
  quota: 'General' | 'Tatkal' | 'Ladies' | 'Sr. Citizen';
  boardingStationCode: string;
  boardingStationName: string;
  passengers: Passenger[];
  infants: Infant[];
  contactMobile: string;
  contactEmail: string;
  emergencyContact: string;
  options: {
    autoUpgradation: boolean;
    vikalpOpted: boolean;
    sameCoachOnly: boolean;
    lowerBerthOnly: boolean;
    preferredCoach: string;
    hasGstin: boolean;
    gstin: string;
    companyName: string;
    companyPincode: string;
    travelInsurance: boolean;
  };
}

interface AppContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentUser: User | null;
  loginUser: (role: 'USER' | 'ADMIN', email?: string, name?: string) => void;
  updateUserName: (name: string) => void;
  logoutUser: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  stations: Station[];
  trains: Train[];
  bookings: Booking[];
  savedPassengers: typeof SAVED_PASSENGERS_SEED;
  searchState: SearchState;
  setSearchState: React.Dispatch<React.SetStateAction<SearchState>>;
  swapStations: () => void;
  bookingDraft: BookingDraft;
  setBookingDraft: React.Dispatch<React.SetStateAction<BookingDraft>>;
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  startBookingForTrain: (train: Train, classType: TrainClassType) => void;
  completeBooking: (paymentMethod: string) => Booking;
  cancelBooking: (bookingId: string, passengerIds?: string[]) => { refundAmount: number; charge: number };
  findBookingByPnr: (pnr: string) => Booking | undefined;
  addStation: (station: Station) => void;
  updateStation: (station: Station) => void;
  deleteStation: (id: string) => void;
  addTrain: (train: Train) => void;
  updateTrain: (train: Train) => void;
  deleteTrain: (id: string) => void;
  selectedBookingForView: Booking | null;
  setSelectedBookingForView: (b: Booking | null) => void;
  selectedStationForView: Station | null;
  setSelectedStationForView: (s: Station | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Dark mode init
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('midnight_express_dark_mode');
    if (saved !== null) return saved === 'true';
    return true; // Default to signature dark mode as in screenshot 1
  });

  useEffect(() => {
    localStorage.setItem('midnight_express_dark_mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // User auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedName = localStorage.getItem('midnight_express_user_name');
    if (savedName) {
      return {
        ...DEMO_USERS[0],
        name: savedName,
        email: savedName.toLowerCase().replace(/\s+/g, '.') + '@midnight.express',
      };
    }
    return DEMO_USERS[0];
  });
  const [activeView, setActiveView] = useState<string>(() => {
    const saved = localStorage.getItem('midnight_express_active_view');
    return saved || 'auth'; // Starts on the authentic nocturnal login & arrival gate page
  });

  useEffect(() => {
    localStorage.setItem('midnight_express_active_view', activeView);
  }, [activeView]);

  const [savedPassengers, setSavedPassengers] = useState(() => {
    const currentName = localStorage.getItem('midnight_express_user_name') || DEMO_USERS[0].name;
    return SAVED_PASSENGERS_SEED.map((p, idx) => (idx === 0 ? { ...p, fullName: currentName } : p));
  });

  const updateUserName = (newName: string) => {
    const finalName = newName.trim();
    if (!finalName) return;

    localStorage.setItem('midnight_express_user_name', finalName);

    setCurrentUser(prev =>
      prev
        ? {
            ...prev,
            name: finalName,
            email: finalName.toLowerCase().replace(/\s+/g, '.') + '@midnight.express',
          }
        : null
    );

    // Reflect dynamically throughout all existing bookings
    setBookings(prev =>
      prev.map(b => ({
        ...b,
        userName: finalName,
        passengers: b.passengers.map((p, idx) => (idx === 0 ? { ...p, fullName: finalName } : p)),
      }))
    );

    // Reflect in booking draft
    setBookingDraft(prev => ({
      ...prev,
      passengers: prev.passengers.map((p, idx) => (idx === 0 ? { ...p, fullName: finalName } : p)),
    }));

    // Reflect in saved passengers list
    setSavedPassengers(prev =>
      prev.map((p, idx) => (idx === 0 ? { ...p, fullName: finalName } : p))
    );

    showToast(`Identity updated: ${finalName} synced across all railway records`);
  };

  const loginUser = (role: 'USER' | 'ADMIN', email?: string, name?: string) => {
    if (role === 'ADMIN') {
      const adminName = name?.trim() || DEMO_USERS[1].name;
      const adminUser: User = {
        ...DEMO_USERS[1],
        name: adminName,
        email: email || DEMO_USERS[1].email,
      };
      setCurrentUser(adminUser);
      localStorage.setItem('midnight_express_user_name', adminName);
      setActiveView('admin');
      showToast(`Logged in as Chief Controller: ${adminName}`);
    } else {
      const finalName = name?.trim() || currentUser?.name || 'Snehith Varma';
      const u: User = {
        ...DEMO_USERS[0],
        name: finalName,
        email: email || finalName.toLowerCase().replace(/\s+/g, '.') + '@midnight.express',
      };
      setCurrentUser(u);
      localStorage.setItem('midnight_express_user_name', finalName);

      // Reflect in all bookings
      setBookings(prev =>
        prev.map(b => ({
          ...b,
          userName: finalName,
          passengers: b.passengers.map((p, idx) => (idx === 0 ? { ...p, fullName: finalName } : p)),
        }))
      );

      // Reflect in booking draft
      setBookingDraft(prev => ({
        ...prev,
        passengers: prev.passengers.map((p, idx) => (idx === 0 ? { ...p, fullName: finalName } : p)),
      }));

      // Reflect in saved passengers
      setSavedPassengers(prev =>
        prev.map((p, idx) => (idx === 0 ? { ...p, fullName: finalName } : p))
      );

      setActiveView('dashboard');
      showToast('Welcome aboard, ' + finalName);
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setActiveView('auth');
    showToast('Logged out of passenger terminal');
  };

  // Stations, Trains, Bookings
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [trains, setTrains] = useState<Train[]>(INITIAL_TRAINS);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('midnight_express_bookings');
    const userName = localStorage.getItem('midnight_express_user_name') || DEMO_USERS[0].name;
    if (saved) {
      try {
        const parsed: Booking[] = JSON.parse(saved);
        return parsed.map(b => ({
          ...b,
          userName,
          passengers: b.passengers.map((p, idx) => (idx === 0 ? { ...p, fullName: userName } : p)),
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BOOKINGS.map(b => ({
      ...b,
      userName,
      passengers: b.passengers.map((p, idx) => (idx === 0 ? { ...p, fullName: userName } : p)),
    }));
  });

  useEffect(() => {
    localStorage.setItem('midnight_express_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Global search modal
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);

  // Keyboard shortcut for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Search State
  const [searchState, setSearchState] = useState<SearchState>({
    fromCode: 'HYB',
    fromName: 'Hyderabad Deccan (HYB)',
    toCode: 'BZA',
    toName: 'Vijayawada Junction (BZA)',
    journeyDate: '28 Sep 2026',
    classType: 'All Classes (1A, 2A, 3A, SL)',
    quota: 'General',
    passengersCount: 1,
    flexibleDays: true,
    directOnly: false,
    passPreference: false,
  });

  const swapStations = () => {
    setSearchState(prev => ({
      ...prev,
      fromCode: prev.toCode,
      fromName: prev.toName,
      toCode: prev.fromCode,
      toName: prev.fromName,
    }));
    showToast('Swapped departure and destination');
  };

  // Booking Draft
  const [bookingDraft, setBookingDraft] = useState<BookingDraft>({
    train: INITIAL_TRAINS[0],
    selectedClass: '3A',
    quota: 'General',
    boardingStationCode: 'HYB',
    boardingStationName: 'HYB - Hyderabad Deccan (Dep 06:00 AM)',
    passengers: [
      {
        id: 'draft-pax-1',
        fullName: 'Snehith Varma',
        age: 20,
        gender: 'M',
        berthPreference: 'LB',
        foodOption: 'VEG',
        nationality: 'India (🇮🇳)',
        aadhaarVerified: true,
        status: 'CONFIRMED',
      },
      {
        id: 'draft-pax-2',
        fullName: 'Rahul Kumar',
        age: 21,
        gender: 'M',
        berthPreference: 'MB',
        foodOption: 'NONE',
        nationality: 'India (🇮🇳)',
        aadhaarVerified: true,
        status: 'CONFIRMED',
      },
    ],
    infants: [
      {
        id: 'draft-inf-1',
        name: 'Arjun Varma',
        age: 2,
        gender: 'M',
        accompaniedBy: 'Snehith Varma',
      },
    ],
    contactMobile: '+91 98765 43210',
    contactEmail: 'snehith@midnight.express',
    emergencyContact: '+91 94401 23456',
    options: {
      autoUpgradation: true,
      vikalpOpted: false,
      sameCoachOnly: true,
      lowerBerthOnly: false,
      preferredCoach: '',
      hasGstin: false,
      gstin: '',
      companyName: '',
      companyPincode: '',
      travelInsurance: true,
    },
  });

  const [selectedBookingForView, setSelectedBookingForView] = useState<Booking | null>(INITIAL_BOOKINGS[0]);
  const [selectedStationForView, setSelectedStationForView] = useState<Station | null>(INITIAL_STATIONS[0]);

  const startBookingForTrain = (train: Train, classType: TrainClassType) => {
    setBookingDraft(prev => ({
      ...prev,
      train,
      selectedClass: classType,
      boardingStationCode: train.sourceCode,
      boardingStationName: `${train.sourceCode} - ${train.sourceStation} (Dep ${train.departureTime})`,
    }));
    setActiveView('booking-config');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completeBooking = (paymentMethod: string): Booking => {
    const t = bookingDraft.train || trains[0];
    const pnrGenerated = '48' + Math.floor(10000000 + Math.random() * 90000000).toString();
    const txnId = 'TXN-' + Date.now().toString();
    const token = 'TOKEN # ME-' + Math.floor(1000 + Math.random() * 9000) + '-' + t.destCode;

    const classInfo = t.classes.find(c => c.classType === bookingDraft.selectedClass) || t.classes[0];
    const baseTicketTotal = classInfo.fare * bookingDraft.passengers.length;
    const resSurcharge = 40 * bookingDraft.passengers.length;
    const sfastLevy = 45 * bookingDraft.passengers.length;
    const gst = Math.round(baseTicketTotal * 0.05 * 10) / 10;
    const catering = bookingDraft.passengers.filter(p => p.foodOption !== 'NONE').length * 70;
    const insurance = bookingDraft.options.travelInsurance ? 0.45 * bookingDraft.passengers.length : 0;
    const gatewayFee = 15;
    const totalAmount = baseTicketTotal + resSurcharge + sfastLevy + gst + catering + insurance + gatewayFee;

    // Allocate coach & berth based on class
    const coachLetter = bookingDraft.selectedClass === '1A' ? 'H1' : bookingDraft.selectedClass === '2A' ? 'A1' : bookingDraft.selectedClass === '3A' ? 'B1' : 'S1';
    const updatedPassengers: Passenger[] = bookingDraft.passengers.map((p, idx) => {
      const berthNo = (idx * 3 + 2).toString().padStart(2, '0');
      const berthType = p.berthPreference !== 'NONE' ? (p.berthPreference === 'LB' ? 'Lower Berth (LB)' : p.berthPreference === 'MB' ? 'Middle Berth (MB)' : p.berthPreference === 'UB' ? 'Upper Berth (UB)' : 'Side Lower (SL)') : 'Lower Berth (LB)';
      return {
        ...p,
        assignedCoach: `Coach ${coachLetter}`,
        assignedBerth: berthNo,
        assignedBerthType: berthType,
        status: 'CONFIRMED',
      };
    });

    const newBooking: Booking = {
      id: 'bk-' + pnrGenerated,
      pnr: pnrGenerated,
      userId: currentUser?.id || 'guest',
      userEmail: bookingDraft.contactEmail,
      userName: currentUser?.name || bookingDraft.passengers[0]?.fullName || 'Passenger',
      trainNumber: t.number,
      trainName: t.name,
      trainType: t.type,
      fromStation: t.sourceStation,
      fromCode: t.sourceCode,
      toStation: t.destStation,
      toCode: t.destCode,
      boardingStation: bookingDraft.boardingStationName,
      boardingCode: bookingDraft.boardingStationCode,
      departureTime: t.departureTime,
      arrivalTime: t.arrivalTime,
      journeyDate: searchState.journeyDate,
      classType: bookingDraft.selectedClass,
      quota: bookingDraft.quota,
      passengers: updatedPassengers,
      infants: bookingDraft.infants,
      contactMobile: bookingDraft.contactMobile,
      contactEmail: bookingDraft.contactEmail,
      emergencyContact: bookingDraft.emergencyContact,
      baseFare: baseTicketTotal,
      reservationSurcharge: resSurcharge,
      superfastLevy: sfastLevy,
      gstAmount: gst,
      cateringCharge: catering,
      insuranceCharge: insurance,
      gatewayFee,
      totalFare: totalAmount,
      paymentMethod,
      transactionId: txnId,
      paymentStatus: 'SUCCESS',
      bookingStatus: 'CONFIRMED',
      bookedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      platform: t.route[0]?.platform || 'Platform 04',
      qrToken: token,
      options: {
        autoUpgradation: bookingDraft.options.autoUpgradation,
        sameCoachOnly: bookingDraft.options.sameCoachOnly,
        vikalpOpted: bookingDraft.options.vikalpOpted,
      },
    };

    setBookings(prev => [newBooking, ...prev]);
    setSelectedBookingForView(newBooking);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#38bdf8', '#f59e0b', '#10b981'],
      });
    } catch (e) {
      console.warn(e);
    }

    return newBooking;
  };

  const cancelBooking = (bookingId: string, _passengerIds?: string[]) => {
    let refundAmount = 0;
    let cancellationCharge = 0;

    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          cancellationCharge = Math.round(b.totalFare * 0.15); // 15% cancellation charge
          refundAmount = b.totalFare - cancellationCharge;
          return {
            ...b,
            bookingStatus: 'CANCELLED',
            paymentStatus: 'REFUNDED',
            cancellationDetails: {
              cancelledAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US'),
              cancellationCharge,
              refundAmount,
              refundTransactionId: 'REF-' + Math.floor(1000000000 + Math.random() * 9000000000),
              cancelledPassengersCount: b.passengers.length,
            },
            passengers: b.passengers.map(p => ({ ...p, status: 'CANCELLED' })),
          };
        }
        return b;
      })
    );

    showToast(`Booking cancelled. ₹${refundAmount.toFixed(2)} refunded to original payment method.`);
    return { refundAmount, charge: cancellationCharge };
  };

  const findBookingByPnr = (pnr: string) => {
    const clean = pnr.trim();
    return bookings.find(b => b.pnr === clean);
  };

  // Admin CRUD for Stations
  const addStation = (stn: Station) => {
    setStations(prev => [...prev, stn]);
    showToast(`Station ${stn.code} added successfully.`);
  };
  const updateStation = (stn: Station) => {
    setStations(prev => prev.map(s => (s.id === stn.id ? stn : s)));
    showToast(`Station ${stn.code} updated.`);
  };
  const deleteStation = (id: string) => {
    setStations(prev => prev.filter(s => s.id !== id));
    showToast('Station removed from database.');
  };

  // Admin CRUD for Trains
  const addTrain = (trn: Train) => {
    setTrains(prev => [...prev, trn]);
    showToast(`Train #${trn.number} created successfully.`);
  };
  const updateTrain = (trn: Train) => {
    setTrains(prev => prev.map(t => (t.id === trn.id ? trn : t)));
    showToast(`Train #${trn.number} updated.`);
  };
  const deleteTrain = (id: string) => {
    setTrains(prev => prev.filter(t => t.id !== id));
    showToast('Train removed from schedule.');
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        currentUser,
        loginUser,
        updateUserName,
        logoutUser,
        activeView,
        setActiveView,
        stations,
        trains,
        bookings,
        savedPassengers,
        searchState,
        setSearchState,
        swapStations,
        bookingDraft,
        setBookingDraft,
        globalSearchOpen,
        setGlobalSearchOpen,
        toastMessage,
        showToast,
        startBookingForTrain,
        completeBooking,
        cancelBooking,
        findBookingByPnr,
        addStation,
        updateStation,
        deleteStation,
        addTrain,
        updateTrain,
        deleteTrain,
        selectedBookingForView,
        setSelectedBookingForView,
        selectedStationForView,
        setSelectedStationForView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
