declare global {
  namespace Express {
    interface AuthenticatedUser {
      id: string;
      email: string;
      name: string;
      avatarUrl: string | null;
      roleLabel: string | null;
      isActive: boolean;
    }

    interface Request {
      auth?: {
        userId: string;
        email: string;
      };
      user?: AuthenticatedUser;
    }
  }
}

export {};
