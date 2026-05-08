import {
  createContext,
  useState,
  useCallback,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import type { Lead } from "../types";
import {
  leadService,
  type DashboardStats,
  type LeadQuery,
  type Salesperson,
} from "../services/lead.service";

interface LeadContextType {
  leads: Lead[];
  stats: DashboardStats | null;
  salespeople: Salesperson[];
  isLoading: boolean;
  fetchLeads: (query?: LeadQuery) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSalespeople: () => Promise<void>;
  addLead: (
    lead: Omit<Lead, "id" | "createdAt" | "updatedAt" | "notes">,
  ) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  getLeadById: (id: string) => Promise<Lead | undefined>;
  addNote: (leadId: string, content: string) => Promise<void>;
  deleteNote: (leadId: string, noteId: string) => Promise<void>;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider = ({ children }: { children: ReactNode }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salespeople, setSalespeople] = useState<Salesperson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const initRef = useRef(false);

  const fetchLeads = useCallback(async (query?: LeadQuery) => {
    // Only set loading if we have a query (filtering/searching)
    if (query) {
      setIsLoading(true);
    }
    try {
      const data = await leadService.getLeads(query);
      setLeads(data);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      if (query) {
        setIsLoading(false);
      }
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await leadService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  }, []);

  const fetchSalespeople = useCallback(async () => {
    try {
      const data = await leadService.getSalespeople();
      setSalespeople(data);
    } catch (err) {
      console.error("Failed to fetch salespeople", err);
    }
  }, []);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // Initialize data on mount only
    const initializeData = async () => {
      await Promise.all([fetchLeads(), fetchStats(), fetchSalespeople()]);
      setIsLoading(false);
    };
    initializeData();
  }, [fetchLeads, fetchStats, fetchSalespeople]);

  const addLead = useCallback(
    async (
      leadData: Omit<Lead, "id" | "createdAt" | "updatedAt" | "notes">,
    ) => {
      setIsLoading(true);
      try {
        await leadService.createLead(leadData);
        await fetchLeads();
        await fetchStats();
      } catch (err) {
        console.error("Failed to add lead", err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchLeads, fetchStats],
  );

  const updateLead = useCallback(
    async (id: string, updates: Partial<Lead>) => {
      setIsLoading(true);
      try {
        await leadService.updateLead(id, updates);
        await fetchLeads();
        await fetchStats();
      } catch (err) {
        console.error("Failed to update lead", err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchLeads, fetchStats],
  );

  const deleteLead = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        await leadService.deleteLead(id);
        await fetchLeads();
        await fetchStats();
      } catch (err) {
        console.error("Failed to delete lead", err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchLeads, fetchStats],
  );

  const getLeadById = useCallback(async (id: string) => {
    try {
      return await leadService.getLeadById(id);
    } catch (err) {
      console.error("Failed to get lead", err);
      return undefined;
    }
  }, []);

  const addNote = useCallback(
    async (leadId: string, content: string) => {
      setIsLoading(true);
      try {
        await leadService.addNote(leadId, content);
        await fetchLeads();
      } catch (err) {
        console.error("Failed to add note", err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchLeads],
  );

  const deleteNote = useCallback(
    async (leadId: string, noteId: string) => {
      setIsLoading(true);
      try {
        await leadService.deleteNote(leadId, noteId);
        await fetchLeads();
      } catch (err) {
        console.error("Failed to delete note", err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchLeads],
  );

  return (
    <LeadContext.Provider
      value={{
        leads,
        stats,
        salespeople,
        isLoading,
        fetchLeads,
        fetchStats,
        fetchSalespeople,
        addLead,
        updateLead,
        deleteLead,
        getLeadById,
        addNote,
        deleteNote,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export { LeadContext };
