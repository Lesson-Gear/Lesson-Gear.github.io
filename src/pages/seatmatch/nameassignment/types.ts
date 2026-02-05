
export interface Seat {
  id: string;
  assignedName?: string;
}

export interface Desk {
  id: string;
  x: number;
  y: number;
  rotation: number;
  singleDesk: boolean;
  seats: Seat[];
}

interface Size {
  width: number;
  height: number;
}

export interface Teacher {
  width: number;
  height: number;
  exists: boolean;
  id: string;
  x: number;
  y: number;
  rotation: number;
}

// arrangement type
export interface Arrangement {
  name: string;
  size: Size;
  id: string;
  teacher: Teacher;
  arrangement: Desk[];
}