import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export async function ensureDatabaseSeeded() {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return;
    }

    console.log('🌱 Seeding initial database demo records...');

    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
    const residentPasswordHash = await bcrypt.hash('Resident@123', 10);

    // 1. Create Admin
    const admin = await prisma.user.create({
      data: {
        name: 'Rajesh Kumar (Facility Admin)',
        email: 'admin@societyos.app',
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        apartmentNo: 'Admin Office',
      },
    });

    // 2. Create Resident
    const resident = await prisma.user.create({
      data: {
        name: 'Ananya Sharma',
        email: 'ananya@societyos.app',
        passwordHash: residentPasswordHash,
        role: 'RESIDENT',
        apartmentNo: 'A-402',
      },
    });

    // 3. Create Default Setting
    await prisma.setting.create({
      data: {
        key: 'overdue_threshold_days',
        value: '3',
      },
    });

    // 4. Create Initial Notices
    await prisma.notice.create({
      data: {
        title: 'Annual Overhead Water Tank Cleaning Schedule',
        content: 'Water supply will be suspended from 10:00 AM to 4:00 PM on Friday for routine cleaning.',
        isImportant: true,
        createdBy: admin.id,
      },
    });

    await prisma.notice.create({
      data: {
        title: 'Monthly Society Maintenance Fee Reminder',
        content: 'Please pay monthly maintenance fees by the 10th of this month to avoid late fee charges.',
        isImportant: false,
        createdBy: admin.id,
      },
    });

    // 5. Create Initial Sample Complaint
    const complaint = await prisma.complaint.create({
      data: {
        title: 'Balcony Drain Pipe Water Leakage',
        category: 'Plumbing',
        priority: 'HIGH',
        description: 'Water is dripping from the main balcony drain pipe onto the lower floor balcony.',
        status: 'IN_PROGRESS',
        residentId: resident.id,
      },
    });

    await prisma.complaintHistory.create({
      data: {
        complaintId: complaint.id,
        oldStatus: 'OPEN',
        newStatus: 'IN_PROGRESS',
        actorId: admin.id,
        note: 'Plumber assigned for inspection and pipe sealing.',
      },
    });

    console.log('✅ Database auto-seeded successfully!');
  } catch (err) {
    console.error('Auto-seed check warning:', err);
  }
}
