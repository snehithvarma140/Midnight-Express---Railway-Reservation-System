export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  memberSince: string;
  aadhaarStatus: 'VERIFIED' | 'PENDING' | 'NOT_VERIFIED';
}

export interface Station {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  platforms: number;
  zone: string;
  division: string;
  category: string;
  elevation: string;
  dailyFootfall: string;
  isEcoSmart?: boolean;
}

export type TrainClassType = '1A' | '2A' | '3A' | '3E' | 'SL' | 'EC' | 'CC' | '2S';

export interface ClassAvailability {
  classType: TrainClassType;
  className: string;
  fare: number;
  availableSeats: number;
  status: 'AVAILABLE' | 'RAC' | 'WAITLIST';
  tatkalAvailable?: number;
  racNumber?: number;
  waitlistNumber?: number;
  confirmationProbability?: 'High' | 'Medium' | 'Low';
  description?: string;
}

export interface RouteStop {
  stationCode: string;
  stationName: string;
  sequence: number;
  arrivalTime: string;
  departureTime: string;
  haltMinutes: number;
  distanceKm: number;
  platform: string;
  dayCount: number;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  type: 'Superfast' | 'Vande Bharat' | 'Rajdhani' | 'Express' | 'Mail' | 'Shatabdi' | 'Duronto' | 'Tejas';
  sourceStation: string;
  sourceCode: string;
  destStation: string;
  destCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distanceKm: number;
  runningDays: string[]; // ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  speedKmh?: number;
  classes: ClassAvailability[];
  route: RouteStop[];
  pantryAvailable: boolean;
  wifiOnboard: boolean;
  coachesConfig: string; // e.g. "16 Coach Trainset • Bio-vacuum"
}

export interface Passenger {
  id: string;
  fullName: string;
  age: number;
  gender: 'M' | 'F' | 'TG';
  berthPreference: 'LB' | 'MB' | 'UB' | 'SL' | 'SU' | 'NONE';
  foodOption: 'VEG' | 'NONVEG' | 'JAIN' | 'NONE';
  nationality: string;
  isSeniorCitizen?: boolean;
  assignedCoach?: string;
  assignedBerth?: string;
  assignedBerthType?: string;
  status: 'CONFIRMED' | 'RAC' | 'WAITLIST' | 'CANCELLED';
  aadhaarVerified?: boolean;
}

export interface Infant {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'TG';
  accompaniedBy: string;
}

export interface Booking {
  id: string;
  pnr: string;
  userId: string;
  userEmail: string;
  userName: string;
  trainNumber: string;
  trainName: string;
  trainType: string;
  fromStation: string;
  fromCode: string;
  toStation: string;
  toCode: string;
  boardingStation: string;
  boardingCode: string;
  departureTime: string;
  arrivalTime: string;
  journeyDate: string;
  classType: TrainClassType;
  quota: 'General' | 'Tatkal' | 'Ladies' | 'Sr. Citizen' | 'Divyangjan' | 'Premium Tatkal';
  passengers: Passenger[];
  infants?: Infant[];
  contactMobile: string;
  contactEmail: string;
  emergencyContact?: string;
  baseFare: number;
  reservationSurcharge: number;
  superfastLevy: number;
  gstAmount: number;
  cateringCharge: number;
  insuranceCharge: number;
  gatewayFee: number;
  totalFare: number;
  paymentMethod: string;
  transactionId: string;
  paymentStatus: 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED';
  bookingStatus: 'CONFIRMED' | 'RAC' | 'WAITLIST' | 'CANCELLED' | 'COMPLETED';
  bookedAt: string;
  platform: string;
  qrToken: string;
  cancellationDetails?: {
    cancelledAt: string;
    cancellationCharge: number;
    refundAmount: number;
    refundTransactionId: string;
    cancelledPassengersCount: number;
  };
  options?: {
    autoUpgradation?: boolean;
    vikalpOpted?: boolean;
    sameCoachOnly?: boolean;
    lowerBerthOnly?: boolean;
    preferredCoach?: string;
    gstin?: string;
    companyName?: string;
  };
}

export interface SavedPassenger {
  id: string;
  fullName: string;
  age: number;
  gender: 'M' | 'F' | 'TG';
  berthPreference: 'LB' | 'MB' | 'UB' | 'SL' | 'SU' | 'NONE';
  foodOption: 'VEG' | 'NONVEG' | 'JAIN' | 'NONE';
  nationality: string;
  aadhaarVerified: boolean;
}

export interface StationFacility {
  id: string;
  name: string;
  category: 'restrooms' | 'lounges' | 'food' | 'parking' | 'accessibility' | 'counters' | 'retail' | 'connectivity';
  location: string;
  description: string;
  badge: string;
  status: '24/7 Monitored' | 'Open' | 'FSSAI Certified' | 'FASTag Ready' | 'Free' | 'High Speed';
  icon: string;
}

export interface FoodOutlet {
  id: string;
  name: string;
  location?: string;
  platform?: string;
  rating: number;
  reviewsCount?: number;
  description?: string;
  tags?: string[];
  openHours?: string;
  openingHours?: string;
  cuisine?: string;
  fssaiLicense?: string;
  specialty?: string;
}

export interface NearbyPoint {
  id: string;
  name: string;
  distance: string;
  driveTime: string;
  type: string;
  rating?: number;
  description: string;
  badge?: string;
  price?: string;
}
