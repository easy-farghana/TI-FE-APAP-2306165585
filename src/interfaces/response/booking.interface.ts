export interface AccommodationBookingResponseDTO {
  bookingID: string;
  checkInDate: string;
  checkOutDate: string;
  totalDays: number;
  totalPrice: number;
  status: number;
  customerID: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  capacity: number;
  roomName: string;
  createdDate: string;
  updatedDate: string;
  breakfast: boolean;
  roomID: string;
  propertyName: string;
}
