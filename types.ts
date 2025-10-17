
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface Alarm {
  id: number;
  time: string; // HH:MM
  name: string;
  enabled: boolean;
}
