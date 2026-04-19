import { Injectable, signal } from '@angular/core';
import { Driver } from '../models/driver.model';

@Injectable({ providedIn: 'root' })
export class DriverService {
  drivers = signal<Driver[]>([
    {
      id: '1',
      driverId: '#DRV-8901',
      operatorName: 'Jameson Miller',
      vehicle: 'Volvo FH16',
      licensePlate: '44-BB-92',
      status: 'ACTIVE',
      routeProgress: 72,
      efficiency: 98.4,
      avatar: 'JM'
    },
    {
      id: '2',
      driverId: '#DRV-7723',
      operatorName: 'Leila Vance',
      vehicle: 'Isuzu NPR',
      licensePlate: '12-XZ-01',
      status: 'AT REST',
      routeProgress: 100,
      efficiency: 94.1,
      avatar: 'LV'
    },
    {
      id: '3',
      driverId: '#DRV-6651',
      operatorName: 'Marcus Reid',
      vehicle: 'Scania R500',
      licensePlate: '09-RR-45',
      status: 'DELAYED',
      routeProgress: 34,
      efficiency: 82.0,
      avatar: 'MR'
    }
  ]);

  private idCounter = 9000;

  add(driver: Omit<Driver, 'id' | 'driverId'>): Driver {
    const id = String(Date.now());
    const driverId = `#DRV-${++this.idCounter}`;
    const newDriver: Driver = { ...driver, id, driverId };
    this.drivers.update(d => [...d, newDriver]);
    return newDriver;
  }

  update(updated: Driver): void {
    this.drivers.update(d => d.map(x => x.id === updated.id ? updated : x));
  }

  delete(id: string): void {
    this.drivers.update(d => d.filter(x => x.id !== id));
  }
}
