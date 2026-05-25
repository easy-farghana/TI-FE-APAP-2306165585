export interface ReviewRequest {
  bookingID: string;
  comment: string;
  cleanlinessRating: number;
  facilityRating: number;
  serviceRating: number;
  valueRating: number;
}