export type RouteStatus = 'Activo' | 'Demorado' | 'Inactivo';

export interface RouteStop {
  id: string;
  name: string;
  estimatedTime: string;
  isPassed?: boolean;
  isCurrent?: boolean;
}

export interface RouteAmenities {
  ac: boolean;
  wifi: boolean;
  accessible: boolean;
}

export interface ShuttleRoute {
  id: string;
  name: string;
  code: string;
  destination: string;
  origin: string;
  status: RouteStatus;
  statusNote?: string;
  color: string;
  etaMinutes: number;
  frequencyMinutes: number;
  capacityPercentage: number;
  availableSeats: number;
  totalSeats: number;
  activeBuses: number;
  driverName: string;
  busPlate: string;
  amenities: RouteAmenities;
  stops: RouteStop[];
  scheduleNote?: string;
}
