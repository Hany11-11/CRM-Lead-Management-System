export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Proposal Sent"
  | "Won"
  | "Lost";
export type LeadSource =
  | "Website"
  | "LinkedIn"
  | "Cold Email"
  | "Referral"
  | "Conference"
  | "Other";

export interface Note {
  id: string;
  leadId: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  salesperson: string;
  status: LeadStatus;
  estimatedValue: number;
  createdAt: string;
  updatedAt: string;
  notes: Note[];
}

export interface User {
  email: string;
  name: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface KPIStats {
  totalLeads: number;
  wonDeals: number;
  pipelineValue: number;
  conversionRate: number;
}
