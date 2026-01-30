import ReactECharts from 'echarts-for-react';
import type { StatItem } from '../../types/incident.types';
import { pieColors, commonChartOptions, formatNumber } from '../../utils/chartConfig';

interface RegionBarChartProps {
  data: StatItem[];
  loading?: boolean;
}

export function RegionBarChart({ data, loading }: RegionBarChartProps) {
  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, 10);

  const option = {
    ...commonChartOptions,
    tooltip: {
      ...commonChartOptions.tooltip,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
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
        fontSize: 11,
        rotate: 45,
        interval: 0,
      },
      axisLine: {
        lineStyle: { color: '#E2E8F0' },
      },
      axisTick: {
        lineStyle: { color: '#E2E8F0' },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#64748B' },
      splitLine: {
        lineStyle: { color: '#F1F5F9' },
      },
    },
    series: [
      {
        type: 'bar',
        data: sortedData.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: pieColors[index % pieColors.length] },
                { offset: 1, color: pieColors[(index + 3) % pieColors.length] },
              ],
            },
            borderRadius: [6, 6, 0, 0],
          },
        })),
        barWidth: '60%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.15)',
          },
        },
        animationDelay: (idx: number) => idx * 50,
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
        <span>🌍</span> Incidents by Region
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
