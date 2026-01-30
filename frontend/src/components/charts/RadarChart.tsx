import ReactECharts from 'echarts-for-react';
import type { StatItem } from '../../types/incident.types';
import { commonChartOptions, chartColors, formatNumber } from '../../utils/chartConfig';

interface RadarChartProps {
  data: StatItem[];
  loading?: boolean;
  title?: string;
}

export function RadarChart({ data, loading, title = 'Regional Distribution' }: RadarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value)) * 1.2;
  
  const indicator = data.map((item) => ({
    name: item.label,
    max: maxValue,
  }));

  const option = {
    ...commonChartOptions,
    tooltip: {
      ...commonChartOptions.tooltip,
      formatter: (params: { name: string; value: number[] }) => {
        let result = `<strong>${params.name}</strong><br/>`;
        data.forEach((item, idx) => {
          result += `${item.label}: ${formatNumber(params.value[idx])}<br/>`;
        });
        return result;
      },
    },
    radar: {
      indicator,
      shape: 'polygon',
      splitNumber: 5,
      axisName: {
        color: '#64748B',
        fontSize: 11,
      },
      splitLine: {
        lineStyle: {
          color: ['#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B'].reverse(),
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(30, 111, 92, 0.02)', 'rgba(30, 111, 92, 0.05)'],
        },
      },
      axisLine: {
        lineStyle: { color: '#E2E8F0' },
      },
    },
    series: [
      {
        name: 'Incidents',
        type: 'radar',
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: chartColors.primary,
        },
        itemStyle: {
          color: chartColors.primary,
          borderWidth: 2,
          borderColor: '#FFFFFF',
        },
        areaStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              { offset: 0, color: chartColors.primary + '60' },
              { offset: 1, color: chartColors.primary + '15' },
            ],
          },
        },
        emphasis: {
          lineStyle: { width: 4 },
          areaStyle: { opacity: 0.8 },
        },
        data: [
          {
            value: data.map((d) => d.value),
            name: 'Incidents by Region',
          },
        ],
        animationDuration: 1000,
        animationEasing: 'elasticOut',
      },
    ],
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
        <span>🕸️</span> {title}
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
