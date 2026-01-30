import axios from 'axios';
import type {
  PaginatedIncidents,
  SummaryStats,
  StatItem,
  MonthlyTrend,
  FilterParams,
  Incident,
  ActionCauseDetails,
} from '../types/incident.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Incidents CRUD
export const incidentsApi = {
  // Get paginated incidents with filters
  getAll: async (params: FilterParams = {}): Promise<PaginatedIncidents> => {
    const { data } = await api.get('/incidents', { params });
    return data;
  },

  // Get single incident
  getById: async (id: string): Promise<Incident> => {
    const { data } = await api.get(`/incidents/${id}`);
    return data;
  },

  // Create incident
  create: async (incident: Partial<Incident>): Promise<Incident> => {
    const { data } = await api.post('/incidents', incident);
    return data;
  },

  // Update incident
  update: async (id: string, incident: Partial<Incident>): Promise<Incident> => {
    const { data } = await api.put(`/incidents/${id}`, incident);
    return data;
  },

  // Delete incident
  delete: async (id: string): Promise<void> => {
    await api.delete(`/incidents/${id}`);
  },

  // Statistics endpoints
  getSummary: async (): Promise<SummaryStats> => {
    const { data } = await api.get('/incidents/stats/summary');
    return data;
  },

  getBySeverity: async (): Promise<StatItem[]> => {
    const { data } = await api.get('/incidents/stats/by-severity');
    return data;
  },

  getByRegion: async (): Promise<StatItem[]> => {
    const { data } = await api.get('/incidents/stats/by-region');
    return data;
  },

  getByMonth: async (): Promise<MonthlyTrend[]> => {
    const { data } = await api.get('/incidents/stats/by-month');
    return data;
  },

  getByActionCause: async (): Promise<StatItem[]> => {
    const { data } = await api.get('/incidents/stats/by-action-cause');
    return data;
  },

  getByGbu: async (): Promise<StatItem[]> => {
    const { data } = await api.get('/incidents/stats/by-gbu');
    return data;
  },

  getByBehaviorType: async (): Promise<StatItem[]> => {
    const { data } = await api.get('/incidents/stats/by-behavior-type');
    return data;
  },

  getByActionCauseDetails: async (): Promise<ActionCauseDetails[]> => {
    const { data } = await api.get('/incidents/stats/by-action-cause-details');
    return data;
  },
};

export default api;
