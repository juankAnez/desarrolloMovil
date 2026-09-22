export type ServiceCategory =
  | 'Todos'
  | 'Tecnología'
  | 'Hogar'
  | 'Electricidad'
  | 'Plomería'
  | 'Educación'
  | 'Diseño';

export interface ServiceProvider {
  id: string;
  name: string;
  profession: string;
  rating: number;
  completedJobs: number;
  phone: string;
  avatar: string;
  latitude: number;
  longitude: number;
  neighborhood: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  price: number; // in COP
  priceFormatted: string;
  estimatedDuration: string;
  provider: ServiceProvider;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  includedTasks: string[];
}
