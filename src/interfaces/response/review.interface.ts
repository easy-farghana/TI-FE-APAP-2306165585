export interface ReviewResponse {
  reviewID: string;
  customerID: string;
  customerName: string;
  propertyName: string;
  bookingID: string;
  comment: string;
  cleanlinessRating: number;
  facilityRating: number;
  serviceRating: number;
  valueRating: number;
  overallRating: number;
  createdAt: string;
}