import bcrypt from 'bcrypt';
import { PrismaClient, ProjectMembershipRole, TaskPriority, TaskStatus, Theme } from '@prisma/client';

const prisma = new PrismaClient();

const users = [
  {
    id: 'u99',
    email: 'demo@taskflow.local',
    name: 'Demo User',
    avatarUrl: 'https://i.pravatar.cc/150?u=demo',
    roleLabel: 'Admin',
    theme: Theme.LIGHT,
  },
  {
    id: 'u1',
    email: 'alex@taskflow.local',
    name: 'Alex Rivera',
    avatarUrl: 'https://i.pravatar.cc/150?u=alex',
    roleLabel: 'Developer',
    theme: Theme.LIGHT,
  },
  {
    id: 'u2',
    email: 'jordan@taskflow.local',
    name: 'Jordan Smith',
    avatarUrl: 'https://i.pravatar.cc/150?u=jordan',
    roleLabel: 'Designer',
    theme: Theme.LIGHT,
  },
  {
    id: 'u3',
    email: 'sarah@taskflow.local',
    name: 'Sarah J.',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
    roleLabel: 'Manager',
    theme: Theme.DARK,
  },
];

function createUtcDate(date, time = '12:00') {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
}

async function main() {
  await prisma.authSession.deleteMany();
  await prisma.taskComment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  for (const user of users) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash,
        name: user.name,
        avatarUrl: user.avatarUrl,
        roleLabel: user.roleLabel,
        preferences: {
          create: {
            theme: user.theme,
            compactView: false,
            emailNotifications: true,
            pushNotifications: true,
            taskReminders: true,
            weeklySummary: true,
          },
        },
      },
    });
  }

  await prisma.project.create({
    data: {
      id: 'p1',
      name: 'Website Redesign',
      description: 'Redesign the marketing site with updated navigation, branding, and content quality checks.',
      ownerId: 'u99',
      createdById: 'u99',
      memberships: {
        create: [
          { userId: 'u99', role: ProjectMembershipRole.OWNER },
          { userId: 'u1', role: ProjectMembershipRole.MEMBER },
          { userId: 'u2', role: ProjectMembershipRole.MEMBER },
          { userId: 'u3', role: ProjectMembershipRole.MEMBER },
        ],
      },
      tasks: {
        create: [
          {
            id: 't1',
            title: 'Fix Navigation Bug',
            description: "The mobile menu doesn't close on click.",
            status: TaskStatus.IN_PROGRESS,
            priority: TaskPriority.HIGH,
            assigneeId: 'u1',
            createdById: 'u99',
            dueAt: createUtcDate('2026-04-05'),
            comments: {
              create: [
                {
                  id: 'c1',
                  userId: 'u3',
                  body: 'I noticed this on iOS specifically.',
                  createdAt: new Date('2026-03-28T10:00:00.000Z'),
                },
              ],
            },
          },
          {
            id: 't2',
            title: 'Update Brand Guidelines',
            description: 'Integrate the new pastel blue palette.',
            status: TaskStatus.TO_DO,
            priority: TaskPriority.MEDIUM,
            assigneeId: 'u2',
            createdById: 'u99',
            dueAt: createUtcDate('2026-04-10'),
          },
          {
            id: 't3',
            title: 'SEO Optimization',
            description: 'Review meta tags and image alt texts.',
            status: TaskStatus.TO_DO,
            priority: TaskPriority.LOW,
            assigneeId: 'u1',
            createdById: 'u99',
            dueAt: createUtcDate('2026-03-30'),
          },
          {
            id: 't4',
            title: 'Content Audit',
            description: 'Review all blog posts for accuracy.',
            status: TaskStatus.DONE,
            priority: TaskPriority.MEDIUM,
            assigneeId: 'u2',
            createdById: 'u99',
            dueAt: createUtcDate('2026-03-25'),
            completedAt: new Date('2026-03-25T14:30:00.000Z'),
          },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      id: 'p2',
      name: 'Mobile App Launch',
      description: 'Coordinate launch readiness for the new mobile application.',
      ownerId: 'u99',
      createdById: 'u99',
      memberships: {
        create: [
          { userId: 'u99', role: ProjectMembershipRole.OWNER },
          { userId: 'u1', role: ProjectMembershipRole.MEMBER },
          { userId: 'u2', role: ProjectMembershipRole.MEMBER },
          { userId: 'u3', role: ProjectMembershipRole.MEMBER },
        ],
      },
    },
  });

  console.log('Seed complete. Demo credentials: demo@taskflow.local / password123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
