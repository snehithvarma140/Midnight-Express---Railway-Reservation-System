import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Hotel,
  Car,
  Utensils,
  Zap,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Phone,
  Sparkles,
  Plus,
  Minus,
  Trash2,
  QrCode,
  Calendar,
  Search,
  Check,
  CreditCard,
  X,
  PackageCheck,
  Key,
  BadgeCheck,
  Navigation,
  CarFront,
  Luggage,
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  diet: 'VEG' | 'NONVEG' | 'JAIN';
  desc: string;
  prepTime: string;
  rating: number;
  imageEmoji: string;
  category: string;
}

interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  station: string;
  stationCode: string;
  rating: number;
  reviewsCount: number;
  badge: string;
  cuisine: string;
  deliveryTime: string;
  minOrder: number;
  fssaiNumber: string;
  menu: MenuItem[];
}

const RESTAURANTS_DATA: Restaurant[] = [
  {
    id: 'rest-1',
    name: "Haldiram's Express",
    tagline: 'Pure Veg Royal Indian Delicacies & Thalis',
    station: 'New Delhi (NDLS) & All Major Hubs',
    stationCode: 'NDLS',
    rating: 4.9,
    reviewsCount: 3820,
    badge: 'IRCTC Best Rated',
    cuisine: 'North Indian • Sweets • Thali',
    deliveryTime: '20 mins',
    minOrder: 150,
    fssaiNumber: '10014011001890',
    menu: [
      {
        id: 'h1',
        name: 'Special Maharaja Thali',
        price: 260,
        diet: 'VEG',
        desc: 'Paneer butter masala, Dal makhani, Mix veg, Jeera rice, 3 Tawa rotis, Raita, Gulab jamun & Papad.',
        prepTime: '15 min',
        rating: 4.9,
        imageEmoji: '🍱',
        category: 'Thalis',
      },
      {
        id: 'h2',
        name: 'Chole Bhature Platter (2 Pcs)',
        price: 180,
        diet: 'VEG',
        desc: 'Crispy puffy bhaturas served with spicy Punjabi pindi chole, pickle and onion salad.',
        prepTime: '12 min',
        rating: 4.8,
        imageEmoji: '🫓',
        category: 'Combos',
      },
      {
        id: 'h3',
        name: 'Paneer Tikka Masala Meal Bowl',
        price: 220,
        diet: 'VEG',
        desc: 'Smokey tandoori paneer in rich spiced cashew tomato gravy served with steamed basmati rice.',
        prepTime: '15 min',
        rating: 4.7,
        imageEmoji: '🍛',
        category: 'Bowls',
      },
      {
        id: 'h4',
        name: 'Rajbhog Rasgulla Box (4 Pcs)',
        price: 140,
        diet: 'VEG',
        desc: 'Kesar infused soft spongy cottage cheese balls soaked in chilled saffron syrup.',
        prepTime: '5 min',
        rating: 4.9,
        imageEmoji: '🍬',
        category: 'Desserts',
      },
      {
        id: 'h5',
        name: 'Puri Sabzi Deluxe Breakfast',
        price: 130,
        diet: 'VEG',
        desc: '4 golden crisp puris with hing aloo rassa, methi chutney and suji halwa.',
        prepTime: '10 min',
        rating: 4.6,
        imageEmoji: '🥟',
        category: 'Combos',
      },
      {
        id: 'h6',
        name: 'Kesar Badam Milk (Cold 300ml)',
        price: 90,
        diet: 'VEG',
        desc: 'Rich chilled creamy milk loaded with crushed almonds, pistachios and saffron threads.',
        prepTime: '2 min',
        rating: 4.8,
        imageEmoji: '🥛',
        category: 'Beverages',
      },
    ],
  },
  {
    id: 'rest-2',
    name: 'Paradise Biryani Express',
    tagline: 'Legendary Nizami Dum Biryani since 1953',
    station: 'Secunderabad (SC) & Hyderabad (HYB)',
    stationCode: 'HYB',
    rating: 4.9,
    reviewsCount: 5120,
    badge: 'Hyderabadi Iconic',
    cuisine: 'Biryani • Mughlai • Kebabs',
    deliveryTime: '25 mins',
    minOrder: 200,
    fssaiNumber: '13618011000342',
    menu: [
      {
        id: 'p1',
        name: 'Special Chicken Dum Biryani Box',
        price: 299,
        diet: 'NONVEG',
        desc: 'Long grain authentic dehraduni basmati cooked with tender chicken pieces, aromatic secret potli spices, served with Mirchi ka Salan & Dahi Raitha.',
        prepTime: '20 min',
        rating: 4.9,
        imageEmoji: '🍗',
        category: 'Biryani',
      },
      {
        id: 'p2',
        name: 'Royal Mutton Dum Biryani',
        price: 380,
        diet: 'NONVEG',
        desc: 'Succulent lamb slow-cooked on dum in sealed handi, rich saffron rice with boiled egg & gravy.',
        prepTime: '20 min',
        rating: 4.9,
        imageEmoji: '🍖',
        category: 'Biryani',
      },
      {
        id: 'p3',
        name: 'Nizami Chicken Tikka Kebab (6 Pcs)',
        price: 240,
        diet: 'NONVEG',
        desc: 'Charcoal grilled marinated chicken chunks in spicy curd and tandoori masala with mint chutney.',
        prepTime: '18 min',
        rating: 4.7,
        imageEmoji: '🍢',
        category: 'Starters',
      },
      {
        id: 'p4',
        name: 'Double Ka Meetha (Hyderabadi Shahi)',
        price: 110,
        diet: 'VEG',
        desc: 'Crisp fried bread slices simmered in condensed cardamom milk and garnished with toasted almonds.',
        prepTime: '5 min',
        rating: 4.8,
        imageEmoji: '🍮',
        category: 'Desserts',
      },
      {
        id: 'p5',
        name: 'Veg Dum Biryani Royal Box',
        price: 220,
        diet: 'VEG',
        desc: 'Fresh farm carrots, beans, baby potatoes, paneer, and fried onions layered in dum basmati rice.',
        prepTime: '15 min',
        rating: 4.6,
        imageEmoji: '🥗',
        category: 'Biryani',
      },
    ],
  },
  {
    id: 'rest-3',
    name: 'Saravana Bhavan South Kitchen',
    tagline: 'Authentic Filter Coffee & Ghee Roast Dosas',
    station: 'MGR Chennai Central (MAS) & Bengaluru (SBC)',
    stationCode: 'MAS',
    rating: 4.8,
    reviewsCount: 2940,
    badge: 'Pure Veg Excellence',
    cuisine: 'South Indian • Tiffin • Filter Coffee',
    deliveryTime: '15 mins',
    minOrder: 120,
    fssaiNumber: '12415002000511',
    menu: [
      {
        id: 's1',
        name: 'Special Ghee Masala Dosa',
        price: 140,
        diet: 'VEG',
        desc: 'Crispy golden crepe roasted in pure cow ghee, potato masala stuffing, 3 fresh chutneys & hot drumstick sambar.',
        prepTime: '10 min',
        rating: 4.9,
        imageEmoji: '🥞',
        category: 'Tiffins',
      },
      {
        id: 's2',
        name: 'Mini Tiffin Sampler Combo',
        price: 190,
        diet: 'VEG',
        desc: '1 Mini Masala Dosa, 2 Steamed Button Idlis, 1 Medu Vada, Rava Kesari sweet & Kumbakonam degree coffee.',
        prepTime: '12 min',
        rating: 4.8,
        imageEmoji: '🍱',
        category: 'Combos',
      },
      {
        id: 's3',
        name: 'South Indian Filter Degree Coffee (Flask 2 Cups)',
        price: 90,
        diet: 'VEG',
        desc: 'Freshly brewed chicory blend decoction with frothy hot cows milk served in sealed thermal travel flask.',
        prepTime: '5 min',
        rating: 4.9,
        imageEmoji: '☕',
        category: 'Beverages',
      },
      {
        id: 's4',
        name: 'Curd Rice with Pomegranate & Tadka',
        price: 110,
        diet: 'VEG',
        desc: 'Cooling probiotic set curd rice with mustard, ginger, green chillies, curry leaves and sweet pomegranate pearls.',
        prepTime: '5 min',
        rating: 4.7,
        imageEmoji: '🍚',
        category: 'Meals',
      },
      {
        id: 's5',
        name: 'Medu Vada Crispy Pair (2 Pcs)',
        price: 90,
        diet: 'VEG',
        desc: 'Crispy on outside, fluffy inside lentil doughnuts served with warm aromatic sambar.',
        prepTime: '8 min',
        rating: 4.6,
        imageEmoji: '🍩',
        category: 'Tiffins',
      },
    ],
  },
  {
    id: 'rest-4',
    name: "Domino's Rail Express Pizza",
    tagline: 'Hot Pizzas Delivered Direct to Train Window',
    station: 'All Major Corridor Junctions',
    stationCode: 'BZA',
    rating: 4.7,
    reviewsCount: 4200,
    badge: 'Guaranteed On Time',
    cuisine: 'Italian • Pizza • Garlic Bread',
    deliveryTime: '20 mins',
    minOrder: 199,
    fssaiNumber: '10017011004289',
    menu: [
      {
        id: 'd1',
        name: 'Farmhouse Regular Pizza (Fresh Pan)',
        price: 249,
        diet: 'VEG',
        desc: 'Delightful combo of onion, crisp capsicum, grilled mushroom & fresh tomato with 100% mozzarella cheese.',
        prepTime: '15 min',
        rating: 4.8,
        imageEmoji: '🍕',
        category: 'Pizzas',
      },
      {
        id: 'd2',
        name: 'Chicken Dominator Pizza',
        price: 369,
        diet: 'NONVEG',
        desc: 'Loaded with double pepper barbecue chicken, peri-peri chicken, grilled chicken rashers and extra cheese.',
        prepTime: '15 min',
        rating: 4.9,
        imageEmoji: '🍕',
        category: 'Pizzas',
      },
      {
        id: 'd3',
        name: 'Stuffed Garlic Breadsticks',
        price: 159,
        diet: 'VEG',
        desc: 'Freshly baked bread with cheese, sweet corn and tangy jalapenos with cheesy dip.',
        prepTime: '12 min',
        rating: 4.7,
        imageEmoji: '🥖',
        category: 'Sides',
      },
      {
        id: 'd4',
        name: 'Choco Lava Cake',
        price: 109,
        diet: 'VEG',
        desc: 'Warm chocolate cake with gooey melted dark chocolate flowing from the center.',
        prepTime: '5 min',
        rating: 4.9,
        imageEmoji: '🍫',
        category: 'Desserts',
      },
    ],
  },
  {
    id: 'rest-5',
    name: 'Bikanervala Satvik Bhawan',
    tagline: '100% Pure Jain Food Prepared with Vedic Purity',
    station: 'Visakhapatnam (VSKP), Vijayawada (BZA)',
    stationCode: 'VSKP',
    rating: 4.8,
    reviewsCount: 1820,
    badge: '100% Jain Satvik',
    cuisine: 'Jain Satvik • Sweets • Chaat',
    deliveryTime: '20 mins',
    minOrder: 150,
    fssaiNumber: '10012011000673',
    menu: [
      {
        id: 'b1',
        name: 'Shuddha Jain Satvik Thali',
        price: 240,
        diet: 'JAIN',
        desc: 'Cooked without onion, garlic or root vegetables. Shahi paneer, Dal tadka, Gatte ki sabzi, Phulkas, Basmati rice & Kheer.',
        prepTime: '15 min',
        rating: 4.9,
        imageEmoji: '🍱',
        category: 'Thalis',
      },
      {
        id: 'b2',
        name: 'Dal Baati Churma Rajasthani Thali',
        price: 220,
        diet: 'JAIN',
        desc: 'Baked wheat baatis dunked in desi ghee with pancharatna dal and sweet cardamom churma.',
        prepTime: '15 min',
        rating: 4.8,
        imageEmoji: '🍲',
        category: 'Combos',
      },
      {
        id: 'b3',
        name: 'Kesar Peda Box (250g)',
        price: 180,
        diet: 'JAIN',
        desc: 'Traditional condensed milk pedas garnished with pure pistachios and saffron.',
        prepTime: '5 min',
        rating: 4.9,
        imageEmoji: '🥮',
        category: 'Sweets',
      },
    ],
  },
];

