export type UserRole = 'CLIENT' | 'PROVIDER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  avatar: string;
  address: string;
  latitude: number;
  longitude: number;
}
