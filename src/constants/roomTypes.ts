export const ROOM_TYPES = {
  HOTEL: ["Standard Room", "Double Room", "Deluxe Room", "Suite", "Family Room", "Superior Room"],
  VILLA: ["Luxury", "Beachfront", "Mountside", "Eco-friendly", "Romantic"],
  APARTMENT: ["Studio", "1BR", "2BR", "3BR", "Penthouse"]
} as const;

export const getRoomTypesByPropertyType = (propertyType: number) => {
  switch (propertyType) {
    case 1: return ROOM_TYPES.HOTEL;
    case 2: return ROOM_TYPES.VILLA;
    case 3: return ROOM_TYPES.APARTMENT;
    default: return [];
  }
};