export interface CommonResponseInterface<T> {
  status: number;
  message: string;
  timestamp: Date;
  data: T;
}