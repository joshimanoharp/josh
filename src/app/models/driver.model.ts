export type DriverStatus = 'ACTIVE' | 'AT REST' | 'DELAYED';

export interface Driver {
  id: string;
  driverId: string;
  operatorName: string;
  vehicle: string;
  licensePlate: string;
  status: DriverStatus;
  routeProgress: number;
  efficiency: number;
  avatar?: string;
}
