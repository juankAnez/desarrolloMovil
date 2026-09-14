import { FleetKPI, ServiceAlert, EmergencyContact } from './types';

export const MOCK_FLEET_KPI: FleetKPI = {
  totalBuses: 16,
  activeBuses: 12,
  onTimePercentage: 94.8,
  avgWaitMinutes: 8,
  systemCondition: 'Retrasos Menores',
  lastUpdated: 'Hace 3 minutos',
};

export const MOCK_ALERTS: ServiceAlert[] = [
  {
    id: 'ALT-01',
    title: 'Congestión Vial en Avenida El Dorado',
    description: 'La Ruta Express Central presenta retrasos de 10 a 14 minutos debido a obras de infraestructura en el corredor central.',
    severity: 'warning',
    timestamp: 'Hace 15 min',
    affectedRouteCode: 'R-03',
  },
  {
    id: 'ALT-02',
    title: 'Refuerzo de Shuttles por Jornada de Exámenes',
    description: 'Se incorporan 2 unidades adicionales en Ruta Norte entre las 11:30 y las 14:00 hrs para reducir tiempos de espera.',
    severity: 'info',
    timestamp: 'Hace 1 hora',
    affectedRouteCode: 'R-01',
  },
  {
    id: 'ALT-03',
    title: 'Operación Nocturna Normal',
    description: 'El circuito de Ruta Nocturna Segura iniciará a las 18:30 hrs en todos los paraderos universitarios asignados.',
    severity: 'info',
    timestamp: 'Hoy 08:00 AM',
    affectedRouteCode: 'R-05',
  },
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'c1',
    name: 'Centro de Control RouteGo',
    phone: '+57 (601) 316-5000',
    role: 'Monitoreo de Flota 24/7',
    icon: 'headset-outline',
  },
  {
    id: 'c2',
    name: 'Seguridad y Vigilancia Campus',
    phone: '+57 (601) 316-5555',
    role: 'Atención Inmediata Emergencias',
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'c3',
    name: 'Objetos Extraviados en Shuttles',
    phone: '+57 300 987 6543',
    role: 'Recepción Bloque Central',
    icon: 'search-outline',
  },
];
