import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import { OverdueService } from '../services/overdueService';
import { emailService } from '../services/emailService';

export const createComplaint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { title, category, description, priority } = req.body;

    if (!title || !category || !description) {
      res.status(400).json({ message: 'Title, category, and description are required.' });
      return;
    }

    let photoUrl: string | null = null;
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    const complaintPriority = priority && ['LOW', 'MEDIUM', 'HIGH'].includes(priority) ? priority : 'MEDIUM';

    // Create complaint + initial history record in a transaction
    const complaint = await prisma.$transaction(async (tx) => {
      const newComplaint = await tx.complaint.create({
        data: {
          residentId: req.user!.id,
          title: title.trim(),
          category: category.trim(),
          description: description.trim(),
          photoUrl,
          priority: complaintPriority,
          status: 'OPEN',
        },
      });

      await tx.complaintHistory.create({
        data: {
          complaintId: newComplaint.id,
          oldStatus: 'OPEN',
          newStatus: 'OPEN',
          actorId: req.user!.id,
          note: 'Complaint submitted by resident.',
        },
      });

      return newComplaint;
    });

    const fullComplaint = await prisma.complaint.findUnique({
      where: { id: complaint.id },
      include: {
        resident: { select: { id: true, name: true, email: true, apartmentNo: true } },
        history: {
          include: { actor: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    res.status(201).json({ message: 'Complaint created successfully', complaint: fullComplaint });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Failed to create complaint' });
  }
};

export const getMyComplaints = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const thresholdDays = await OverdueService.getOverdueThresholdDays();

    const complaints = await prisma.complaint.findMany({
      where: { residentId: req.user.id },
      include: {
        history: {
          include: { actor: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const enrichedComplaints = complaints.map((c) => {
      const overdueInfo = OverdueService.computeOverdueStatus(
        c.createdAt,
        c.status as any,
        thresholdDays
      );
      return {
        ...c,
        overdueInfo,
      };
    });

    res.status(200).json({ complaints: enrichedComplaints });
  } catch (error) {
    console.error('Get my complaints error:', error);
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
};

export const getAllComplaints = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, status, priority, search, overdueOnly, startDate, endDate } = req.query;
    const thresholdDays = await OverdueService.getOverdueThresholdDays();

    const whereClause: any = {};

    if (category && category !== 'ALL') {
      whereClause.category = category as string;
    }

    if (status && status !== 'ALL') {
      whereClause.status = status as string;
    }

    if (priority && priority !== 'ALL') {
      whereClause.priority = priority as string;
    }

    if (search) {
      const query = (search as string).trim();
      whereClause.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        { resident: { name: { contains: query } } },
        { resident: { apartmentNo: { contains: query } } },
      ];
    }

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate as string);
      if (endDate) whereClause.createdAt.lte = new Date(endDate as string);
    }

    const complaints = await prisma.complaint.findMany({
      where: whereClause,
      include: {
        resident: { select: { id: true, name: true, email: true, apartmentNo: true } },
        history: {
          include: { actor: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();
    let enrichedComplaints = complaints.map((c) => {
      const overdueInfo = OverdueService.computeOverdueStatus(
        c.createdAt,
        c.status as any,
        thresholdDays,
        now
      );
      return {
        ...c,
        overdueInfo,
      };
    });

    if (overdueOnly === 'true') {
      enrichedComplaints = enrichedComplaints.filter((c) => c.overdueInfo.isOverdue);
    }

    res.status(200).json({ complaints: enrichedComplaints, overdueThresholdDays: thresholdDays });
  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
};

export const getComplaintById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const thresholdDays = await OverdueService.getOverdueThresholdDays();

    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        resident: { select: { id: true, name: true, email: true, apartmentNo: true } },
        history: {
          include: { actor: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!complaint) {
      res.status(404).json({ message: 'Complaint not found' });
      return;
    }

    // Role-based authorization check: Resident can only view their own complaint
    if (req.user.role === 'RESIDENT' && complaint.residentId !== req.user.id) {
      res.status(403).json({ message: 'Forbidden: You do not have access to this complaint' });
      return;
    }

    const overdueInfo = OverdueService.computeOverdueStatus(
      complaint.createdAt,
      complaint.status as any,
      thresholdDays
    );

    res.status(200).json({ complaint: { ...complaint, overdueInfo } });
  } catch (error) {
    console.error('Get complaint by ID error:', error);
    res.status(500).json({ message: 'Failed to fetch complaint details' });
  }
};

export const updateStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden: Admin access required' });
      return;
    }

    const { id } = req.params;
    const { status: newStatus, note } = req.body;

    if (!newStatus || !['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(newStatus)) {
      res.status(400).json({ message: 'Valid status (OPEN, IN_PROGRESS, RESOLVED) is required.' });
      return;
    }

    const existingComplaint = await prisma.complaint.findUnique({
      where: { id },
      include: { resident: { select: { email: true, name: true } } },
    });

    if (!existingComplaint) {
      res.status(404).json({ message: 'Complaint not found' });
      return;
    }

    const oldStatus = existingComplaint.status;

    if (oldStatus === newStatus && !note) {
      res.status(400).json({ message: 'No status change detected.' });
      return;
    }

    // Perform status update and create history record inside a single Prisma transaction
    const updatedComplaint = await prisma.$transaction(async (tx) => {
      const updated = await tx.complaint.update({
        where: { id },
        data: {
          status: newStatus,
          resolvedAt: newStatus === 'RESOLVED' ? new Date() : existingComplaint.resolvedAt,
        },
      });

      await tx.complaintHistory.create({
        data: {
          complaintId: id,
          oldStatus,
          newStatus,
          actorId: req.user!.id,
          note: note ? note.trim() : null,
        },
      });

      return updated;
    });

    // Trigger async email notification if status changed
    if (oldStatus !== newStatus && existingComplaint.resident?.email) {
      emailService.notifyStatusChange(
        existingComplaint.resident.email,
        existingComplaint.resident.name,
        existingComplaint.title,
        oldStatus,
        newStatus,
        note
      );
    }

    const thresholdDays = await OverdueService.getOverdueThresholdDays();
    const fullUpdatedComplaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        resident: { select: { id: true, name: true, email: true, apartmentNo: true } },
        history: {
          include: { actor: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    const overdueInfo = OverdueService.computeOverdueStatus(
      fullUpdatedComplaint!.createdAt,
      fullUpdatedComplaint!.status as any,
      thresholdDays
    );

    res.status(200).json({
      message: `Complaint status updated to ${newStatus}`,
      complaint: { ...fullUpdatedComplaint, overdueInfo },
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Failed to update complaint status' });
  }
};

export const updatePriority = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden: Admin access required' });
      return;
    }

    const { id } = req.params;
    const { priority } = req.body;

    if (!priority || !['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
      res.status(400).json({ message: 'Valid priority (LOW, MEDIUM, HIGH) is required.' });
      return;
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: { priority },
      include: {
        resident: { select: { id: true, name: true, email: true, apartmentNo: true } },
        history: {
          include: { actor: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    res.status(200).json({
      message: `Complaint priority set to ${priority}`,
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error('Update priority error:', error);
    res.status(500).json({ message: 'Failed to update complaint priority' });
  }
};
