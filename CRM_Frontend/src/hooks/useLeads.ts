import { useContext } from "react";
import { LeadContext } from "../context/LeadContext";
import type { Lead } from "../types";

/**
 * Custom hook to access lead management functionality from context
 * @throws {Error} If used outside of LeadProvider
 * @returns {Object} Lead context with leads, stats, loading state, and operations
 */
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error("useLeads must be used within a LeadProvider");
  }
  return context;
};
