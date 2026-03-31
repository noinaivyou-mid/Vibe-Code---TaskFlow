import { Project, User } from '../types';

export const mockUser: User = {
  id: 'u99',
  name: 'Demo User',
  avatar: 'https://i.pravatar.cc/150?u=demo',
  role: 'Admin'
};

export const mockTeam: User[] = [
  mockUser,
  { id: 'u1', name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?u=alex', role: 'Developer' },
  { id: 'u2', name: 'Jordan Smith', avatar: 'https://i.pravatar.cc/150?u=jordan', role: 'Designer' },
  { id: 'u3', name: 'Sarah J.', avatar: 'https://i.pravatar.cc/150?u=sarah', role: 'Manager' },
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    tasks: [
      {
        id: 't1',
        title: 'Fix Navigation Bug',
        description: 'The mobile menu doesn\'t close on click.',
        status: 'In Progress',
        priority: 'High',
        assignee: {
          id: 'u1',
          name: 'Alex Rivera',
          avatar: 'https://i.pravatar.cc/150?u=alex'
        },
        dueDate: '2026-04-05',
        comments: [
          { id: 'c1', user: 'Sarah J.', text: 'I noticed this on iOS specifically.', createdAt: '2026-03-28T10:00:00Z' }
        ],
        projectId: 'p1'
      },
      {
        id: 't2',
        title: 'Update Brand Guidelines',
        description: 'Integrate the new pastel blue palette.',
        status: 'To-Do',
        priority: 'Medium',
        assignee: {
          id: 'u2',
          name: 'Jordan Smith',
          avatar: 'https://i.pravatar.cc/150?u=jordan'
        },
        dueDate: '2026-04-10',
        comments: [],
        projectId: 'p1'
      },
      {
        id: 't3',
        title: 'SEO Optimization',
        description: 'Review meta tags and image alt texts.',
        status: 'To-Do',
        priority: 'Low',
        assignee: {
          id: 'u1',
          name: 'Alex Rivera',
          avatar: 'https://i.pravatar.cc/150?u=alex'
        },
        dueDate: '2026-03-30',
        comments: [],
        projectId: 'p1'
      },
      {
        id: 't4',
        title: 'Content Audit',
        description: 'Review all blog posts for accuracy.',
        status: 'Done',
        priority: 'Medium',
        assignee: {
          id: 'u2',
          name: 'Jordan Smith',
          avatar: 'https://i.pravatar.cc/150?u=jordan'
        },
        dueDate: '2026-03-25',
        comments: [],
        projectId: 'p1'
      }
    ]
  },
  {
    id: 'p2',
    name: 'Mobile App Launch',
    tasks: []
  }
];
