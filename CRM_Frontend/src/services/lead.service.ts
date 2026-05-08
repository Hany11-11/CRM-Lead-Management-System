import api from "./api";
import type { Lead, Note } from "../types";

// ── Types ────────────────────────────────────────────────────────────────────
/**
 * Salesperson object
 */
export interface Salesperson {
  id: number;
  name: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
// MongoDB returns _id; map it to id so the frontend types stay consistent.
const mapLead = (raw: Record<string, unknown>): Lead => {
  const notes = (raw.notes as Record<string, unknown>[]) ?? [];
  return {
    id: (raw._id as string) ?? (raw.id as string),
    name: raw.name as string,
    company: raw.company as string,
    email: raw.email as string,
    phone: raw.phone as string,
    source: raw.source as string,
    salesperson: raw.salesperson as string,
    status: raw.status as string,
    estimatedValue: raw.estimatedValue as number,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
    notes: notes.map(
      (n: Record<string, unknown>): Note => ({
        id: (n._id as string) ?? (n.id as string),
        leadId: n.leadId as string,
        content: n.content as string,
        author: n.author as string,
        createdAt: n.createdAt as string,
      }),
    ),
  } as Lead;
};

// ── Query params type ────────────────────────────────────────────────────────
export interface LeadQuery {
  search?: string;
  status?: string;
  source?: string;
  salesperson?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  totalLeads: number;
  wonDeals: number;
  wonValue: number;
  pipelineValue: number;
  conversionRate: number;
  byStatus: Record<string, number>;
  topSalespeople: { _id: string; count: number; totalValue: number }[];
}

// ── Service ──────────────────────────────────────────────────────────────────
export const leadService = {
  /**
   * Fetch all leads with optional search/filter/sort/pagination.
   */
  getLeads: async (query: LeadQuery = {}): Promise<Lead[]> => {
    const res = await api.get<{ data: { leads: Record<string, unknown>[] } }>(
      "/leads",
      {
        params: query,
      },
    );
    return res.data.data.leads.map(mapLead);
  },

  /**
   * Fetch a single lead by id.
   */
  getLeadById: async (id: string): Promise<Lead> => {
    const res = await api.get<{ data: Record<string, unknown> }>(
      `/leads/${id}`,
    );
    return mapLead(res.data.data);
  },

  /**
   * Create a new lead.
   */
  createLead: async (
    data: Omit<Lead, "id" | "createdAt" | "updatedAt" | "notes">,
  ): Promise<Lead> => {
    const res = await api.post<{ data: Record<string, unknown> }>(
      "/leads",
      data,
    );
    return mapLead(res.data.data);
  },

  /**
   * Update an existing lead (partial updates supported).
   */
  updateLead: async (id: string, updates: Partial<Lead>): Promise<Lead> => {
    const res = await api.put<{ data: Record<string, unknown> }>(
      `/leads/${id}`,
      updates,
    );
    return mapLead(res.data.data);
  },

  /**
   * Delete a lead by id.
   */
  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  /**
   * Add a note to a lead.
   */
  addNote: async (leadId: string, content: string): Promise<Lead> => {
    const res = await api.post<{ data: Record<string, unknown> }>(
      `/leads/${leadId}/notes`,
      {
        content,
      },
    );
    return mapLead(res.data.data);
  },

  /**
   * Delete a specific note from a lead.
   */
  deleteNote: async (leadId: string, noteId: string): Promise<Lead> => {
    const res = await api.delete<{ data: Record<string, unknown> }>(
      `/leads/${leadId}/notes/${noteId}`,
    );
    return mapLead(res.data.data);
  },

  /**
   * Fetch dashboard KPI stats from the aggregation endpoint.
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await api.get<{ data: DashboardStats }>("/leads/stats");
    return res.data.data;
  },

  /**
   * Fetch list of all available salespeople.
   */
  getSalespeople: async (): Promise<Salesperson[]> => {
    const res = await api.get<{ data: Salesperson[] }>("/leads/salespeople");
    return res.data.data;
  },
};
