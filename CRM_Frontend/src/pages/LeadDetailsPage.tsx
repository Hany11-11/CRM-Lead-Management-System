import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Edit3,
  Mail,
  Phone,
  Building2,
  User,
  Calendar,
  DollarSign,
  Link2,
  Trash2,
  CheckCircle,
  ChevronRight,
  X,
  AlertCircle,
} from "lucide-react";
import { DashboardLayout } from "../components/templates/DashboardLayout";
import { NoteTimeline, LeadFormModal } from "../components/organisms";
import { Badge } from "../components/atoms/Badge";
import { Avatar } from "../components/atoms/Avatar";
import { Button } from "../components/atoms/Button";
import { Typography } from "../components/atoms/Typography";
import { formatCurrency, formatDate } from "../utils/helpers";
import { useLeads } from "../hooks/useLeads";
import { useAuth } from "../context/AuthContext";
import type { Lead, LeadStatus } from "../types";

const infoCard = (icon: React.ReactNode, label: string, value: string) => (
  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
    <div className="text-slate-400 mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-900 mt-0.5">{value}</p>
    </div>
  </div>
);

const allStatuses: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

const statusColors: Record<LeadStatus, string> = {
  New: "bg-blue-500",
  Contacted: "bg-sky-500",
  Qualified: "bg-violet-500",
  "Proposal Sent": "bg-amber-500",
  Won: "bg-emerald-500",
  Lost: "bg-red-500",
};

