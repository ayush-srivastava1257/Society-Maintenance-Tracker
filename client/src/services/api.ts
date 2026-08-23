import {
  User,
  Complaint,
  Notice,
  AdminDashboardData,
  ResidentDashboardData,
  Status,
  Priority,
} from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('societyos_token');
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  return data;
};

export const api = {
  // AUTH
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  register: async (payload: {
    name: string;
    email: string;
    password: string;
    apartmentNo?: string;
    role?: 'RESIDENT' | 'ADMIN';
  }): Promise<{ token: string; user: User }> => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(res);
  },

  getMe: async (): Promise<{ user: User }> => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // COMPLAINTS
  createComplaint: async (formData: FormData): Promise<{ complaint: Complaint }> => {
    const res = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return handleResponse(res);
  },

  getMyComplaints: async (): Promise<{ complaints: Complaint[] }> => {
    const res = await fetch(`${API_BASE_URL}/complaints/my`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getAllComplaints: async (filters?: {
    category?: string;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<{ complaints: Complaint[] }> => {
    const query = new URLSearchParams();
    if (filters?.category) query.append('category', filters.category);
    if (filters?.status) query.append('status', filters.status);
    if (filters?.priority) query.append('priority', filters.priority);
    if (filters?.search) query.append('search', filters.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/complaints${queryString}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getComplaintById: async (id: string): Promise<{ complaint: Complaint }> => {
    const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateComplaintStatus: async (
    id: string,
    status: Status,
    note?: string
  ): Promise<{ message: string; complaint: Complaint }> => {
    const res = await fetch(`${API_BASE_URL}/complaints/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, note }),
    });
    return handleResponse(res);
  },

  updateComplaintPriority: async (
    id: string,
    priority: Priority
  ): Promise<{ message: string; complaint: Complaint }> => {
    const res = await fetch(`${API_BASE_URL}/complaints/${id}/priority`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ priority }),
    });
    return handleResponse(res);
  },

  // NOTICES
  getAllNotices: async (): Promise<{ notices: Notice[] }> => {
    const res = await fetch(`${API_BASE_URL}/notices`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createNotice: async (payload: {
    title: string;
    content: string;
    isImportant?: boolean;
  }): Promise<{ message: string; notice: Notice }> => {
    const res = await fetch(`${API_BASE_URL}/notices`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  updateNotice: async (
    id: string,
    payload: { title?: string; content?: string; isImportant?: boolean }
  ): Promise<{ message: string; notice: Notice }> => {
    const res = await fetch(`${API_BASE_URL}/notices/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  deleteNotice: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE_URL}/notices/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // DASHBOARD
  getAdminDashboard: async (): Promise<AdminDashboardData> => {
    const res = await fetch(`${API_BASE_URL}/dashboard/admin`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getResidentDashboard: async (): Promise<ResidentDashboardData> => {
    const res = await fetch(`${API_BASE_URL}/dashboard/resident`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // SETTINGS
  getSettings: async (): Promise<{ settings: Record<string, string> }> => {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateSettings: async (payload: {
    overdueThresholdDays?: number;
    emailNotificationsEnabled?: boolean;
    importantNoticeEmailEnabled?: boolean;
  }): Promise<{ message: string; settings: Record<string, string> }> => {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
};
