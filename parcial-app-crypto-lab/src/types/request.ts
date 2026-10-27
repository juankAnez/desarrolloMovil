import { ServiceItem } from './service';
import { User } from './auth';

export type RequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  label: string;
}

export interface ServiceRequest {
  id: string;
  service: ServiceItem;
  client: User;
  provider: User;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  clientLocation: LocationPoint;
  providerCurrentLocation: LocationPoint;
  estimatedDistanceKm: number;
  estimatedArrivalMinutes: number;
  notes?: string;
}
