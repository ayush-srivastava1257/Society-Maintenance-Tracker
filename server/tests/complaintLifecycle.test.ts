import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/utils/prisma';
import bcrypt from 'bcryptjs';

describe('Complaint Lifecycle & Immutable Audit Trail', () => {
  let residentToken: string;
  let adminToken: string;
  let residentId: string;
  let adminId: string;
  let createdComplaintId: string;

  beforeAll(async () => {
    await prisma.complaintHistory.deleteMany();
    await prisma.complaint.deleteMany();
    await prisma.notice.deleteMany();
    await prisma.user.deleteMany();

    // Create resident user
    const resReg = await request(app).post('/api/auth/register').send({
      name: 'Lifecycle Resident',
      email: 'lcresident@societyos.app',
      password: 'Password123',
      apartmentNo: 'C-302',
    });
    residentToken = resReg.body.token;
    residentId = resReg.body.user.id;

    // Create admin user
    const adminReg = await request(app).post('/api/auth/register').send({
      name: 'Lifecycle Admin',
      email: 'lcadmin@societyos.app',
      password: 'Password123',
      role: 'ADMIN',
    });
    adminToken = adminReg.body.token;
    adminId = adminReg.body.user.id;
  });

  afterAll(async () => {
    // Re-seed demo users so dev database is preserved after test suite runs
    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
    const residentPasswordHash = await bcrypt.hash('Resident@123', 10);

    await prisma.user.upsert({
      where: { email: 'admin@societyos.app' },
      update: { passwordHash: adminPasswordHash },
      create: {
        name: 'Rajesh Kumar (Facility Admin)',
        email: 'admin@societyos.app',
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        apartmentNo: 'Admin Office',
      },
    });

    await prisma.user.upsert({
      where: { email: 'ananya@societyos.app' },
      update: { passwordHash: residentPasswordHash },
      create: {
        name: 'Ananya Sharma',
        email: 'ananya@societyos.app',
        passwordHash: residentPasswordHash,
        role: 'RESIDENT',
        apartmentNo: 'A-402',
      },
    });

    await prisma.$disconnect();
  });

  it('should allow resident to create a new complaint', async () => {
    const res = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${residentToken}`)
      .send({
        title: 'Water Pipe Leakage',
        category: 'Plumbing',
        description: 'Heavy water dripping from balcony pipe.',
        priority: 'HIGH',
      });

    expect(res.status).toBe(201);
    expect(res.body.complaint).toHaveProperty('id');
    expect(res.body.complaint.status).toBe('OPEN');
    expect(res.body.complaint.history.length).toBe(1);

    createdComplaintId = res.body.complaint.id;
  });

  it('should block resident from modifying complaint status directly', async () => {
    const res = await request(app)
      .patch(`/api/complaints/${createdComplaintId}/status`)
      .set('Authorization', `Bearer ${residentToken}`)
      .send({ status: 'IN_PROGRESS', note: 'Resident trying to change status' });

    expect(res.status).toBe(403);
  });

  it('should allow admin to update status to IN_PROGRESS and append history audit record', async () => {
    const res = await request(app)
      .patch(`/api/complaints/${createdComplaintId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'IN_PROGRESS', note: 'Plumber dispatched.' });

    expect(res.status).toBe(200);
    expect(res.body.complaint.status).toBe('IN_PROGRESS');

    const histories = res.body.complaint.history;
    expect(histories.length).toBe(2);

    const latestHistory = histories[histories.length - 1];
    expect(latestHistory.oldStatus).toBe('OPEN');
    expect(latestHistory.newStatus).toBe('IN_PROGRESS');
    expect(latestHistory.note).toBe('Plumber dispatched.');
  });

  it('should allow admin to update status to RESOLVED and set resolvedAt date', async () => {
    const res = await request(app)
      .patch(`/api/complaints/${createdComplaintId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'RESOLVED', note: 'Pipe gasket replaced and tested.' });

    expect(res.status).toBe(200);
    expect(res.body.complaint.status).toBe('RESOLVED');
    expect(res.body.complaint.resolvedAt).not.toBeNull();

    const histories = res.body.complaint.history;
    expect(histories.length).toBe(3);

    const resolvedHistory = histories[histories.length - 1];
    expect(resolvedHistory.oldStatus).toBe('IN_PROGRESS');
    expect(resolvedHistory.newStatus).toBe('RESOLVED');
    expect(resolvedHistory.note).toBe('Pipe gasket replaced and tested.');
  });
});
