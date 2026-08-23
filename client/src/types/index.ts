export type Role = 'RESIDENT' | 'ADMIN';
export type Status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  apartmentNo?: string | null;
}

export interface OverdueInfo {
  isOverdue: boolean;
  overdueThresholdDays: number;
  hoursElapsed: number;
  thresholdHours: number;
  formattedText: string;
}

export interface ComplaintHistory {
  id: string;
  complaintId: string;
  oldStatus: Status;
  newStatus: Status;
  actorId: string;
  actor: {
    id: string;
    name: string;
    role: Role;
  };
  note?: string | null;
  createdAt: string;
}

export interface Complaint {
  id: string;
  residentId: string;
  resident?: {
    id: string;
    name: string;
    email: string;
    apartmentNo?: string | null;
  };
  title: string;
  category: string;
  description: string;
  photoUrl?: string | null;
  status: Status;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  history?: ComplaintHistory[];
  overdueInfo?: OverdueInfo;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  isImportant: boolean;
  createdBy: string;
  author?: {
    id: string;
    name: string;
    role: Role;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardData {
  kpis: {
    totalComplaints: number;
    openCount: number;
    inProgressCount: number;
    resolvedCount: number;
    overdueCount: number;
    totalNotices: number;
    avgResolutionHours: number;
  };
  categoryDistribution: { name: string; count: number }[];
  priorityDistribution: { name: string; count: number }[];
  overdueQueue: {
    id: string;
    title: string;
    category: string;
    priority: Priority;
    status: Status;
    residentName: string;
    apartmentNo: string;
    createdAt: string;
    formattedOverdue: string;
  }[];
  insights: string[];
  overdueThresholdDays: number;
}

export interface ResidentDashboardData {
  kpis: {
    activeCount: number;
    openCount: number;
    inProgressCount: number;
    resolvedCount: number;
    overdueCount: number;
    totalSubmitted: number;
  };
  recentComplaints: Complaint[];
  latestNotices: Notice[];
}
