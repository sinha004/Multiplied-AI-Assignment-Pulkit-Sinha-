import ReactECharts from 'echarts-for-react';
import type { StatItem } from '../../types/incident.types';
import { chartColors, commonChartOptions, formatNumber } from '../../utils/chartConfig';

interface PrimaryCategoryChartProps {
  data: StatItem[];
  loading?: boolean;
}

export function PrimaryCategoryChart({ data, loading }: PrimaryCategoryChartProps) {
  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, 10);

  const option = {
    ...commonChartOptions,
    tooltip: {
      ...commonChartOptions.tooltip,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const item = params[0];
        return `<strong>${item.name}</strong><br/>Incidents: ${formatNumber(item.value)}`;
      },
    },
    xAxis: {
      type: 'category',
      data: sortedData.map((item) => item.label),
      axisLabel: {
        color: '#6B7280',
        fontSize: 11,
        rotate: 45,
        interval: 0,
        width: 100,
        overflow: 'break'
      },
      axisLine: { lineStyle: { color: '#E2E8F0' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6B7280' },
      splitLine: { lineStyle: { color: '#F1F5F9' } },
    },
    series: [
      {
        type: 'bar',
        data: sortedData.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: chartColors.palette[index % chartColors.palette.length],
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: '60%',
      },
    ],
  };

  if (loading) {
    return (
      <div className="card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="card" style={{ height: '300px' }}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 px-4 pt-4">Primary Category</h3>
      <ReactECharts option={option} style={{ height: '240px' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
}
