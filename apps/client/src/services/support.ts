import axios from 'axios';
import { getToken } from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  created_at: string;
  updated_at: string;
  user?: {
    id_user: string;
    full_name: string;
    username: string;
  };
}

export const supportService = {
  getTickets: async () => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/support`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.supportTickets as SupportTicket[];
  },

  createTicket: async (data: { title: string; description: string; priority: string }) => {
    const token = getToken();
    const response = await axios.post(`${API_URL}/support`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.supportTicket as SupportTicket;
  },

  updateTicketStatus: async (id: string, status: string) => {
    const token = getToken();
    const response = await axios.patch(`${API_URL}/support/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.supportTicket as SupportTicket;
  },
};
