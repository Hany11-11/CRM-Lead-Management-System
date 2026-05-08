import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Lead, LeadStatus, LeadSource } from "../../types";
import { FormField } from "../molecules/FormField";
import { Button } from "../atoms/Button";
import { Typography } from "../atoms/Typography";
import type { Salesperson } from "../../services/lead.service";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<Lead, "id" | "createdAt" | "updatedAt" | "notes">,
  ) => void;
  initialData?: Lead | null;
  salespeople?: Salesperson[];
}

const statusOptions: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];
const sourceOptions: LeadSource[] = [
  "Website",
  "LinkedIn",
  "Cold Email",
  "Referral",
  "Conference",
  "Other",
];
interface FormContentProps {
  initialData?: Lead | null;
  onSubmit: (
    data: Omit<Lead, "id" | "createdAt" | "updatedAt" | "notes">,
  ) => void;
  onCancel: () => void;
  salespeople?: Salesperson[];
}

const DEFAULT_SALESPEOPLE: Salesperson[] = [
  { id: 1, name: "Alex Johnson" },
  { id: 2, name: "Emily Davis" },
  { id: 3, name: "Ryan Martinez" },
];

const FormContent = ({
  initialData,
  onSubmit,
  onCancel,
  salespeople = DEFAULT_SALESPEOPLE,
}: FormContentProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name ?? "",
    company: initialData?.company ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    source: initialData?.source ?? ("Website" as LeadSource),
    salesperson: initialData?.salesperson ?? (salespeople[0]?.name || ""),
    status: initialData?.status ?? ("New" as LeadStatus),
    estimatedValue: initialData?.estimatedValue ?? 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.company.trim()) newErrors.company = "Company is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (formData.estimatedValue < 0)
      newErrors.estimatedValue = "Value must be positive";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSubmit(formData);
    setIsSubmitting(false);
    onCancel();
  };

  const updateField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <>
      <form className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-140px)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Full Name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            error={errors.name}
            required
            placeholder="John Doe"
          />
          <FormField
            label="Company"
            value={formData.company}
            onChange={(e) => updateField("company", e.target.value)}
            error={errors.company}
            required
            placeholder="Acme Inc."
          />
          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            error={errors.email}
            required
            placeholder="john@acme.com"
          />
          <FormField
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            error={errors.phone}
            required
            placeholder="+1 (555) 000-0000"
          />
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">
              Source <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.source}
              onChange={(e) => updateField("source", e.target.value)}
              className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                hover:border-slate-400 transition-all"
            >
              {sourceOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">
              Salesperson <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.salesperson}
              onChange={(e) => updateField("salesperson", e.target.value)}
              className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                hover:border-slate-400 transition-all"
            >
              {salespeople.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                hover:border-slate-400 transition-all"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <FormField
            label="Estimated Value ($)"
            type="number"
            min="0"
            value={formData.estimatedValue}
            onChange={(e) =>
              updateField("estimatedValue", Number(e.target.value))
            }
            error={errors.estimatedValue}
            required
            placeholder="0"
          />
        </div>
      </form>

      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit as never}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {initialData ? "Update Lead" : "Create Lead"}
        </Button>
      </div>
    </>
  );
};

export const LeadFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  salespeople,
}: LeadFormModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <Typography variant="h2">
                  {initialData ? "Edit Lead" : "Add New Lead"}
                </Typography>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <FormContent
                key={`${initialData?.id ?? "new"}-${isOpen}`}
                initialData={initialData}
                onSubmit={onSubmit}
                onCancel={onClose}
                salespeople={salespeople}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
