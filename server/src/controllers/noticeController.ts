import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import { emailService } from '../services/emailService';

export const getAllNotices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const notices = await prisma.notice.findMany({
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
      orderBy: [{ isImportant: 'desc' }, { createdAt: 'desc' }],
    });

    res.status(200).json({ notices });
  } catch (error) {
    console.error('Get all notices error:', error);
    res.status(500).json({ message: 'Failed to fetch notices' });
  }
};

export const createNotice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden: Admin access required' });
      return;
    }

    const { title, content, isImportant } = req.body;

    if (!title || !content) {
      res.status(400).json({ message: 'Title and content are required.' });
      return;
    }

    const notice = await prisma.notice.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        isImportant: Boolean(isImportant),
        createdBy: req.user.id,
      },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    });

    // If notice is marked as important, notify all residents via email
    if (notice.isImportant) {
      const residents = await prisma.user.findMany({
        where: { role: 'RESIDENT' },
        select: { email: true, name: true },
      });

      residents.forEach((resident) => {
        emailService.notifyImportantNotice(resident.email, resident.name, notice.title, notice.content);
      });
    }

    res.status(201).json({ message: 'Notice created successfully', notice });
  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({ message: 'Failed to create notice' });
  }
};

export const updateNotice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden: Admin access required' });
      return;
    }

    const { id } = req.params;
    const { title, content, isImportant } = req.body;

    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Notice not found' });
      return;
    }

    const notice = await prisma.notice.update({
      where: { id },
      data: {
        title: title ? title.trim() : existing.title,
        content: content ? content.trim() : existing.content,
        isImportant: isImportant !== undefined ? Boolean(isImportant) : existing.isImportant,
      },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    });

    res.status(200).json({ message: 'Notice updated successfully', notice });
  } catch (error) {
    console.error('Update notice error:', error);
    res.status(500).json({ message: 'Failed to update notice' });
  }
};

export const deleteNotice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden: Admin access required' });
      return;
    }

    const { id } = req.params;

    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Notice not found' });
      return;
    }

    await prisma.notice.delete({ where: { id } });

    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({ message: 'Failed to delete notice' });
  }
};
