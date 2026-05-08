import { useNavigate } from "react-router-dom";
import { TrendingUp, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { DashboardLayout } from "../components/templates/DashboardLayout";
import { DashboardStatsGrid } from "../components/organisms/DashboardStatsGrid";
import { Badge } from "../components/atoms/Badge";
import { Avatar } from "../components/atoms/Avatar";
import { Button } from "../components/atoms/Button";
import { Typography } from "../components/atoms/Typography";
import { formatCurrency, formatRelativeDate } from "../utils/helpers";
import { useLeads } from "../hooks/useLeads";
import type { LeadStatus } from "../types";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const statusPipeline: { status: LeadStatus; color: string }[] = [
  { status: "New", color: "bg-blue-500" },
  { status: "Contacted", color: "bg-sky-500" },
  { status: "Qualified", color: "bg-violet-500" },
  { status: "Proposal Sent", color: "bg-amber-500" },
  { status: "Won", color: "bg-emerald-500" },
  { status: "Lost", color: "bg-red-500" },
];

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { leads, stats, isLoading } = useLeads();

  if (isLoading || !stats) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-slate-200 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  const recentLeads = [...leads]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <DashboardLayout title="Dashboard">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <motion.div variants={item}>
          <DashboardStatsGrid stats={stats} />
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div variants={item} className="xl:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-slate-500" />
                  <Typography variant="h3">Recent Leads</Typography>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/leads")}
                >
                  View all
                </Button>
              </div>
              <div className="divide-y divide-slate-100">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/leads/${lead.id}`)}
                  >
                    <Avatar name={lead.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {lead.name}
                      </p>
                      <p className="text-xs text-slate-500">{lead.company}</p>
                    </div>
                    <Badge variant={lead.status} size="sm">
                      {lead.status}
                    </Badge>
                    <span className="text-sm font-medium text-slate-900 hidden sm:block">
                      {formatCurrency(lead.estimatedValue)}
                    </span>
                    <span className="text-xs text-slate-400 hidden md:block">
                      {formatRelativeDate(lead.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-slate-500" />
                <Typography variant="h3">Pipeline</Typography>
              </div>
              <div className="space-y-3">
                {statusPipeline.map(({ status, color }) => (
                  <div key={status} className="flex items-center gap-3">
                    <div className={`w-2 h-8 rounded-full ${color}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">{status}</span>
                        <span className="text-sm font-medium text-slate-900">
                          {stats.byStatus[status] || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};
