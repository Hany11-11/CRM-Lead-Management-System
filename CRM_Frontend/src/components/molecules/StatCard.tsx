import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Typography } from "../atoms/Typography";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  color?: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  color = "bg-indigo-500",
}: StatCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Typography
            variant="body-sm"
            className="uppercase tracking-wider font-medium"
          >
            {title}
          </Typography>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
          >
            <Typography variant="h1" className="mt-2">
              {value}
            </Typography>
          </motion.div>
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-2 flex items-center gap-1"
            >
              <span
                className={`text-xs font-medium ${
                  trend.value >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value}%
              </span>
              <Typography variant="caption">{trend.label}</Typography>
            </motion.div>
          )}
        </div>
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", damping: 15 }}
          className={`${color} p-3 rounded-lg text-white`}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
};
