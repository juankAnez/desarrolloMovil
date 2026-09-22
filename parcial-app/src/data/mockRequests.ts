import { ServiceRequest } from '../types/request';
import { MOCK_CLIENT_USER, MOCK_PROVIDER_USER } from './mockUsers';
import { MOCK_SERVICES } from './mockServices';

export const INITIAL_MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: 'REQ-2026-001',
    service: MOCK_SERVICES[0], // Reparación de computadores
    client: MOCK_CLIENT_USER,
    provider: MOCK_PROVIDER_USER,
    status: 'ON_THE_WAY',
    createdAt: 'Hoy, 02:15 PM',
    updatedAt: 'Hoy, 02:40 PM',
    clientLocation: {
      latitude: 11.5445,
      longitude: -72.9070,
      label: 'Calle 7 # 12-45, Barrio Centro',
    },
    providerCurrentLocation: {
      latitude: 11.5410,
      longitude: -72.9110,
      label: 'En desplazamiento hacia el cliente (Av. Circunvalar)',
    },
    estimatedDistanceKm: 0.8,
    estimatedArrivalMinutes: 6,
    notes: 'El computador portátil no enciende la pantalla pero prende el ventilador.',
  },
  {
    id: 'REQ-2026-002',
    service: MOCK_SERVICES[2], // Instalación Eléctrica
    client: MOCK_CLIENT_USER,
    provider: MOCK_PROVIDER_USER,
    status: 'PENDING',
    createdAt: 'Hoy, 03:00 PM',
    updatedAt: 'Hoy, 03:00 PM',
    clientLocation: {
      latitude: 11.5445,
      longitude: -72.9070,
      label: 'Calle 7 # 12-45, Barrio Centro',
    },
    providerCurrentLocation: {
      latitude: 11.5380,
      longitude: -72.9150,
      label: 'Taller Coquivacoa',
    },
    estimatedDistanceKm: 1.8,
    estimatedArrivalMinutes: 15,
    notes: 'Revisión urgente de un breaker que se dispara al encender el aire.',
  },
];
