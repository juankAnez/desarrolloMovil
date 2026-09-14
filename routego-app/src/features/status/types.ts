export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface ServiceAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  affectedRouteCode?: string;
}

export interface FleetKPI {
  totalBuses: number;
  activeBuses: number;
  onTimePercentage: number;
  avgWaitMinutes: number;
  systemCondition: 'Normal' | 'Retrasos Menores' | 'Interrupción Parcial';
  lastUpdated: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  role: string;
  icon: string;
}
