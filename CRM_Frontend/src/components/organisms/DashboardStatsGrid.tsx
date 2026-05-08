import {
  Users,
  Trophy,
  DollarSign,
  TrendingUp,
  Star,
  X,
  Target,
  Zap,
} from "lucide-react";
import { StatCard } from "../molecules/StatCard";
import { formatCurrency } from "../../utils/helpers";
import type { DashboardStats } from "../../services/lead.service";

interface DashboardStatsGridProps {
  stats: DashboardStats;
}

export const DashboardStatsGrid = ({ stats }: DashboardStatsGridProps) => {
  const {
    totalLeads,
    wonDeals,
    wonValue,
    pipelineValue,
    conversionRate,
    byStatus,
  } = stats;
  const newLeads = byStatus["New"] || 0;
  const qualifiedLeads = byStatus["Qualified"] || 0;
  const lostLeads = byStatus["Lost"] || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard
        title="Total Leads"
        value={totalLeads}
        icon={<Users className="w-6 h-6" />}
        color="bg-indigo-500"
      />
      <StatCard
        title="New Leads"
        value={newLeads}
        icon={<Star className="w-6 h-6" />}
        color="bg-blue-500"
      />
      <StatCard
        title="Qualified Leads"
        value={qualifiedLeads}
        icon={<Target className="w-6 h-6" />}
        color="bg-cyan-500"
      />
      <StatCard
        title="Won Leads"
        value={wonDeals}
        icon={<Trophy className="w-6 h-6" />}
        color="bg-emerald-500"
      />
      <StatCard
        title="Lost Leads"
        value={lostLeads}
        icon={<X className="w-6 h-6" />}
        color="bg-red-500"
      />
      <StatCard
        title="Pipeline Value"
        value={formatCurrency(pipelineValue)}
        icon={<DollarSign className="w-6 h-6" />}
        color="bg-violet-500"
      />
      <StatCard
        title="Won Value"
        value={formatCurrency(wonValue)}
        icon={<Zap className="w-6 h-6" />}
        color="bg-yellow-500"
      />
      <StatCard
        title="Conversion Rate"
        value={`${conversionRate}%`}
        icon={<TrendingUp className="w-6 h-6" />}
        color="bg-amber-500"
      />
    </div>
  );
};
