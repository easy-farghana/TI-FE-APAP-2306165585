export interface Bill {
  billID: string; // UUID
  customerID: string;
  serviceName: string;
  serviceReferenceID: string;
  description: string;
  status: number;
  amount: number;
  createdAt: string;
  updatedAt?: string;
  paymentTimestamp?: string;
}

export interface BillFilters {
  customerID?: string;
  serviceName?: string;
  status?: number;
}
