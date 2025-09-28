
export interface TeamMember {
  id: string;
  name: string;
  timezone: string;
}

export enum WorkingHoursStatus {
  WORKING = 'WORKING',
  BORDERLINE = 'BORDERLINE',
  OFF = 'OFF',
}
