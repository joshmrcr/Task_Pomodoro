export interface AppData {
  user: {
    username: string;
    avatar: string;
  };
  tasks: {
    daily: { id: string; text: string; completed: boolean }[];
    weekly: { id: string; text: string; completed: boolean }[];
  };
}
