export interface StudentProfile {
  id: string;
  fullName: string;
  documentNumber: string;
  career: string;
  faculty: string;
  semester: string;
  status: 'Activo' | 'Graduado' | 'En revisión';
  validUntil: string;
  cardType: string;
  monthlyTripsTaken: number;
  favoriteRoute: string;
  avatarInitials: string;
  avatarColor: string;
  walletBalance: string;
}

export interface TripRecord {
  id: string;
  routeCode: string;
  routeName: string;
  date: string;
  time: string;
  stopBoarded: string;
  busPlate: string;
  status: 'Completado' | 'En curso';
}
