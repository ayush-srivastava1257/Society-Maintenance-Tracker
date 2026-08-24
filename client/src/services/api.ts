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
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await res.text();
    if (res.status === 404) {
      throw new Error(
        'Backend server endpoint not found. Please set VITE_API_BASE_URL in Vercel environment variables to your Render API URL (e.g. https://your-app.onrender.com/api).'
      );
    }
    throw new Error(`Server returned non-JSON response (${res.status}): ${text.substring(0, 100)}`);
  }

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
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    apartmentNo: string;
  }): Promise<{ token: string; user: User }> => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(),
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
  getComplaints: async (filters?: {
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
    overdueOnly?: boolean;
  }): Promise<{ complaints: Complaint[] }> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      if (filters.overdueOnly) params.append('overdueOnly', 'true');
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/complaints${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, { headers: getHeaders() });
    return handleResponse(res);
  },

  getMyComplaints: async (): Promise<{ complaints: Complaint[] }> => {
    const res = await fetch(`${API_BASE_URL}/complaints/my`, {
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

  createComplaint: async (formData: FormData): Promise<{ complaint: Complaint }> => {
    const res = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return handleResponse(res);
  },

  updateComplaintStatus: async (
    id: string,
    status: Status,
    note?: string
  ): Promise<{ complaint: Complaint }> => {
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
  ): Promise<{ complaint: Complaint }> => {
    const res = await fetch(`${API_BASE_URL}/complaints/${id}/priority`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ priority }),
    });
    return handleResponse(res);
  },

  // NOTICES
  getNotices: async (): Promise<{ notices: Notice[] }> => {
    const res = await fetch(`${API_BASE_URL}/notices`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createNotice: async (noticeData: {
    title: string;
    content: string;
    isImportant?: boolean;
  }): Promise<{ notice: Notice }> => {
    const res = await fetch(`${API_BASE_URL}/notices`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(noticeData),
    });
    return handleResponse(res);
  },

  updateNotice: async (
    id: string,
    noticeData: {
      title?: string;
      content?: string;
      isImportant?: boolean;
    }
  ): Promise<{ notice: Notice }> => {
    const res = await fetch(`${API_BASE_URL}/notices/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(noticeData),
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
  getSettings: async (): Promise<{ thresholdDays: number }> => {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateSettings: async (thresholdDays: number): Promise<{ thresholdDays: number }> => {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ thresholdDays }),
    });
    return handleResponse(res);
  },
};
