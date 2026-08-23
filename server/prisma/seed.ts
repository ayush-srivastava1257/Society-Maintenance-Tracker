import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SocietyOS database seeding...');

  // Clean existing tables
  await prisma.complaintHistory.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();

  // Create Passwords
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

  // 2. Create Residents
  const resident1 = await prisma.user.create({
    data: {
      name: 'Ananya Sharma',
      email: 'ananya@societyos.app',
      passwordHash: residentPasswordHash,
      role: 'RESIDENT',
      apartmentNo: 'A-402',
    },
  });

  const resident2 = await prisma.user.create({
    data: {
      name: 'Vikram Mehta',
      email: 'vikram@societyos.app',
      passwordHash: residentPasswordHash,
      role: 'RESIDENT',
      apartmentNo: 'B-105',
    },
  });

  const resident3 = await prisma.user.create({
    data: {
      name: 'Priya Nair',
      email: 'priya@societyos.app',
      passwordHash: residentPasswordHash,
      role: 'RESIDENT',
      apartmentNo: 'C-701',
    },
  });

  const resident4 = await prisma.user.create({
    data: {
      name: 'Rohan Gupta',
      email: 'rohan@societyos.app',
      passwordHash: residentPasswordHash,
      role: 'RESIDENT',
      apartmentNo: 'A-203',
    },
  });

  console.log('✅ Created 1 Admin and 4 Residents');

  // Timestamps for seeding realistic timelines
  const now = new Date();
  const daysAgo = (days: number, hours: number = 0) => new Date(now.getTime() - (days * 24 + hours) * 60 * 60 * 1000);

  // 3. Create Complaints with Audit Histories

  // Complaint 1: OVERDUE (Created 5 days ago, OPEN, HIGH Priority)
  const complaint1 = await prisma.complaint.create({
    data: {
      residentId: resident1.id,
      title: 'Main Pipeline Seepage & Water Leakage',
      category: 'Plumbing',
      description: 'Water is leaking continuously near the main riser pipe in the balcony utility zone. Threatening electrical duct below.',
      priority: 'HIGH',
      status: 'OPEN',
      createdAt: daysAgo(5, 4),
    },
  });

  await prisma.complaintHistory.create({
    data: {
      complaintId: complaint1.id,
      oldStatus: 'OPEN',
      newStatus: 'OPEN',
      actorId: resident1.id,
      note: 'Complaint submitted by resident with urgency tag.',
      createdAt: daysAgo(5, 4),
    },
  });

  // Complaint 2: OVERDUE IN_PROGRESS (Created 4 days ago, IN_PROGRESS, HIGH Priority)
  const complaint2 = await prisma.complaint.create({
    data: {
      residentId: resident2.id,
      title: 'Elevator Shaft Unusual Noise & Shuddering',
      category: 'Maintenance',
      description: 'Block B Lift 2 produces a loud scraping noise when ascending to 4th floor. Vibrations felt inside cabin.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      createdAt: daysAgo(4, 2),
    },
  });

  await prisma.complaintHistory.create({
    data: {
      complaintId: complaint2.id,
      oldStatus: 'OPEN',
      newStatus: 'OPEN',
      actorId: resident2.id,
      note: 'Complaint submitted by resident.',
      createdAt: daysAgo(4, 2),
    },
  });

  await prisma.complaintHistory.create({
    data: {
      complaintId: complaint2.id,
      oldStatus: 'OPEN',
      newStatus: 'IN_PROGRESS',
      actorId: admin.id,
      note: 'Otis Elevator service technician notified. Site inspection scheduled.',
      createdAt: daysAgo(3, 10),
    },
  });

  // Complaint 3: IN_PROGRESS (Created 1 day ago, IN_PROGRESS, MEDIUM Priority)
  const complaint3 = await prisma.complaint.create({
    data: {
      residentId: resident3.id,
      title: 'Corridor Lighting Circuit Breaker Tripping',
      category: 'Electrical',
      description: '7th floor corridor lights turn off unexpectedly every evening around 8 PM.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      createdAt: daysAgo(1, 6),
    },
  });

  await prisma.complaintHistory.create({
    data: {
      complaintId: complaint3.id,
      oldStatus: 'OPEN',
      newStatus: 'OPEN',
      actorId: resident3.id,
      note: 'Complaint submitted by resident.',
      createdAt: daysAgo(1, 6),
    },
  });

  await prisma.complaintHistory.create({
    data: {
      complaintId: complaint3.id,
      oldStatus: 'OPEN',
      newStatus: 'IN_PROGRESS',
      actorId: admin.id,
      note: 'Electrician assigned to check DB box circuit load.',
      createdAt: daysAgo(0, 18),
    },
  });

  // Complaint 4: RESOLVED (Created 3 days ago, Resolved 1 day ago)
  const complaint4 = await prisma.complaint.create({
    data: {
      residentId: resident4.id,
      title: 'Clubhouse Garbage Bin Overflowing',
      category: 'Cleaning',
      description: 'Waste management bins outside the gym area were full and spilling over.',
      priority: 'LOW',
      status: 'RESOLVED',
      createdAt: daysAgo(3, 8),
      resolvedAt: daysAgo(1, 2),
    },
  });

  await prisma.complaintHistory.create({
    data: {
      complaintId: complaint4.id,
      oldStatus: 'OPEN',
      newStatus: 'OPEN',
      actorId: resident4.id,
      note: 'Complaint submitted by resident.',
      createdAt: daysAgo(3, 8),
    },
  });

  await prisma.complaintHistory.create({
    data: {
      complaintId: complaint4.id,
      oldStatus: 'OPEN',
      newStatus: 'IN_PROGRESS',
      actorId: admin.id,
      note: 'Housekeeping team dispatched.',
      createdAt: daysAgo(2, 5),
    },
  });

  await prisma.complaintHistory.create({
    data: {
      complaintId: complaint4.id,
      oldStatus: 'IN_PROGRESS',
      newStatus: 'RESOLVED',
      actorId: admin.id,
      note: 'Bins cleared, sanitized, and extra collection scheduled.',
      createdAt: daysAgo(1, 2),
    },
  });

  // Complaint 5: Recent OPEN (Created 3 hours ago)
  const complaint5 = await prisma.complaint.create({
    data: {
      residentId: resident1.id,
      title: 'Intercom Line Static Noise',
      category: 'Other',
      description: 'Intercom connection to security guard booth has heavy static distortion.',
      priority: 'LOW',
      status: 'OPEN',
      createdAt: daysAgo(0, 3),
    },
  });

  await prisma.complaintHistory.create({
    data: {
      complaintId: complaint5.id,
      oldStatus: 'OPEN',
      newStatus: 'OPEN',
      actorId: resident1.id,
      note: 'Complaint submitted by resident.',
      createdAt: daysAgo(0, 3),
    },
  });

  console.log('✅ Created 5 sample Complaints with audit history timelines');

  // 4. Create Notices
  await prisma.notice.create({
    data: {
      title: 'Annual Overhead Water Tank Cleaning Schedule',
      content:
        'Please be informed that overhead water tanks for Towers A, B, and C will undergo deep chemical cleaning on Saturday from 9:00 AM to 3:00 PM. Water supply will remain paused during these hours. Kindly store sufficient water in advance.',
      isImportant: true,
      createdBy: admin.id,
      createdAt: daysAgo(2, 0),
    },
  });

  await prisma.notice.create({
    data: {
      title: 'Quarterly General Body Meeting (AGM) Announcement',
      content:
        'The Annual General Body Meeting will be held at the Society Clubhouse on Sunday at 10:30 AM. Agenda includes annual budget approval and security vendor review.',
      isImportant: false,
      createdBy: admin.id,
      createdAt: daysAgo(4, 0),
    },
  });

  await prisma.notice.create({
    data: {
      title: 'EV Charging Station Installation Guidelines',
      content:
        'Residents interested in setting up private EV chargers in designated basement parking slots must submit an application form to the society office to ensure electrical grid compliance.',
      isImportant: false,
      createdBy: admin.id,
      createdAt: daysAgo(6, 0),
    },
  });

  console.log('✅ Created 3 sample Notices (including 1 Pinned Important Notice)');

  // 5. Create Settings
  await prisma.setting.create({
    data: {
      key: 'overdueThresholdDays',
      value: '3',
    },
  });

  await prisma.setting.create({
    data: {
      key: 'emailNotificationsEnabled',
      value: 'true',
    },
  });

  console.log('✅ Created Application Settings');

  console.log('\n✨ Database seeding completed successfully!');
  console.log('--------------------------------------------------');
  console.log('🔑 Seeded Credentials:');
  console.log('   Admin:    admin@societyos.app / Admin@123');
  console.log('   Resident: ananya@societyos.app / Resident@123');
  console.log('   Resident: vikram@societyos.app / Resident@123');
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
