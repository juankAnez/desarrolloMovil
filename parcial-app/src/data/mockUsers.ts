import { User } from '../types/auth';

export const MOCK_CLIENT_USER: User = {
  id: 'USR-CLIENT-01',
  email: 'cliente@test.com',
  name: 'Laura Vanessa Gómez',
  role: 'CLIENT',
  phone: '+57 300 456 7890',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80',
  address: 'Calle 7 # 12-45, Barrio Centro, Riohacha',
  latitude: 11.5445,
  longitude: -72.9070,
};

export const MOCK_PROVIDER_USER: User = {
  id: 'USR-PROV-01',
  email: 'prestador@test.com',
  name: 'Carlos Eduardo Mendoza',
  role: 'PROVIDER',
  phone: '+57 312 876 5432',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
  address: 'Carrera 15 # 22-10, Barrio Coquivacoa, Riohacha',
  latitude: 11.5380,
  longitude: -72.9150,
};

export const MOCK_USERS_LIST: User[] = [
  MOCK_CLIENT_USER,
  MOCK_PROVIDER_USER,
];
