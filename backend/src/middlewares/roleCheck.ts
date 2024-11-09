import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const roleCheck = (allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        console.log('Unauthorized access: User ID is missing on req.user');
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { role: true },
      });

      if (!user || !allowedRoles.includes(user.role)) {
        return res
          .status(403)
          .json({ error: 'Access denied: insufficient permissions' });
      }
      // Role is authorized, proceed to the next middleware
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

export default roleCheck;
