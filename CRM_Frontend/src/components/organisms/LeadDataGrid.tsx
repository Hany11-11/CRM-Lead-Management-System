import { useState, useMemo, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, ArrowUp, ArrowDown, Eye, Trash2 } from "lucide-react";
import type { Lead } from "../../types";
import { Badge } from "../atoms/Badge";
import { Avatar } from "../atoms/Avatar";
import { Button } from "../atoms/Button";
import { formatCurrency, formatRelativeDate } from "../../utils/helpers";
import { useLeads } from "../../hooks/useLeads";

type SortKey = keyof Pick<
  Lead,
  "name" | "company" | "status" | "estimatedValue" | "createdAt"
>;
type SortDirection = "asc" | "desc";

interface LeadDataGridProps {
  leads: Lead[];
  statusFilter: string;
  sourceFilter: string;
  salespersonFilter: string;
  searchQuery: string;
}

const getSortIcon = (
  sortKey: SortKey,
  sortDirection: SortDirection,
  column: SortKey,
): ReactNode => {
  if (sortKey !== column)
    return <ArrowUpDown className="w-4 h-4 text-slate-400" />;
  return sortDirection === "asc" ? (
    <ArrowUp className="w-4 h-4 text-indigo-600" />
  ) : (
    <ArrowDown className="w-4 h-4 text-indigo-600" />
  );
};

export const LeadDataGrid = ({
  leads,
  statusFilter,
  sourceFilter,
  salespersonFilter,
  searchQuery,
}: LeadDataGridProps) => {
  const navigate = useNavigate();
  const { deleteLead } = useLeads();
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    let result = [...leads];

    if (statusFilter) {
      result = result.filter((l) => l.status === statusFilter);
    }
    if (sourceFilter) {
      result = result.filter((l) => l.source === sourceFilter);
    }
    if (salespersonFilter) {
      result = result.filter((l) => l.salesperson === salespersonFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.company.toLowerCase().includes(query) ||
          l.email.toLowerCase().includes(query),
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal);
      const bStr = String(bVal);
      const cmp = aStr.localeCompare(bStr);
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return result;
  }, [
    leads,
    statusFilter,
    sourceFilter,
    salespersonFilter,
    searchQuery,
    sortKey,
    sortDirection,
  ]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      deleteLead(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-6 py-3">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors"
                >
                  Lead {getSortIcon(sortKey, sortDirection, "name")}
                </button>
              </th>
              <th className="text-left px-6 py-3">
                <button
                  onClick={() => handleSort("company")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors"
                >
                  Company {getSortIcon(sortKey, sortDirection, "company")}
                </button>
              </th>
              <th className="text-left px-6 py-3 hidden lg:table-cell">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Source
                </span>
              </th>
              <th className="text-left px-6 py-3">
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors"
                >
                  Status {getSortIcon(sortKey, sortDirection, "status")}
                </button>
              </th>
              <th className="text-left px-6 py-3 hidden md:table-cell">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Salesperson
                </span>
              </th>
              <th className="text-right px-6 py-3">
                <button
                  onClick={() => handleSort("estimatedValue")}
                  className="flex items-center gap-1.5 justify-end text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors w-full"
                >
                  Value {getSortIcon(sortKey, sortDirection, "estimatedValue")}
                </button>
              </th>
              <th className="text-right px-6 py-3 hidden sm:table-cell">
                <button
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center gap-1.5 justify-end text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors w-full"
                >
                  Created {getSortIcon(sortKey, sortDirection, "createdAt")}
                </button>
              </th>
              <th className="w-24 px-6 py-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-400"
                  >
                    <svg
                      className="w-12 h-12 mx-auto mb-4 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-sm font-medium">No leads found</p>
                    <p className="text-xs mt-1">Try adjusting your filters</p>
                  </motion.div>
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredLeads.map((lead, idx) => (
                  <motion.tr
                    key={lead.id}
                    layout
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{
                      delay: idx * 0.05,
                      type: "spring",
                      damping: 25,
                    }}
                    whileHover={{ backgroundColor: "rgba(15, 23, 42, 0.03)" }}
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={lead.name} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {lead.name}
                          </p>
                          <p className="text-xs text-slate-500">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">
                        {lead.company}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-slate-600">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={lead.status}>{lead.status}</Badge>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-slate-600">
                        {lead.salesperson}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-medium text-slate-900">
                        {formatCurrency(lead.estimatedValue)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right hidden sm:table-cell">
                      <span className="text-xs text-slate-500">
                        {formatRelativeDate(lead.createdAt)}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/leads/${lead.id}`)}
                          className="p-1.5!"
                          aria-label="View lead"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(lead.id)}
                          className={`p-1.5! ${confirmDelete === lead.id ? "text-red-600 bg-red-50" : ""}`}
                          aria-label={
                            confirmDelete === lead.id
                              ? "Confirm delete"
                              : "Delete lead"
                          }
                          title={
                            confirmDelete === lead.id
                              ? "Click again to confirm"
                              : "Delete"
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
      {filteredLeads.length > 0 && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
          <span className="text-xs text-slate-500">
            Showing {filteredLeads.length} of {leads.length} leads
          </span>
        </div>
      )}
    </div>
  );
};
