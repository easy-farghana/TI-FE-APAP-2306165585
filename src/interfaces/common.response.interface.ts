export interface CommonResponse<T> {
  status: number;
  message: string;
  timestamp: Date;
  data: T;
}