export interface AddPropertyRequestDTO {
  propertyName: string;
  type: number;
  address: string;
  province: number;
  description: string;
  ownerId: string;
  ownerName: string;
}

export interface AddRoomTypeRequestDTO {
  name: string;
  facility: string;
  capacity: number;
  price: number;
  floor: number;
  unit: number;
  description: string;
}

export interface PropertyTransactionRequest {
  property: AddPropertyRequestDTO;
  roomTypes: AddRoomTypeRequestDTO[];
}