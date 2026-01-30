import ReactECharts from 'echarts-for-react';
import { AlertTriangleIcon } from '../common/Icons';
import type { StatItem } from '../../types/incident.types';
import { pieColors, commonChartOptions, formatNumber } from '../../utils/chartConfig';

interface BehaviorPieChartProps {
  data: StatItem[];
  loading?: boolean;
}

export function BehaviorPieChart({ data, loading }: BehaviorPieChartProps) {
  const chartData = data.map((item, index) => ({
    name: item.label,
    value: item.value,
    itemStyle: { color: pieColors[index % pieColors.length] },
  }));

  const option = {
    ...commonChartOptions,
    tooltip: {
      ...commonChartOptions.tooltip,
      formatter: (params: { name: string; value: number; percent: number }) => {
        return `<strong>${params.name}</strong><br/>Count: ${formatNumber(params.value)}<br/>Percentage: ${params.percent}%`;
      },
    },
    legend: {
      orient: 'horizontal',
      bottom: '0%',
      textStyle: { color: '#64748B' },
    },
    series: [
      {
        name: 'Behavior',
        type: 'pie',
        radius: ['0%', '70%'],
        center: ['50%', '45%'],
        roseType: 'radius',
        itemStyle: {
          borderRadius: 10,
          borderColor: '#FFFFFF',
          borderWidth: 3,
        },
        label: {
          show: true,
          color: '#1E293B',
          fontSize: 12,
          fontWeight: 500,
          formatter: '{b}: {d}%',
        },
        labelLine: {
          lineStyle: { color: '#CBD5E1' },
        },
        emphasis: {
          scale: true,
          scaleSize: 10,
          itemStyle: {
            shadowBlur: 15,
            shadowColor: 'rgba(0, 0, 0, 0.15)',
          },
        },
        data: chartData,
        animationType: 'scale',
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
      <h3 className="chart-title" style={{ gap: '12px' }}>
        <AlertTriangleIcon /> Behavior Types
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
