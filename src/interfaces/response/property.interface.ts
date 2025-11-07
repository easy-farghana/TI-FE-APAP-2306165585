export interface AllProperty {
  propertyID: string;
  propertyName: string;
  type: number;
  totalRooms: number;
  activeStatus: number;
}
export interface RoomResponseDTO {
  roomID: string;
  name: string;
  availabilityStatus: number;
}

export interface RoomTypeResponseDTO {
  roomTypeID: string;
  name: string;
  price: number;
  description: string;
  capacity: number;
  facility: string;
  floor: number;
  listRoom: RoomResponseDTO[];
}

export interface PropertyResponseDTO {
  propertyID: string;
  propertyName: string;
  type: number;
  address: string;
  province: number;
  description: string;
  totalRoom: number;
  income: number;
  activeStatus: number;
  listRoomType: RoomTypeResponseDTO[];
  ownerName: string;
  ownerID: string; 
  createdDate: string; 
  updatedDate: string;
}