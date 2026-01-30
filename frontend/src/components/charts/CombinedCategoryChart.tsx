import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { commonChartOptions } from '../../utils/chartConfig';
import { LayersIcon } from '../common/Icons';
import { StatItem } from '../../types/incident.types';

// Colors from colour.txt palette
const CHART_COLORS = [
  '#EE7674', // Red
  '#F9B5AC', // Light coral
  '#D0D6B5', // Sage
  '#9DBF9E', // Green
  '#987284', // Mauve
  '#E8AFA8', // Pink
  '#B7C4A3', // Light green
  '#A88C82', // Brown
];

type TabKey = 'category' | 'location' | 'job';

interface CombinedCategoryChartProps {
  primaryCategoryData: StatItem[];
  locationData: StatItem[];
  jobData: StatItem[];
  loading: boolean;
}

export function CombinedCategoryChart({
  primaryCategoryData,
  locationData,
  jobData,
  loading,
}: CombinedCategoryChartProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('category');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'category', label: 'Primary Category' },
    { key: 'location', label: 'Location' },
    { key: 'job', label: 'Job Type' },
  ];

  const getActiveData = (): StatItem[] => {
    switch (activeTab) {
      case 'category':
        return primaryCategoryData;
      case 'location':
        return locationData;
      case 'job':
        return jobData;
      default:
        return primaryCategoryData;
    }
  };

  const data = getActiveData();

  const option = {
    ...commonChartOptions,
    tooltip: {
      ...commonChartOptions.tooltip,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: { name: string; value: number; dataIndex: number }[]) => {
        const item = params[0];
        const percentage = data[item.dataIndex]?.percentage || 0;
        return `<strong>${item.name}</strong><br/>Count: ${item.value}<br/>Percentage: ${percentage}%`;
      },
    },
    grid: {
      ...commonChartOptions.grid,
      left: 180,
      right: 60,
      bottom: 20,
      top: 20,
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        color: '#6B7280',
      },
      splitLine: {
        lineStyle: {
          color: '#F3F4F6',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: data.map(item => item.label),
      axisLabel: {
        interval: 0,
        color: '#6B7280',
        fontSize: 11,
        width: 160,
        overflow: 'truncate',
        ellipsis: '...',
      },
      axisLine: {
        lineStyle: {
          color: '#E5E7EB',
        },
      },
    },
    series: [
      {
        type: 'bar',
        barWidth: '60%',
        barCategoryGap: '30%',
        data: data.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: CHART_COLORS[index % CHART_COLORS.length],
            borderRadius: [0, 4, 4, 0],
          },
        })),
        label: {
          show: true,
          position: 'right',
          color: '#6B7280',
          fontSize: 11,
          formatter: '{c}',
        },
      },
    ],
  };

  // Calculate dynamic height based on number of items
  const chartHeight = Math.max(300, data.length * 40);

  return (
    <div className="chart-container" style={{ height: `${chartHeight + 100}px` }}>
      <h3 className="chart-title">
        <LayersIcon /> Category Analysis
      </h3>
      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #E5E7EB',
          padding: '0 16px',
        }}
      >
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? '#3B82F6' : '#6B7280',
              borderBottom: activeTab === tab.key ? '2px solid #3B82F6' : '2px solid transparent',
              marginBottom: '-1px',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: `${chartHeight}px` }}>
          <div className="loading-spinner" />
        </div>
      ) : data.length === 0 ? (
        <div
          className="flex-center"
          style={{
            height: `${chartHeight}px`,
            color: '#9CA3AF',
            fontSize: '14px',
          }}
        >
          No data available
        </div>
      ) : (
        <ReactECharts
          option={option}
          style={{ height: `${chartHeight}px` }}
          key={activeTab} // Force re-render on tab change
        />
      )}
    </div>
  );
}
