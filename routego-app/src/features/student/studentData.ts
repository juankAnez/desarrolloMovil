import { StudentProfile, TripRecord } from './types';

export const MOCK_STUDENTS: Record<string, StudentProfile> = {
  'ST-202688': {
    id: 'ST-202688',
    fullName: 'Juan Carlos Pérez',
    documentNumber: '1098765432',
    career: 'Ingeniería de Sistemas',
    faculty: 'Facultad de Ingeniería y Ciencias',
    semester: '6.° Semestre',
    status: 'Activo',
    validUntil: 'Diciembre 2026',
    cardType: 'Pase Semestral Preferente',
    monthlyTripsTaken: 38,
    favoriteRoute: 'R-01 (Ruta Norte)',
    avatarInitials: 'JP',
    avatarColor: '#1E3A8A',
    walletBalance: '$45.000 COP',
  },
  'ST-202412': {
    id: 'ST-202412',
    fullName: 'María Paula Castro',
    documentNumber: '1023456789',
    career: 'Medicina Humana',
    faculty: 'Facultad de Ciencias de la Salud',
    semester: '4.° Semestre',
    status: 'Activo',
    validUntil: 'Diciembre 2026',
    cardType: 'Pase Clínico Hospitalario',
    monthlyTripsTaken: 52,
    favoriteRoute: 'R-02 (Ruta Sur)',
    avatarInitials: 'MC',
    avatarColor: '#047857',
    walletBalance: '$62.500 COP',
  },
  'ST-202570': {
    id: 'ST-202570',
    fullName: 'Daniel Morales Ruiz',
    documentNumber: '1012398475',
    career: 'Diseño y Comunicación Digital',
    faculty: 'Facultad de Artes y Creación',
    semester: '8.° Semestre',
    status: 'Activo',
    validUntil: 'Noviembre 2026',
    cardType: 'Pase Intercampus Estándar',
    monthlyTripsTaken: 24,
    favoriteRoute: 'R-04 (Circuito Campus)',
    avatarInitials: 'DM',
    avatarColor: '#6D28D9',
    walletBalance: '$28.000 COP',
  },
};

export const MOCK_TRIPS: TripRecord[] = [
  {
    id: 'T-101',
    routeCode: 'R-01',
    routeName: 'Ruta Norte - Campus Principal',
    date: 'Hoy',
    time: '08:14 AM',
    stopBoarded: 'Portal Norte (Terminal)',
    busPlate: 'RG-402',
    status: 'Completado',
  },
  {
    id: 'T-102',
    routeCode: 'R-04',
    routeName: 'Circuito Campus Interno',
    date: 'Ayer',
    time: '02:30 PM',
    stopBoarded: 'Facultad de Artes',
    busPlate: 'RG-204',
    status: 'Completado',
  },
  {
    id: 'T-103',
    routeCode: 'R-01',
    routeName: 'Ruta Norte - Portal',
    date: '05 Septiembre',
    time: '06:45 PM',
    stopBoarded: 'Campus Principal (Puerta 3)',
    busPlate: 'RG-402',
    status: 'Completado',
  },
  {
    id: 'T-104',
    routeCode: 'R-03',
    routeName: 'Ruta Express Central',
    date: '04 Septiembre',
    time: '11:20 AM',
    stopBoarded: 'Estación Central',
    busPlate: 'RG-550',
    status: 'Completado',
  },
];

export function getStudentById(id: string): StudentProfile {
  if (MOCK_STUDENTS[id]) {
    return MOCK_STUDENTS[id];
  }
  // Generic fallback if user enters custom id in dynamic URL
  return {
    id: id,
    fullName: `Estudiante ${id}`,
    documentNumber: '10' + Math.floor(10000000 + Math.random() * 90000000),
    career: 'Programa Académico Universitario',
    faculty: 'Facultad General',
    semester: 'Semestre Regular',
    status: 'Activo',
    validUntil: 'Diciembre 2026',
    cardType: 'Pase Institucional',
    monthlyTripsTaken: 12,
    favoriteRoute: 'R-01 (Ruta Norte)',
    avatarInitials: id.slice(-2).toUpperCase(),
    avatarColor: '#000666',
    walletBalance: '$30.000 COP',
  };
}
