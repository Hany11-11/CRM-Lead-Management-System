import { type ReactNode } from "react";
import { motion } from "framer-motion";
import type { LeadStatus } from "../../types";

interface BadgeProps {
  children: ReactNode;
  variant?: LeadStatus | "default";
  size?: "sm" | "md";
}

const statusStyles: Record<string, string> = {
  New: "bg-blue-100 text-blue-700 border-blue-200",
  Contacted: "bg-sky-100 text-sky-700 border-sky-200",
  Qualified: "bg-violet-100 text-violet-700 border-violet-200",
  "Proposal Sent": "bg-amber-100 text-amber-700 border-amber-200",
  Won: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Lost: "bg-red-100 text-red-700 border-red-200",
  default: "bg-slate-100 text-slate-700 border-slate-200",
};

const sizeStyles: Record<string, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

export const Badge = ({
  children,
  variant = "default",
  size = "md",
}: BadgeProps) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", damping: 20 }}
      className={`
        inline-flex items-center font-medium rounded-full border
        ${statusStyles[variant] || statusStyles.default}
        ${sizeStyles[size]}
      `}
    >
      {children}
    </motion.span>
  );
};
