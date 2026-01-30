import ReactECharts from 'echarts-for-react';
import { ChartPieIcon } from '../common/Icons';
import type { StatItem } from '../../types/incident.types';
import { severityColors, commonChartOptions, formatNumber } from '../../utils/chartConfig';

interface SeverityDonutChartProps {
  data: StatItem[];
  loading?: boolean;
}

export function SeverityDonutChart({ data, loading }: SeverityDonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const chartData = data.map((item, index) => ({
    name: item.label,
    value: item.value,
    itemStyle: {
      color: severityColors[index] || severityColors[0],
    },
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
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: '#64748B',
        fontSize: 12,
      },
      itemGap: 12,
    },
    graphic: [
      {
        type: 'text',
        left: '28%',
        top: '45%',
        style: {
          text: formatNumber(total),
          textAlign: 'center',
          fill: '#1E293B',
          fontSize: 28,
          fontWeight: 'bold',
        },
      },
      {
        type: 'text',
        left: '28%',
        top: '55%',
        style: {
          text: 'Total',
          textAlign: 'center',
          fill: '#94A3B8',
          fontSize: 14,
        },
      },
    ],
    series: [
      {
        name: 'Severity',
        type: 'pie',
        radius: ['55%', '80%'],
        center: ['32%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#FFFFFF',
          borderWidth: 3,
        },
        label: {
          show: false,
        },
        emphasis: {
          scale: true,
          scaleSize: 8,
        },
        labelLine: {
          show: false,
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
        <ChartPieIcon /> Severity Distribution
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