export const LeadDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { leads, getLeadById, updateLead, deleteLead, addNote, deleteNote } =
    useLeads();
  const [lead, setLead] = useState<Lead | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "info";
  } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    status: LeadStatus;
  } | null>(null);

  const fetchLead = useCallback(async () => {
    if (id) {
      setLoading(true);
      const data = await getLeadById(id);
      setLead(data);
      setLoading(false);
    }
  }, [id, getLeadById]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const daysInPipeline = useMemo(() => {
    if (!lead) return 0;
    return Math.floor(
      (new Date().getTime() - new Date(lead.createdAt).getTime()) /
        (1000 * 60 * 60 * 24),
    );
  }, [lead]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <div className="h-8 w-48 bg-slate-200 rounded mb-4" />
          <div className="h-4 w-64 bg-slate-200 rounded" />
        </div>
      </DashboardLayout>
    );
  }

  if (!lead) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Typography variant="h2" className="text-slate-400 mb-2">
            Lead not found
          </Typography>
          <Typography variant="body">
            The lead you're looking for doesn't exist.
          </Typography>
          <Button
            variant="primary"
            className="mt-6"
            onClick={() => navigate("/leads")}
          >
            Back to Leads
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleUpdate = async (
    data: Omit<Lead, "id" | "createdAt" | "updatedAt" | "notes">,
  ) => {
    if (lead) {
      await updateLead(lead.id, data);
      await fetchLead();
      setNotification({
        message: "✓ Lead updated successfully",
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (newStatus === lead.status) return;

    const currentIndex = allStatuses.indexOf(lead.status);
    const newIndex = allStatuses.indexOf(newStatus);

    // Prevent moving backwards in pipeline
    if (newIndex < currentIndex && newStatus !== "Lost") {
      setNotification({
        message: "⚠ Cannot move leads backwards in pipeline",
        type: "info",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Confirmation for final states
    if (
      (newStatus === "Won" || newStatus === "Lost") &&
      lead.status !== newStatus
    ) {
      setConfirmDialog({ status: newStatus });
      return;
    }

    await updateLead(lead.id, { status: newStatus });
    await fetchLead();
    setNotification({
      message: `✓ Status changed to ${newStatus}`,
      type: "success",
    });
    setShowStatusMenu(false);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleConfirmStatusChange = async (confirmed: boolean) => {
    if (confirmed && confirmDialog && lead) {
      await updateLead(lead.id, { status: confirmDialog.status });
      await fetchLead();
      setNotification({
        message: `✓ Status changed to ${confirmDialog.status}`,
        type: "success",
      });
      setShowStatusMenu(false);
      setTimeout(() => setNotification(null), 3000);
    }
    setConfirmDialog(null);
  };

  const handleDelete = async () => {
    if (lead && window.confirm("Are you sure you want to delete this lead?")) {
      await deleteLead(lead.id);
      navigate("/leads");
    }
  };

  const handleAddNote = async (content: string) => {
    if (lead && user) {
      await addNote(lead.id, content);
      await fetchLead();
      setNotification({
        message: "✓ Note added successfully",
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (lead) {
      await deleteNote(lead.id, noteId);
      await fetchLead();
    }
  };

  const currentStatusIndex = allStatuses.indexOf(lead.status);
  const nextStatus = allStatuses[currentStatusIndex + 1];

  return (
    <DashboardLayout>
      <AnimatePresence>
        {notification && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />
            {/* Alert Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-2xl shadow-2xl z-50 overflow-hidden ${
                notification.type === "success" ? "bg-white" : "bg-white"
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setNotification(null)}
                className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Close alert"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>

              <div className="p-8 flex flex-col items-center text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring", damping: 20 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    notification.type === "success"
                      ? "bg-emerald-100"
                      : "bg-blue-100"
                  }`}
                >
                  <CheckCircle
                    className={`w-8 h-8 ${
                      notification.type === "success"
                        ? "text-emerald-500"
                        : "text-blue-500"
                    }`}
                  />
                </motion.div>

                {/* Message */}
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`text-xl font-bold mb-2 ${
                    notification.type === "success"
                      ? "text-emerald-900"
                      : "text-blue-900"
                  }`}
                >
                  {notification.type === "success" ? "Success!" : "Notice"}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-sm text-slate-600"
                >
                  {notification.message}
                </motion.p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog for Final States */}
      <AnimatePresence>
        {confirmDialog && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setConfirmDialog(null)}
            />
            {/* Confirm Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-2xl shadow-2xl z-50 overflow-hidden bg-white"
            >
              <button
                onClick={() => setConfirmDialog(null)}
                className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>

              <div className="p-8 flex flex-col items-center text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring", damping: 20 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    confirmDialog.status === "Won"
                      ? "bg-emerald-100"
                      : "bg-red-100"
                  }`}
                >
                  <AlertCircle
                    className={`w-8 h-8 ${
                      confirmDialog.status === "Won"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold mb-2 text-slate-900"
                >
                  Mark as {confirmDialog.status}?
                </motion.h2>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-sm text-slate-600 mb-6"
                >
                  This is a final status and cannot be changed easily. Are you
                  sure?
                </motion.p>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-3 w-full"
                >
                  <button
                    onClick={() => setConfirmDialog(null)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleConfirmStatusChange(true)}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition-colors ${
                      confirmDialog.status === "Won"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    Yes, {confirmDialog.status}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/leads")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <Avatar name={lead.name} size="lg" />
              <div>
                <div className="flex items-center gap-3">
                  <Typography variant="h1">{lead.name}</Typography>
                  <Badge variant={lead.status}>{lead.status}</Badge>
                </div>
                <Typography variant="body" className="mt-0.5">
                  {lead.company}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="flex items-center gap-1"
              >
                <span>Change Status</span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${showStatusMenu ? "rotate-90" : ""}`}
                />
              </Button>

              <AnimatePresence>
                {showStatusMenu && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowStatusMenu(false)}
                      className="fixed inset-0 z-40"
                    />
                    {/* Dropdown Menu */}
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ type: "spring", damping: 20 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50"
                    >
                      <div className="p-2">
                        {allStatuses.map((status, idx) => {
                          const isCurrentStatus = status === lead.status;
                          const canSelect =
                            idx > currentStatusIndex ||
                            status === "Lost" ||
                            isCurrentStatus;

                          return (
                            <motion.button
                              key={status}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              onClick={() => handleStatusChange(status)}
                              disabled={!canSelect}
                              className={`w-full text-left px-4 py-2.5 rounded-lg mb-1 flex items-center gap-3 transition-all ${
                                isCurrentStatus
                                  ? "bg-indigo-100 text-indigo-900 font-medium"
                                  : canSelect
                                    ? "hover:bg-slate-100 cursor-pointer"
                                    : "opacity-40 cursor-not-allowed"
                              }`}
                            >
                              <div
                                className={`w-3 h-3 rounded-full ${statusColors[status]}`}
                              />
                              <span className="flex-1">{status}</span>
                              {isCurrentStatus && (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Edit3 className="w-4 h-4" />}
              onClick={() => setShowEditModal(true)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Pipeline Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
        >
          <Typography variant="h3" className="mb-4">
            Pipeline Progress
          </Typography>
          <div className="flex items-center justify-between gap-2 mb-4">
            {allStatuses.map((status, idx) => {
              const isComplete = idx < currentStatusIndex;
              const isCurrent = status === lead.status;
              const isLost = lead.status === "Lost";

              return (
                <motion.div key={status} className="flex-1">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleStatusChange(status)}
                    className={`p-3 rounded-lg text-center cursor-pointer transition-all ${
                      isComplete
                        ? "bg-emerald-100 text-emerald-900"
                        : isCurrent
                          ? `${statusColors[status]} text-white font-semibold ring-2 ring-offset-2 ring-slate-300`
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <p className="text-xs font-medium">{status}</p>
                  </motion.div>
                  {idx < allStatuses.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: idx * 0.1 + 0.2 }}
                      className={`h-1 mt-2 rounded origin-left ${
                        isComplete ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
          <p className="text-xs text-slate-500">
            Days in pipeline:{" "}
            <span className="font-semibold">{daysInPipeline}</span>
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Lead Info */}
          <div className="xl:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <Typography variant="h3" className="mb-4">
                Contact Information
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {infoCard(<Mail className="w-4 h-4" />, "Email", lead.email)}
                {infoCard(<Phone className="w-4 h-4" />, "Phone", lead.phone)}
                {infoCard(
                  <Building2 className="w-4 h-4" />,
                  "Company",
                  lead.company,
                )}
                {infoCard(
                  <User className="w-4 h-4" />,
                  "Salesperson",
                  lead.salesperson,
                )}
                {infoCard(
                  <DollarSign className="w-4 h-4" />,
                  "Estimated Value",
                  formatCurrency(lead.estimatedValue),
                )}
                {infoCard(<Link2 className="w-4 h-4" />, "Source", lead.source)}
                {infoCard(
                  <Calendar className="w-4 h-4" />,
                  "Created",
                  formatDate(lead.createdAt),
                )}
                {infoCard(
                  <Calendar className="w-4 h-4" />,
                  "Updated",
                  formatDate(lead.updatedAt),
                )}
              </div>
            </div>

            {/* Activity Timeline / Notes */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <Typography variant="h3" className="mb-4">
                Activity & Notes
              </Typography>
              <NoteTimeline
                notes={lead.notes}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
              />
            </div>
          </div>

          {/* Right Column - Quick Stats & Pipeline */}
          <div className="space-y-6">
            {/* Deal Summary */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <Typography variant="h3" className="mb-4">
                Deal Summary
              </Typography>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-500">Deal Value</span>
                    <span className="text-lg font-bold text-slate-900">
                      {formatCurrency(lead.estimatedValue)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((lead.estimatedValue / 100000) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-500">
                      Pipeline Stage
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {["New", "Contacted", "Qualified", "Proposal", "Won"].map(
                      (stage, idx) => {
                        const stages = [
                          "New",
                          "Contacted",
                          "Qualified",
                          "Proposal",
                          "Won",
                        ];
                        const currentIdx = stages.indexOf(lead.status);
                        const isActive =
                          idx <= currentIdx && lead.status !== "Lost";
                        const colors = [
                          "bg-blue-500",
                          "bg-sky-500",
                          "bg-violet-500",
                          "bg-amber-500",
                          "bg-emerald-500",
                        ];
                        return (
                          <div
                            key={stage}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              isActive ? colors[idx] : "bg-slate-200"
                            }`}
                          />
                        );
                      },
                    )}
                  </div>
                  <div className="flex justify-between mt-1">
                    {["New", "Contacted", "Qualified", "Proposal", "Won"].map(
                      (stage) => (
                        <span
                          key={stage}
                          className={`text-[10px] font-medium ${
                            lead.status === stage
                              ? "text-indigo-600"
                              : "text-slate-400"
                          }`}
                        >
                          {stage}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <Typography variant="h3" className="mb-4">
                Engagement
              </Typography>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Notes</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {lead.notes.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">
                    Days in Pipeline
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {daysInPipeline}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Last Updated</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatDate(lead.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <Typography variant="h3" className="mb-4">
                Quick Actions
              </Typography>
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  fullWidth
                  leftIcon={<Mail className="w-4 h-4" />}
                  onClick={() =>
                    (window.location.href = `mailto:${lead.email}`)
                  }
                >
                  Send Email
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  leftIcon={<Phone className="w-4 h-4" />}
                  onClick={() => (window.location.href = `tel:${lead.phone}`)}
                >
                  Call Lead
                </Button>
              </div>
            </div>
          </div>
        </div>

        <LeadFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdate}
          initialData={lead}
          salespeople={
            leads.length > 0
              ? [...new Set(leads.map((l) => l.salesperson))]
              : undefined
          }
        />
      </motion.div>
    </DashboardLayout>
  );
};
