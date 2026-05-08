import { useState, useEffect } from "react";
import { Plus, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { DashboardLayout } from "../components/templates/DashboardLayout";
import { LeadDataGrid, LeadFormModal } from "../components/organisms";
import { SearchInput, FilterDropdown } from "../components/molecules";
import { Button } from "../components/atoms/Button";
import { useLeads } from "../hooks/useLeads";
import type { Lead } from "../types";

const statusOptions: { value: string; label: string }[] = [
  { value: "New", label: "New" },
  { value: "Contacted", label: "Contacted" },
  { value: "Qualified", label: "Qualified" },
  { value: "Proposal Sent", label: "Proposal Sent" },
  { value: "Won", label: "Won" },
  { value: "Lost", label: "Lost" },
];

const sourceOptions: { value: string; label: string }[] = [
  { value: "Website", label: "Website" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Cold Email", label: "Cold Email" },
  { value: "Referral", label: "Referral" },
  { value: "Conference", label: "Conference" },
  { value: "Other", label: "Other" },
];

export const LeadListPage = () => {
  const { leads, salespeople, isLoading, addLead, fetchLeads } = useLeads();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [salespersonFilter, setSalespersonFilter] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "info";
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads({
        search: searchQuery,
        status: statusFilter,
        source: sourceFilter,
        salesperson: salespersonFilter,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, sourceFilter, salespersonFilter, fetchLeads]);

  const handleAddLead = async (
    data: Omit<Lead, "id" | "createdAt" | "updatedAt" | "notes">,
  ) => {
    await addLead(data);
    setNotification({
      message: `✓ Lead "${data.name}" created successfully`,
      type: "success",
    });
    setTimeout(() => setNotification(null), 3000);
    setShowModal(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Leads">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-slate-200 rounded-lg" />
          <div className="h-96 bg-slate-200 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Lead Management">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Notification Toast */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
          >
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-sm font-medium text-emerald-800">
              {notification.message}
            </p>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className="flex-1"
          />
          <div className="flex gap-2 flex-wrap">
            <FilterDropdown
              label="Status:"
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <FilterDropdown
              label="Source:"
              options={sourceOptions}
              value={sourceFilter}
              onChange={setSourceFilter}
            />
            <FilterDropdown
              label="Sales:"
              options={salespeople.map((s) => ({
                value: s.name,
                label: s.name,
              }))}
              value={salespersonFilter}
              onChange={setSalespersonFilter}
            />
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowModal(true)}
            >
              Add Lead
            </Button>
          </div>
        </div>

        <LeadDataGrid
          leads={leads}
          statusFilter={statusFilter}
          sourceFilter={sourceFilter}
          salespersonFilter={salespersonFilter}
          searchQuery={searchQuery}
        />

        <LeadFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddLead}
          salespeople={salespeople}
        />
      </motion.div>
    </DashboardLayout>
  );
};
