export interface AddBookingRequest {
  roomID: string;          
  roomTypeID: string;     
  checkInDate: string;     
  checkOutDate: string;    
  capacity: number;
  customerID: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  isBreakfast: boolean;
}
