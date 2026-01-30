import { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { KpiCard } from '../components/cards/KpiCard';
import {
  SeverityDonutChart,
  RegionBarChart,
  MonthlyTrendChart,
  ActionCauseChart,
  BehaviorPieChart,
} from '../components/charts';
import { incidentsApi } from '../api/incidents.api';
import type { SummaryStats, StatItem, MonthlyTrend, ActionCauseDetails } from '../types/incident.types';

// Professional SVG Icons
const ChartBarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="12" width="4" height="8" rx="1" />
    <rect x="10" y="8" width="4" height="12" rx="1" />
    <rect x="17" y="4" width="4" height="16" rx="1" />
  </svg>
);

const CarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/>
    <path d="M15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/>
    <path d="M5 17H3v-4l2-5h10l4 5h2v4h-2"/>
    <path d="M5 12h14"/>
  </svg>
);

const BuildingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01"/>
    <path d="M16 6h.01"/>
    <path d="M12 6h.01"/>
    <path d="M12 10h.01"/>
    <path d="M12 14h.01"/>
    <path d="M16 10h.01"/>
    <path d="M16 14h.01"/>
    <path d="M8 10h.01"/>
    <path d="M8 14h.01"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#FBBF24" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="#92400E"/>
    <circle cx="12" cy="17" r="0.5" fill="#92400E"/>
  </svg>
);

export function DashboardPage() {
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [severityData, setSeverityData] = useState<StatItem[]>([]);
  const [regionData, setRegionData] = useState<StatItem[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyTrend[]>([]);
  const [actionCauseData, setActionCauseData] = useState<ActionCauseDetails[]>([]);
  const [behaviorData, setBehaviorData] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          summaryRes,
          severityRes,
          regionRes,
          monthlyRes,
          actionCauseRes,
          behaviorRes,
        ] = await Promise.all([
          incidentsApi.getSummary(),
          incidentsApi.getBySeverity(),
          incidentsApi.getByRegion(),
          incidentsApi.getByMonth(),
          incidentsApi.getByActionCauseDetails(),
          incidentsApi.getByBehaviorType(),
        ]);

        setSummary(summaryRes);
        setSeverityData(severityRes);
        setRegionData(regionRes);
        setMonthlyData(monthlyRes);
        setActionCauseData(actionCauseRes);
        setBehaviorData(behaviorRes);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const highSeverityCount = severityData
    .filter((s) => {
      const level = parseInt(s.label.replace('Level ', ''));
      return level >= 3;
    })
    .reduce((sum, s) => sum + s.value, 0);

  return (
    <>
      <Header title="Dashboard" subtitle="Near Miss Incident Analytics" />
      <div className="page-content">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 mb-lg">
          <KpiCard
            title="Total Incidents"
            value={summary?.totalIncidents || 0}
            icon={<ChartBarIcon />}
          />
          <KpiCard
            title="LCV Incidents"
            value={summary?.lcvCount || 0}
            icon={<CarIcon />}
            variant="orange"
          />
          <KpiCard
            title="Non-LCV Incidents"
            value={summary?.nonLcvCount || 0}
            icon={<BuildingIcon />}
            variant="purple"
          />
          <KpiCard
            title="High Severity"
            value={highSeverityCount}
            icon={<WarningIcon />}
            variant="yellow"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 mb-lg">
          <SeverityDonutChart data={severityData} loading={loading} />
          <RegionBarChart data={regionData} loading={loading} />
        </div>

        {/* Charts Row 2 - Full width trend chart */}
        <div className="mb-lg">
          <MonthlyTrendChart data={monthlyData} loading={loading} />
        </div>

        {/* Charts Row 3 - Action Cause Chart (Full Width) */}
        <div className="mb-lg">
          <ActionCauseChart data={actionCauseData} loading={loading} />
        </div>

        {/* Charts Row 4 - Behavior Pie Chart */}
        <div className="grid grid-cols-2">
          <BehaviorPieChart data={behaviorData} loading={loading} />
          {/* Placeholder for layout balance or remove grid-cols-2 if full width desired */}
        </div>
      </div>
    </>
  );
}
