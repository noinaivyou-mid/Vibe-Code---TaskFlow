export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'To-Do' | 'In Progress' | 'Done' | 'Stuck';
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role?: string;
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: User;
  dueDate: string;
  dueTime?: string;
  comments: Comment[];
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
}

export interface AppState {
  projects: Project[];
  currentUser: User;
}