export const TravelServicesPage: React.FC = () => {
  const { showToast, bookings } = useApp();

  // Active top-level service tab
  const [selectedServiceTab, setSelectedServiceTab] = useState<'food' | 'rooms' | 'cabs' | 'parking' | 'porter'>('food');

  // =========================================================================
  // 1. FOOD (IRCTC e-Catering) STATES
  // =========================================================================
  const [foodCuisineFilter, setFoodCuisineFilter] = useState<'ALL' | 'VEG' | 'NONVEG' | 'JAIN'>('ALL');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>(RESTAURANTS_DATA[0]);
  const [cart, setCart] = useState<Array<{ item: MenuItem; quantity: number; restName: string }>>([
    { item: RESTAURANTS_DATA[0].menu[0], quantity: 1, restName: RESTAURANTS_DATA[0].name },
  ]);
  const [foodCoach, setFoodCoach] = useState('Coach A1');
  const [foodBerth, setFoodBerth] = useState('02');
  const [foodPnr, setFoodPnr] = useState(bookings[0]?.pnr || '4827163950');
  const [foodPhone, setFoodPhone] = useState('+91 98765 43210');
  const [deliveryStation, setDeliveryStation] = useState('NDLS - New Delhi');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [foodPaymentMode, setFoodPaymentMode] = useState<'COD' | 'UPI' | 'WALLET'>('UPI');
  const [activeFoodOrders, setActiveFoodOrders] = useState<
    Array<{
      orderId: string;
      restaurant: string;
      itemsSummary: string;
      total: number;
      coachBerth: string;
      station: string;
      status: 'PREPARING' | 'DISPATCHED' | 'DELIVERED';
      eta: string;
      deliveryOtp: string;
    }>
  >([
    {
      orderId: 'ME-FOOD-8491',
      restaurant: "Haldiram's Express",
      itemsSummary: '1x Maharaja Thali, 1x Kesar Badam Milk',
      total: 350,
      coachBerth: 'Coach A1, Berth 02',
      station: 'NDLS (Platform 4)',
      status: 'PREPARING',
      eta: 'In 18 mins at station stop',
      deliveryOtp: '4819',
    },
  ]);

  // Cart operations
  const handleAddToCart = (item: MenuItem, restName: string) => {
    setCart(prev => {
      const existing = prev.find(p => p.item.id === item.id);
      if (existing) {
        return prev.map(p => (p.item.id === item.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, { item, quantity: 1, restName }];
    });
    showToast(`Added ${item.name} to food order!`);
  };

  const handleUpdateCartQty = (itemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(p => {
          if (p.item.id === itemId) {
            const newQty = p.quantity + delta;
            return newQty > 0 ? { ...p, quantity: newQty } : null;
          }
          return p;
        })
        .filter(Boolean) as any
    );
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  }, [cart]);

  const cartGst = Math.round(cartSubtotal * 0.05);
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + cartGst : 0;

  const handlePlaceFoodOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Your food cart is empty! Add items from a restaurant.');
      return;
    }
    const orderId = `ME-FOOD-${Math.floor(1000 + Math.random() * 9000)}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const itemsSummary = cart.map(c => `${c.quantity}x ${c.item.name}`).join(', ');

    const newOrder = {
      orderId,
      restaurant: cart[0].restName,
      itemsSummary,
      total: cartTotal,
      coachBerth: `${foodCoach}, Berth ${foodBerth}`,
      station: deliveryStation,
      status: 'PREPARING' as const,
      eta: 'In 20 mins when train arrives',
      deliveryOtp: otp,
    };

    setActiveFoodOrders(prev => [newOrder, ...prev]);
    setCart([]);
    showToast(`Order Confirmed! ${orderId} will be delivered to ${foodCoach} Berth ${foodBerth}. OTP: ${otp}`);
  };

  // =========================================================================
  // 2. ROOMS (Retiring Rooms & Pods) STATES
  // =========================================================================
  const [roomStation, setRoomStation] = useState('NDLS');
  const [roomDuration, setRoomDuration] = useState<'6h' | '12h' | '24h' | '48h'>('12h');
  const [selectedRoomType, setSelectedRoomType] = useState('AC Sleeping Pod');
  const [guestName, setGuestName] = useState('Snehith Varma');
  const [guestPhone, setGuestPhone] = useState('+91 98765 43210');
  const [guestAadhaar, setGuestAadhaar] = useState('XXXX-XXXX-4819');
  const [activeRoomBookings, setActiveRoomBookings] = useState<
    Array<{
      voucherId: string;
      roomType: string;
      roomNumber: string;
      station: string;
      duration: string;
      checkInCode: string;
      guest: string;
      price: number;
    }>
  >([
    {
      voucherId: 'IRCTC-POD-9281',
      roomType: 'AC Sleeping Pod',
      roomNumber: 'Pod #C-14 (Upper Tier)',
      station: 'NDLS - New Delhi (PF 1 Upper Concourse)',
      duration: '12 Hours Slot',
      checkInCode: 'PIN 4209',
      guest: 'Snehith Varma',
      price: 650,
    },
  ]);

  const handleBookRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const voucherId = `IRCTC-RM-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomRoomNo =
      selectedRoomType === 'AC Sleeping Pod'
        ? `Pod #P-${Math.floor(10 + Math.random() * 80)}`
        : `Suite #${Math.floor(101 + Math.random() * 80)}`;
    const pin = `PIN ${Math.floor(1000 + Math.random() * 9000)}`;
    const fare = roomDuration === '6h' ? 450 : roomDuration === '12h' ? 750 : roomDuration === '24h' ? 1200 : 2100;

    const newBooking = {
      voucherId,
      roomType: selectedRoomType,
      roomNumber: randomRoomNo,
      station: `${roomStation} Station Concourse`,
      duration: `${roomDuration.toUpperCase()} Stay`,
      checkInCode: pin,
      guest: guestName,
      price: fare,
    };

    setActiveRoomBookings(prev => [newBooking, ...prev]);
    showToast(`Room booked! ${voucherId} allocated ${randomRoomNo}. ${pin}`);
  };

  // =========================================================================
  // 3. CABS (Station Cabs & Airport Shuttles) STATES
  // =========================================================================
  const [cabStationGate, setCabStationGate] = useState('Gate 1 Main Porch Zone A');
  const [cabDropAddress, setCabDropAddress] = useState('Visakhapatnam Airport / Beach Road');
  const [selectedCabType, setSelectedCabType] = useState<'Hatchback' | 'Sedan' | 'SUV' | 'EV' | 'Auto'>('Sedan');
  const [cabRiderName, setCabRiderName] = useState('Snehith Varma');
  const [cabRiderPhone, setCabRiderPhone] = useState('+91 98765 43210');
  const [activeCabRides, setActiveCabRides] = useState<
    Array<{
      rideId: string;
      cabType: string;
      carModel: string;
      plateNumber: string;
      driverName: string;
      driverRating: number;
      otp: string;
      fare: number;
      pickupGate: string;
      dropLocation: string;
      status: 'ARRIVING' | 'AT_GATE' | 'COMPLETED';
    }>
  >([
    {
      rideId: 'CAB-9102',
      cabType: 'Executive Sedan',
      carModel: 'Maruti Suzuki Dzire (White)',
      plateNumber: 'AP 39 TE 4096',
      driverName: 'Rajesh Kumar',
      driverRating: 4.9,
      otp: '6194',
      fare: 350,
      pickupGate: 'Gate 1 Zone A Bay 4',
      dropLocation: 'Airport Terminal 2',
      status: 'ARRIVING',
    },
  ]);

  const handleBookCab = (e: React.FormEvent) => {
    e.preventDefault();
    const rideId = `CAB-${Math.floor(1000 + Math.random() * 9000)}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const carDetails =
      selectedCabType === 'Hatchback'
        ? { model: 'WagonR CNG', plate: 'DL 1R 8421', fare: 249 }
        : selectedCabType === 'Sedan'
        ? { model: 'Swift Dzire Prime', plate: 'DL 1R 7291', fare: 380 }
        : selectedCabType === 'SUV'
        ? { model: 'Innova Crysta 7-Seater', plate: 'DL 1R 3302', fare: 590 }
        : selectedCabType === 'EV'
        ? { model: 'Tata Nexon Electric EV', plate: 'DL 1R 9011', fare: 320 }
        : { model: 'Prepaid Digital Auto', plate: 'DL 1R 4410', fare: 89 };

    const newRide = {
      rideId,
      cabType: selectedCabType,
      carModel: carDetails.model,
      plateNumber: carDetails.plate,
      driverName: 'Mahesh Sharma',
      driverRating: 4.9,
      otp,
      fare: carDetails.fare,
      pickupGate: cabStationGate,
      dropLocation: cabDropAddress,
      status: 'ARRIVING' as const,
    };

    setActiveCabRides(prev => [newRide, ...prev]);
    showToast(`Cab Booked! Driver Mahesh (${carDetails.model} ${carDetails.plate}) arriving at ${cabStationGate}. OTP: ${otp}`);
  };

  // =========================================================================
  // 4. PARKING (Station Smart FASTag Parking) STATES
  // =========================================================================
  const [parkingStation, setParkingStation] = useState('NDLS - New Delhi');
  const [parkingVehicleType, setParkingVehicleType] = useState<'2W' | '4W' | 'SUV'>('4W');
  const [parkingDurationDays, setParkingDurationDays] = useState(2);
  const [parkingVehicleReg, setParkingVehicleReg] = useState('AP 39 TE 4096');
  const [parkingOwnerName, setParkingOwnerName] = useState('Snehith Varma');
  const [activeParkingPasses, setActiveParkingPasses] = useState<
    Array<{
      passId: string;
      vehicleReg: string;
      vehicleType: string;
      bayNumber: string;
      lotName: string;
      days: number;
      totalFare: number;
      fastagStatus: string;
      validUntil: string;
    }>
  >([
    {
      passId: 'PARK-7419',
      vehicleReg: 'AP 39 TE 4096',
      vehicleType: '4-Wheeler Car',
      bayNumber: 'Slot P2-Bay 48 (Covered)',
      lotName: 'Gate 2 Multi-Level Undercover',
      days: 3,
      totalFare: 360,
      fastagStatus: 'Auto-Debit Enabled',
      validUntil: '02 Oct 2026, 23:59',
    },
  ]);

  const handleBookParking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parkingVehicleReg.trim()) {
      showToast('Please enter your vehicle registration number');
      return;
    }
    const passId = `PARK-${Math.floor(1000 + Math.random() * 9000)}`;
    const dailyRate = parkingVehicleType === '2W' ? 40 : parkingVehicleType === '4W' ? 120 : 180;
    const totalFare = dailyRate * parkingDurationDays;
    const randomBay = `Slot P${Math.floor(1 + Math.random() * 3)}-Bay ${Math.floor(10 + Math.random() * 80)}`;

    const newPass = {
      passId,
      vehicleReg: parkingVehicleReg.toUpperCase(),
      vehicleType: parkingVehicleType === '2W' ? 'Two-Wheeler' : parkingVehicleType === '4W' ? '4-Wheeler Car' : 'SUV/Commercial',
      bayNumber: randomBay,
      lotName: `${parkingStation} - Gate 2 FASTag Bay`,
      days: parkingDurationDays,
      totalFare,
      fastagStatus: 'FASTag QR Authorized',
      validUntil: `+${parkingDurationDays} Days from Entry`,
    };

    setActiveParkingPasses(prev => [newPass, ...prev]);
    showToast(`Parking pass generated! ${passId} assigned to ${randomBay}.`);
  };

  // Filtered restaurants
  const filteredRestaurants = useMemo(() => {
    if (foodCuisineFilter === 'ALL') return RESTAURANTS_DATA;
    if (foodCuisineFilter === 'VEG') {
      return RESTAURANTS_DATA.filter(r => r.menu.some(m => m.diet === 'VEG'));
    }
    if (foodCuisineFilter === 'NONVEG') {
      return RESTAURANTS_DATA.filter(r => r.menu.some(m => m.diet === 'NONVEG'));
    }
    return RESTAURANTS_DATA.filter(r => r.menu.some(m => m.diet === 'JAIN'));
  }, [foodCuisineFilter]);

  return (
    <div className="w-full min-h-[calc(100vh-14rem)] py-4 space-y-6">
      {/* Top Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#7bd0ff] font-bold">
              IRCTC Transit Concierge • Guaranteed Zero Surge
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Travel &amp; Station Hospitality Services
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Order hot gourmet meals straight to your train berth, book station retiring pods, reserve guaranteed prepaid cabs, and park multi-day with FASTag
          </p>
        </div>

        {/* Global Quick Info */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-right">
            <span className="text-slate-400 text-[10px] block uppercase">Active Traveler</span>
            <span className="text-white font-bold">{bookings[0]?.trainNumber ? `Train #${bookings[0].trainNumber}` : 'Corridor Passenger'}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-bold">
            24x7 Rail Helpline: 139
          </div>
        </div>
      </div>

      {/* Main Service Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold font-mono">
        {[
          { id: 'food', label: '1. Food (IRCTC e-Catering)', icon: Utensils, badge: `${cart.length} in Cart` },
          { id: 'rooms', label: '2. Retiring Rooms & Pods', icon: Hotel, badge: `${activeRoomBookings.length} Active` },
          { id: 'cabs', label: '3. Station Prepaid Cabs', icon: Car, badge: `${activeCabRides.length} Active` },
          { id: 'parking', label: '4. Multi-Day Parking', icon: CarFront, badge: `${activeParkingPasses.length} Active` },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = selectedServiceTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedServiceTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-500/50'
                  : 'glass-panel-subtle border-white/10 text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-400'}`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. FOOD & E-CATERING SECTION                                              */}
      {/* ========================================================================= */}
      {selectedServiceTab === 'food' && (
        <div className="space-y-6">
          {/* Active Orders Banner */}
          {activeFoodOrders.length > 0 && (
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Live In-Transit Food Deliveries ({activeFoodOrders.length})
                </span>
                <span className="text-[11px] text-slate-400">Delivered directly to passenger coach &amp; seat</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeFoodOrders.map(order => (
                  <div key={order.orderId} className="p-3.5 rounded-xl bg-black/60 border border-white/10 flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{order.orderId}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {order.status}
                        </span>
                      </div>
                      <div className="font-bold text-[#7bd0ff] text-sm mt-0.5">{order.restaurant}</div>
                      <div className="text-slate-300 text-[11px] mt-0.5 truncate max-w-xs">{order.itemsSummary}</div>
                      <div className="text-slate-400 text-[10px] font-mono mt-1">
                        To: {order.coachBerth} • At {order.station}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-emerald-400 font-bold text-sm">₹{order.total}</div>
                      <div className="text-[10px] font-mono text-amber-400 font-bold mt-1">
                        Delivery OTP: {order.deliveryOtp}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{order.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Restaurant Selector & Menu Explorer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 4 Cols: Top-Rated Restaurants List */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Select Best Restaurant
                </h3>
                {/* Diet filter chips */}
                <div className="flex gap-1 text-[10px] font-mono">
                  {(['ALL', 'VEG', 'NONVEG', 'JAIN'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFoodCuisineFilter(f)}
                      className={`px-2 py-0.5 rounded ${foodCuisineFilter === f ? 'bg-blue-600 text-white font-bold' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
                {filteredRestaurants.map(rest => {
                  const isSelected = selectedRestaurant.id === rest.id;
                  return (
                    <div
                      key={rest.id}
                      onClick={() => setSelectedRestaurant(rest)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'glass-panel border-blue-400 shadow-xl ring-1 ring-blue-500/40 bg-blue-950/40'
                          : 'glass-panel-subtle border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-bold text-sm text-white">{rest.name}</span>
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" /> {rest.rating}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">{rest.tagline}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] font-mono text-slate-400">
                        <span>{rest.cuisine}</span>
                        <span className="text-emerald-400 font-bold">{rest.deliveryTime}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Middle 5 Cols: Selected Restaurant Menu Items */}
            <div className="lg:col-span-5 space-y-4">
              <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#7bd0ff] uppercase">{selectedRestaurant.badge}</span>
                  <h3 className="text-base font-bold text-white">{selectedRestaurant.name} Menu</h3>
                  <span className="text-[11px] text-slate-400 block">FSSAI Lic: {selectedRestaurant.fssaiNumber}</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  Min: ₹{selectedRestaurant.minOrder}
                </span>
              </div>

              {/* Menu Items List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {selectedRestaurant.menu.map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl glass-panel-subtle border border-white/10 hover:border-blue-400/40 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.imageEmoji}</span>
                        <span className="font-bold text-sm text-white">{item.name}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            item.diet === 'VEG'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : item.diet === 'JAIN'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {item.diet}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{item.desc}</p>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-1">
                        <span>⏱ Prep: {item.prepTime}</span>
                        <span>★ {item.rating}</span>
                        <span>Category: {item.category}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="font-mono font-black text-sm text-emerald-400">₹{item.price}</span>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item, selectedRestaurant.name)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 shadow-md transition-transform active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 3 Cols: Cart & Seat Delivery Details */}
            <div className="lg:col-span-3 space-y-4">
              <form onSubmit={handlePlaceFoodOrder} className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/15 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-emerald-400" />
                    Seat Delivery Cart
                  </h3>
                  <span className="text-xs font-mono text-slate-400">{cart.length} Items</span>
                </div>

                {/* Cart Items */}
                {cart.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 font-mono">
                    Cart is empty. Click "+ Add" on any meal item to begin.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {cart.map(c => (
                      <div key={c.item.id} className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                        <div className="truncate mr-2">
                          <div className="font-bold text-white truncate">{c.item.name}</div>
                          <div className="text-[10px] text-slate-400">₹{c.item.price} x {c.quantity}</div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(c.item.id, -1)}
                            className="w-5 h-5 rounded bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                          >
                            -
                          </button>
                          <span className="font-bold text-white">{c.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(c.item.id, 1)}
                            className="w-5 h-5 rounded bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Delivery Location inputs */}
                <div className="space-y-2 text-xs pt-1 border-t border-white/10 font-mono">
                  <span className="text-[10px] uppercase font-bold text-[#7bd0ff] block">Berth Delivery Details</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400">Coach *</label>
                      <input
                        type="text"
                        required
                        value={foodCoach}
                        onChange={e => setFoodCoach(e.target.value)}
                        placeholder="Coach A1"
                        className="glass-input p-2 rounded-lg text-xs w-full font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Berth # *</label>
                      <input
                        type="text"
                        required
                        value={foodBerth}
                        onChange={e => setFoodBerth(e.target.value)}
                        placeholder="02"
                        className="glass-input p-2 rounded-lg text-xs w-full font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400">Delivery Station Stop</label>
                    <select
                      value={deliveryStation}
                      onChange={e => setDeliveryStation(e.target.value)}
                      className="glass-input p-2 rounded-lg text-xs w-full font-bold"
                    >
                      <option value="NDLS - New Delhi (Platform 4)">NDLS - New Delhi (PF 4)</option>
                      <option value="VSKP - Visakhapatnam (PF 1)">VSKP - Visakhapatnam (PF 1)</option>
                      <option value="BZA - Vijayawada (PF 6)">BZA - Vijayawada (PF 6)</option>
                      <option value="HYB - Hyderabad Deccan (PF 2)">HYB - Hyderabad Deccan (PF 2)</option>
                      <option value="MAS - Chennai Central (PF 3)">MAS - Chennai Central (PF 3)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400">Customer Mobile (for Delivery SMS)</label>
                    <input
                      type="text"
                      required
                      value={foodPhone}
                      onChange={e => setFoodPhone(e.target.value)}
                      className="glass-input p-2 rounded-lg text-xs w-full font-bold"
                    />
                  </div>
                </div>

                {/* Cart Total Breakdown */}
                {cart.length > 0 && (
                  <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-mono space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Subtotal:</span>
                      <span>₹{cartSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>GST (5%):</span>
                      <span>₹{cartGst}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Train Berth Delivery:</span>
                      <span className="text-emerald-400 font-bold">FREE ₹0</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-1.5">
                      <span>Total Amount:</span>
                      <span className="text-emerald-400">₹{cartTotal}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={cart.length === 0}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95 disabled:opacity-50"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Order to Seat (₹{cartTotal})</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ROOMS & SLEEPING PODS SECTION                                          */}
      {/* ========================================================================= */}
      {selectedServiceTab === 'rooms' && (
        <div className="space-y-6">
          {/* Active Room Bookings */}
          {activeRoomBookings.length > 0 && (
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-blue-400/30 bg-blue-500/5 space-y-3">
              <span className="text-xs font-mono font-bold text-[#7bd0ff] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Active Station Pod &amp; Room Reservations ({activeRoomBookings.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeRoomBookings.map(b => (
                  <div key={b.voucherId} className="p-4 rounded-xl bg-black/60 border border-white/10 flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">{b.voucherId}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Confirmed
                        </span>
                      </div>
                      <div className="font-bold text-[#ffb95f] text-sm mt-1">{b.roomNumber}</div>
                      <div className="text-slate-300 text-[11px] mt-0.5">{b.station} • {b.duration}</div>
                      <div className="text-emerald-400 text-xs font-mono font-bold mt-1.5 flex items-center gap-1">
                        <Key className="w-3.5 h-3.5" /> Access: {b.checkInCode}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-white">₹{b.price}</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Guest: {b.guest}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Book Room Form & Types */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Cols: Available Pod & Room Categories */}
            <div className="lg:col-span-7 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-1 border-b border-white/10">
                <Hotel className="w-4 h-4 text-blue-400" />
                Select Station Pod / Retiring Suite Type
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    name: 'AC Sleeping Pod',
                    fare6: 450,
                    fare12: 650,
                    fare24: 950,
                    desc: 'Private capsule with USB chargers, reading lamps, personal air conditioning, and luxury shower access.',
                    badge: 'Popular for Transit',
                    amenities: 'Wi-Fi • AC • Shower • USB-C',
                  },
                  {
                    name: 'Deluxe Executive AC Room',
                    fare6: 750,
                    fare12: 1200,
                    fare24: 1800,
                    desc: 'King size bed, attached private bath, smart TV, hot water geyser, work desk, and 24h room service.',
                    badge: 'Private Bathroom',
                    amenities: 'King Bed • Attached Bath • TV',
                  },
                  {
                    name: 'AC Dormitory Bed (Single)',
                    fare6: 220,
                    fare12: 350,
                    fare24: 550,
                    desc: 'Comfortable single bunk with clean linen, personal storage locker with digital lock, and shared washrooms.',
                    badge: 'Budget Friendly',
                    amenities: 'Single Bed • Locker • Wi-Fi',
                  },
                  {
                    name: 'Presidential Family Suite',
                    fare6: 1400,
                    fare12: 2200,
                    fare24: 3400,
                    desc: '2 Queen beds, separate living lounge, mini fridge, complimentary breakfast, and platform porter assistance.',
                    badge: 'VIP Heritage',
                    amenities: '4 Guests • Lounge • Butler',
                  },
                ].map(item => {
                  const isSelected = selectedRoomType === item.name;
                  return (
                    <div
                      key={item.name}
                      onClick={() => setSelectedRoomType(item.name)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'glass-panel border-blue-400 shadow-xl ring-1 ring-blue-500/50 bg-blue-950/40'
                          : 'glass-panel-subtle border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-[#7bd0ff] border border-blue-400/30">
                            {item.badge}
                          </span>
                          <span className="font-mono font-bold text-xs text-emerald-400">From ₹{item.fare6}</span>
                        </div>
                        <h4 className="font-bold text-sm text-white">{item.name}</h4>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{item.amenities}</span>
                        <span className="text-[#ffb95f] font-bold">12h: ₹{item.fare12}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 5 Cols: Reservation Details Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleBookRoom} className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/15 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white">Instant Room Reservation</h3>
                  <span className="text-xs font-mono text-emerald-400 font-bold">Zero Advance Deposit</span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Station Location *</label>
                    <select
                      value={roomStation}
                      onChange={e => setRoomStation(e.target.value)}
                      className="glass-input p-2.5 rounded-xl text-xs w-full font-bold"
                    >
                      <option value="NDLS">New Delhi (NDLS) - Platform 1 Concourse</option>
                      <option value="VSKP">Visakhapatnam (VSKP) - Platform 1 Deck</option>
                      <option value="HYB">Hyderabad Deccan (HYB) - Wing B</option>
                      <option value="BZA">Vijayawada (BZA) - Main Concourse</option>
                      <option value="MAS">Chennai Central (MAS) - Executive Lounge</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Stay Duration Slot *</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: '6h', label: '6 Hours' },
                        { id: '12h', label: '12 Hours' },
                        { id: '24h', label: '24 Hours' },
                        { id: '48h', label: '48 Hours' },
                      ].map(d => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setRoomDuration(d.id as any)}
                          className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                            roomDuration === d.id ? 'bg-blue-600 border-blue-400 text-white' : 'glass-panel-subtle border-white/10 text-slate-300'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Primary Guest Full Name *</label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      className="glass-input p-2.5 rounded-xl text-xs w-full font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Contact Mobile *</label>
                      <input
                        type="text"
                        required
                        value={guestPhone}
                        onChange={e => setGuestPhone(e.target.value)}
                        className="glass-input p-2.5 rounded-xl text-xs w-full font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Govt ID / Aadhaar *</label>
                      <input
                        type="text"
                        required
                        value={guestAadhaar}
                        onChange={e => setGuestAadhaar(e.target.value)}
                        className="glass-input p-2.5 rounded-xl text-xs w-full font-bold"
                      />
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5 pt-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Room Selection:</span>
                      <span className="text-white font-bold">{selectedRoomType}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Station:</span>
                      <span>{roomStation}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Slot:</span>
                      <span>{roomDuration.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-1.5">
                      <span>Total Rent:</span>
                      <span className="text-emerald-400">
                        ₹{roomDuration === '6h' ? 450 : roomDuration === '12h' ? 750 : roomDuration === '24h' ? 1200 : 2100}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-transform active:scale-95"
                >
                  <Key className="w-4 h-4" />
                  <span>Confirm &amp; Generate Room Voucher</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CABS & TRANSIT SECTION                                                 */}
      {/* ========================================================================= */}
      {selectedServiceTab === 'cabs' && (
        <div className="space-y-6">
          {/* Active Cab Bookings Banner */}
          {activeCabRides.length > 0 && (
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Car className="w-4 h-4" /> Active Prepaid Station Cabs Allocated ({activeCabRides.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeCabRides.map(r => (
                  <div key={r.rideId} className="p-4 rounded-xl bg-black/60 border border-white/10 flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{r.rideId}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {r.status}
                        </span>
                      </div>
                      <div className="font-bold text-sm text-[#7bd0ff] mt-0.5">{r.carModel}</div>
                      <div className="text-slate-300 text-[11px] font-mono mt-0.5">
                        Plate: <span className="text-amber-400 font-bold">{r.plateNumber}</span> • Driver: {r.driverName}
                      </div>
                      <div className="text-slate-400 text-[10px] mt-1 font-mono">
                        Pickup: {r.pickupGate} → {r.dropLocation}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-emerald-400 font-bold text-sm">₹{r.fare}</div>
                      <div className="text-xs font-mono font-bold text-[#ffb95f] mt-1">Ride OTP: {r.otp}</div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Arriving in 3 mins</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cabs Selection Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Cols: Cab Categories */}
            <div className="lg:col-span-7 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-1 border-b border-white/10">
                <Car className="w-4 h-4 text-amber-400" />
                Select Cab Category (Regulated Rates • Zero Surge)
              </h3>

              <div className="space-y-2.5">
                {[
                  {
                    type: 'Sedan',
                    name: 'Executive Sedan (Swift Dzire / Etios)',
                    fare: 380,
                    eta: '3 mins away',
                    desc: 'Comfortable air-conditioned sedan with large boot space for 3 big trolley suitcases. Free mineral water.',
                    badge: 'Most Popular',
                  },
                  {
                    type: 'SUV',
                    name: 'Prime SUV (Toyota Innova Crysta / Ertiga)',
                    fare: 590,
                    eta: '5 mins away',
                    desc: 'Spacious 6-7 passenger carrier with captain seats and rooftop luggage carrier for family travels.',
                    badge: 'Family Travel',
                  },
                  {
                    type: 'EV',
                    name: 'Eco Green Electric Cab (Tata Nexon EV)',
                    fare: 320,
                    eta: '4 mins away',
                    desc: 'Zero-emission silent electric ride with dedicated fast terminal corridor lane exit.',
                    badge: 'Green Transit',
                  },
                  {
                    type: 'Hatchback',
                    name: 'Standard Hatchback (Maruti WagonR / Tiago)',
                    fare: 249,
                    eta: '2 mins away',
                    desc: 'Pocket-friendly AC transit for up to 3 passengers with 2 medium bags.',
                    badge: 'Economy',
                  },
                  {
                    type: 'Auto',
                    name: 'Prepaid Digital Meter Auto-Rickshaw',
                    fare: 89,
                    eta: '1 min at Gate',
                    desc: 'Traffic Police regulated meter token with fixed point-to-point tariff and zero bargaining.',
                    badge: 'Instant Gate Token',
                  },
                ].map(cab => {
                  const isSelected = selectedCabType === cab.type;
                  return (
                    <div
                      key={cab.type}
                      onClick={() => setSelectedCabType(cab.type as any)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'glass-panel border-amber-400 shadow-xl ring-1 ring-amber-500/50 bg-amber-950/20'
                          : 'glass-panel-subtle border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{cab.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">
                            {cab.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">{cab.desc}</p>
                        <div className="text-[10px] font-mono text-slate-400 mt-1">Pickup ETA: {cab.eta}</div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-emerald-400 font-mono">₹{cab.fare}</span>
                        <span className="text-[10px] text-slate-400 block">Fixed Rate</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 5 Cols: Pickup & Drop Address Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleBookCab} className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/15 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white">Book Platform Pickup Cab</h3>
                  <span className="text-xs font-mono text-amber-400 font-bold">Police Verified Drivers</span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Pickup Station Gate / Porch *</label>
                    <select
                      value={cabStationGate}
                      onChange={e => setCabStationGate(e.target.value)}
                      className="glass-input p-2.5 rounded-xl text-xs w-full font-bold"
                    >
                      <option value="Gate 1 Main Porch Zone A">Gate 1 Main Porch (Zone A - Pre-paid Bay)</option>
                      <option value="Gate 2 West Concourse Porch">Gate 2 West Concourse (Near Metro Bridge)</option>
                      <option value="Platform 1 Exit Porch">Platform 1 Direct Porch</option>
                      <option value="Gate 3 VIP Entry Arch">Gate 3 VIP Entry Arch</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Destination Address / Landmark *</label>
                    <input
                      type="text"
                      required
                      value={cabDropAddress}
                      onChange={e => setCabDropAddress(e.target.value)}
                      placeholder="e.g. Airport, Beach Road, Hi-Tech City"
                      className="glass-input p-2.5 rounded-xl text-xs w-full font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Rider Name *</label>
                      <input
                        type="text"
                        required
                        value={cabRiderName}
                        onChange={e => setCabRiderName(e.target.value)}
                        className="glass-input p-2.5 rounded-xl text-xs w-full font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Rider Mobile *</label>
                      <input
                        type="text"
                        required
                        value={cabRiderPhone}
                        onChange={e => setCabRiderPhone(e.target.value)}
                        className="glass-input p-2.5 rounded-xl text-xs w-full font-bold"
                      />
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5 pt-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Vehicle Selected:</span>
                      <span className="text-white font-bold">{selectedCabType}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Toll &amp; Parking Surcharge:</span>
                      <span className="text-emerald-400">Included ₹0</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-1.5">
                      <span>Estimated Fare:</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        ₹{selectedCabType === 'Hatchback' ? 249 : selectedCabType === 'Sedan' ? 380 : selectedCabType === 'SUV' ? 590 : selectedCabType === 'EV' ? 320 : 89}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-600/30 transition-transform active:scale-95"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Reserve Cab &amp; Dispatch Driver</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MULTI-DAY PARKING SECTION                                              */}
      {/* ========================================================================= */}
      {selectedServiceTab === 'parking' && (
        <div className="space-y-6">
          {/* Active Parking Passes Banner */}
          {activeParkingPasses.length > 0 && (
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-purple-500/30 bg-purple-500/5 space-y-3">
              <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <CarFront className="w-4 h-4" /> Active Station Multi-Day FASTag Parking Passes ({activeParkingPasses.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeParkingPasses.map(p => (
                  <div key={p.passId} className="p-4 rounded-xl bg-black/60 border border-white/10 flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{p.passId}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {p.fastagStatus}
                        </span>
                      </div>
                      <div className="font-bold text-[#ffb95f] text-sm mt-0.5">{p.bayNumber}</div>
                      <div className="text-slate-300 text-[11px] font-mono mt-0.5">
                        Vehicle: <span className="text-white font-bold">{p.vehicleReg}</span> ({p.vehicleType})
                      </div>
                      <div className="text-slate-400 text-[10px] mt-1 font-mono">
                        Valid for {p.days} Days • {p.validUntil}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-emerald-400 font-bold text-sm font-mono">₹{p.totalFare}</div>
                      <div className="w-12 h-12 bg-white p-1 rounded-lg mt-1 inline-flex items-center justify-center">
                        <QrCode className="w-full h-full text-slate-900" />
                      </div>
                      <span className="text-[10px] text-slate-400 block">Scan at Boom Barrier</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parking Form & Lot Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Cols: Station Parking Infrastructure */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-1 border-b border-white/10">
                <CarFront className="w-4 h-4 text-purple-400" />
                Station Smart FASTag Automated Parking Lots
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#7bd0ff]">Gate 1 Covered Pod</span>
                  <div className="font-bold text-sm text-white">Undercover VIP Bay</div>
                  <p className="text-[11px] text-slate-400">Guarded by RPF with 24/7 CCTV surveillance and roof protection from weather.</p>
                  <span className="text-xs font-mono text-emerald-400 font-bold block pt-1">₹150 / 24 hrs</span>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-400">Gate 2 Long-Stay</span>
                  <div className="font-bold text-sm text-white">Multi-Day Long Stay</div>
                  <p className="text-[11px] text-slate-400">Automated boom barrier entry with FASTag scanner. Ideal for multi-day outstation journeys.</p>
                  <span className="text-xs font-mono text-emerald-400 font-bold block pt-1">₹120 / 24 hrs</span>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">Gate 3 EV Zone</span>
                  <div className="font-bold text-sm text-white">EV Fast Charge Bays</div>
                  <p className="text-[11px] text-slate-400">Equipped with 60kW DC Fast Chargers for electric cars while parked during your travel.</p>
                  <span className="text-xs font-mono text-emerald-400 font-bold block pt-1">₹140 / 24 hrs</span>
                </div>
              </div>

              {/* Safety Badges */}
              <div className="p-4 rounded-xl glass-panel-subtle border border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> RPF Round-the-clock Patrol</span>
                <span className="flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-blue-400" /> FASTag Auto-Exit</span>
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> EV Chargers Available</span>
              </div>
            </div>

            {/* Right 5 Cols: Reservation Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleBookParking} className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/15 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white">Reserve Parking Slot</h3>
                  <span className="text-xs font-mono text-purple-300 font-bold">Digital QR Pass</span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Station Parking Lot *</label>
                    <select
                      value={parkingStation}
                      onChange={e => setParkingStation(e.target.value)}
                      className="glass-input p-2.5 rounded-xl text-xs w-full font-bold"
                    >
                      <option value="NDLS - New Delhi">NDLS - New Delhi (Gate 2 Multi-Level)</option>
                      <option value="VSKP - Visakhapatnam">VSKP - Visakhapatnam (Gate 1 Covered Bay)</option>
                      <option value="HYB - Hyderabad Deccan">HYB - Hyderabad Deccan (Concourse Lot)</option>
                      <option value="BZA - Vijayawada">BZA - Vijayawada (West Entry Lot)</option>
                      <option value="MAS - Chennai Central">MAS - Chennai Central (Suburban Lot)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Vehicle Type *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '2W', label: 'Two-Wheeler', rate: '₹40/day' },
                        { id: '4W', label: 'Car / Sedan', rate: '₹120/day' },
                        { id: 'SUV', label: 'SUV / Van', rate: '₹180/day' },
                      ].map(v => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setParkingVehicleType(v.id as any)}
                          className={`p-2 rounded-xl text-center border transition-all ${
                            parkingVehicleType === v.id ? 'bg-purple-600 border-purple-400 text-white' : 'glass-panel-subtle border-white/10 text-slate-300'
                          }`}
                        >
                          <div className="font-bold">{v.label}</div>
                          <div className="text-[10px] text-emerald-400">{v.rate}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Duration of Parking *</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 5, 7, 14].map(days => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setParkingDurationDays(days)}
                          className={`flex-1 py-1.5 rounded-lg font-bold border transition-colors ${
                            parkingDurationDays === days ? 'bg-blue-600 border-blue-400 text-white' : 'glass-panel-subtle border-white/10 text-slate-400'
                          }`}
                        >
                          {days}d
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Vehicle Registration Number *</label>
                    <input
                      type="text"
                      required
                      value={parkingVehicleReg}
                      onChange={e => setParkingVehicleReg(e.target.value)}
                      placeholder="e.g. AP 39 TE 4096 or DL 01 AB 1234"
                      className="glass-input p-2.5 rounded-xl text-xs w-full font-bold uppercase tracking-wider font-mono"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5 pt-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Vehicle:</span>
                      <span className="text-white font-bold">{parkingVehicleType === '2W' ? 'Two-Wheeler' : parkingVehicleType === '4W' ? 'Car / Sedan' : 'SUV'}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Duration:</span>
                      <span>{parkingDurationDays} Days</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-1.5">
                      <span>Total Parking Fee:</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        ₹{(parkingVehicleType === '2W' ? 40 : parkingVehicleType === '4W' ? 120 : 180) * parkingDurationDays}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/30 transition-transform active:scale-95"
                >
                  <CarFront className="w-4 h-4" />
                  <span>Reserve Bay &amp; Get FASTag QR Pass</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
