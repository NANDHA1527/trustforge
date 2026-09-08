const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('trustforge_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Authentication
  login: async (officerId: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officerId, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('trustforge_token', data.token);
      localStorage.setItem('trustforge_officer', JSON.stringify(data.officer));
    }
    return data;
  },

  getCurrentOfficer: () => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('trustforge_officer');
    if (!stored) {
      // Default fallback demo officer so UI is immediately usable
      return {
        officerId: 'TF-1024',
        name: 'Insp. Rajesh Sharma',
        role: 'Officer',
        checkpoint: 'Raxaul Border Post - Gate 3',
        department: 'SSB Police-II Division'
      };
    }
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('trustforge_token');
      localStorage.removeItem('trustforge_officer');
    }
  },

  // Verifications
  createVerification: async (payload: { documentType: string; scenarioType: string; subjectName?: string; subjectId?: string; file?: File }) => {
    if (payload.file) {
      const formData = new FormData();
      formData.append('document', payload.file);
      formData.append('documentType', payload.documentType);
      formData.append('scenarioType', payload.scenarioType);
      if (payload.subjectName) formData.append('subjectName', payload.subjectName);
      if (payload.subjectId) formData.append('subjectId', payload.subjectId);

      const token = typeof window !== 'undefined' ? localStorage.getItem('trustforge_token') : null;
      const res = await fetch(`${API_BASE_URL}/verifications`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });
      return res.json();
    }

    const res = await fetch(`${API_BASE_URL}/verifications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  processVerification: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/verifications/${id}/process`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getVerificationById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/verifications/${id}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getAllVerifications: async (params: { search?: string; status?: string; documentType?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.documentType) query.append('documentType', params.documentType);

    const res = await fetch(`${API_BASE_URL}/verifications?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  submitOfficerDecision: async (data: { verificationId: string; decision: string; reason?: string; notes?: string }) => {
    const res = await fetch(`${API_BASE_URL}/officer-decision`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Dashboard & Analytics
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getSuspiciousCases: async () => {
    const res = await fetch(`${API_BASE_URL}/suspicious-cases`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  addCaseNote: async (caseId: string, note: string) => {
    const res = await fetch(`${API_BASE_URL}/suspicious-cases/${caseId}/note`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ note })
    });
    return res.json();
  },

  // Blockchain Ledger
  getLedger: async () => {
    const res = await fetch(`${API_BASE_URL}/ledger`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  verifyLedger: async () => {
    const res = await fetch(`${API_BASE_URL}/integrity/verify`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Audit Logs
  getAuditLogs: async (params: { search?: string; action?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.action) query.append('action', params.action);

    const res = await fetch(`${API_BASE_URL}/audit?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Reports
  generateReport: async (verificationId?: string) => {
    const res = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ verificationId })
    });
    return res.json();
  }
};
