import ReactECharts from 'echarts-for-react';
import type { StatItem } from '../../types/incident.types';
import { commonChartOptions, chartColors, formatNumber } from '../../utils/chartConfig';

interface GbuBarChartProps {
  data: StatItem[];
  loading?: boolean;
}

export function GbuBarChart({ data, loading }: GbuBarChartProps) {
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  const option = {
    ...commonChartOptions,
    tooltip: {
      ...commonChartOptions.tooltip,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: { name: string; value: number }[]) => {
        const item = params[0];
        return `<strong>${item.name}</strong><br/>Incidents: ${formatNumber(item.value)}`;
      },
    },
    xAxis: {
      type: 'category',
      data: sortedData.map((item) => item.label),
      axisLabel: {
        color: '#64748B',
        rotate: 30,
        fontSize: 11,
      },
      axisLine: { lineStyle: { color: '#E2E8F0' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#64748B' },
      splitLine: { lineStyle: { color: '#F1F5F9' } },
    },
    series: [
      {
        type: 'bar',
        data: sortedData.map((item) => ({
          value: item.value,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: chartColors.purple },
                { offset: 1, color: chartColors.pink },
              ],
            },
            borderRadius: [8, 8, 0, 0],
          },
        })),
        barWidth: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(139, 92, 246, 0.3)',
          },
        },
        animationDelay: (idx: number) => idx * 80,
      },
    ],
    animationEasing: 'elasticOut',
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        <span>🏢</span> Incidents by GBU
      </h3>
      <div className="chart-wrapper">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  );
}
