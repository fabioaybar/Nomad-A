declare module 'vue-i18n' {
  const useI18n: () => {
    t: (key: string) => string;
    locale: string;
    availableLocales: string[];
  };
  const createI18n: (options: any) => any;
  export { useI18n, createI18n };
}

interface BookingMessages {
  title: string;
  subtitle: string;
  loading: string;
  vehicleNotFound: string;
  vehicleNotFoundDesc: string;
  browseVehicles: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  additionalNotes: string;
  enterPickupAddress: string;
  enterDropoffAddress: string;
  specialRequests: string;
  costSummary: string;
  dailyRate: string;
  numberOfDays: string;
  totalCost: string;
  cancel: string;
  confirmBooking: string;
  processing: string;
  bookingSuccess: string;
  bookingError: string;
}

declare module '@/i18n/types' {
  interface Messages {
    booking: BookingMessages;
  }
}