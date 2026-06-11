export interface Vessel {
  id: string;
  name: string;
  type: string;
  gt: number;
  dwt: number;
  loa: number;
  breadth: number;
  depth?: number;
  draft?: number;
  year: number;
  cls: string;
  port: string;
  flag: string;
  engine: string;
  status: 'operational' | 'route' | 'drydock';
  crew: number;
  location: string;
  notes?: string;
}

export interface CrewMember {
  id: string;
  name: string;
  rank: string;
  vessel: string; // vessel id or empty/pool
  nationality: string;
  passport: string;
  seamanbook: string;
  dob: string;
  status: 'onboard' | 'leave' | 'standby' | 'medical';
  coc: string;
  cocExp: string;
  seamanCode?: string;
  medExp: string;
  gmdss?: string;
  emergency?: string;
}

export interface VesselDocument {
  id: string;
  vessel: string; // vessel id
  type: string;
  name: string;
  issuer: string;
  issue: string;
  expiry: string;
  notes?: string;
  driveUrl?: string;
  driveName?: string;
}

export interface CrewDocument {
  id: string;
  crewId: string;
  type: string;
  docNumber: string;
  issuer: string;
  place?: string;
  issue: string;
  expiry: string;
  status: 'valid' | 'expired' | 'proses' | 'pending';
  notes?: string;
  driveUrl?: string;
  driveName?: string;
}

export interface Rotation {
  id: string;
  crew: string; // crew id
  vessel: string; // vessel id or empty
  rank: string;
  signOn: string;
  signOff: string;
  status: 'planned' | 'enroute' | 'onboard' | 'leave';
  port: string;
  notes?: string;
}

export interface MlcLog {
  id: string;
  crew: string; // crew id
  vessel: string; // vessel id
  date: string;
  hours: number;
  rest: number;
  notes?: string;
}

export interface Incident {
  id: string;
  vessel: string; // vessel id
  date: string;
  type: string;
  description: string;
  location?: string;
  action: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  investigator: string;
}

export interface Voyage {
  id: string;
  vessel: string; // vessel id
  no: string;
  from: string;
  to: string;
  cargo: string;
  qty: string;
  start: string;
  eta: string;
  status: 'active' | 'port' | 'planned' | 'completed';
}

export interface Activity {
  time: string;
  text: string;
  ship: string;
  col: string;
}

export interface PayrollEntry {
  id: string;
  crewId: string;
  vesselId: string;
  month: string;
  gajiPokok: number;
  gajiAktual?: number;
  tambahanKenaikan?: number;
  tunjanganOps: number;
  tambahanLain?: number;
  hariAktif?: number;
  penguranganOff?: number;
  totalGaji: number;
  bpjsKes?: number;
  bpjsTK?: number;
  jkk?: number;
  jkm?: number;
  jhttk?: number;
  jpKantor?: number;
  jpKaryawan?: number;
  potonganPPh21?: number;
  potonganMCU?: number;
  gajiBersih: number;
  rekening: string;
  bank: string;
  keterangan: string;
}
