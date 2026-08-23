import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/utils/prisma';
import bcrypt from 'bcryptjs';

describe('Auth & Authorization API', () => {
  beforeAll(async () => {
    await prisma.complaintHistory.deleteMany();
    await prisma.complaint.deleteMany();
    await prisma.notice.deleteMany();
    await prisma.user.deleteMany();
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

  const testUser = {
    name: 'Test Resident',
    email: 'testresident@societyos.app',
    password: 'Password123',
    apartmentNo: 'A-101',
  };

  it('should register a new resident user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testUser.email);
    expect(res.body.user.role).toBe('RESIDENT');
  });

  it('should fail registration with duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('already exists');
  });

  it('should login successfully with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('should fail login with invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'WrongPassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toContain('Invalid email or password');
  });

  it('should return user info for authenticated /api/auth/me request', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    const token = loginRes.body.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe(testUser.email);
  });
});
