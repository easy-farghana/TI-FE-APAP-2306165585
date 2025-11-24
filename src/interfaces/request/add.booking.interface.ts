export interface AddBookingRequest {
  roomID: string;           
  checkInDate: string;     
  checkOutDate: string;    
  capacity: number;
  customerID: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  isBreakfast: boolean;
}
