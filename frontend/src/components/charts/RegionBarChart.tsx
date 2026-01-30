import ReactECharts from 'echarts-for-react';
import { GlobeIcon } from '../common/Icons';
import type { StatItem } from '../../types/incident.types';
import { chartColors, commonChartOptions, formatNumber } from '../../utils/chartConfig';

interface RegionBarChartProps {
  data: StatItem[];
  loading?: boolean;
}

export function RegionBarChart({ data, loading }: RegionBarChartProps) {
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const total = sortedData.reduce((sum, item) => sum + item.value, 0);

  const chartData = sortedData.map((item, index) => ({
    name: item.label,
    value: item.value,
    itemStyle: {
      color: chartColors.palette[index % chartColors.palette.length],
    },
  }));

  const option = {
    ...commonChartOptions,
    tooltip: {
      ...commonChartOptions.tooltip,
      trigger: 'item',
      formatter: (params: any) => {
        return `<strong>${params.name}</strong><br/>Incidents: ${formatNumber(params.value)} (${params.percent}%)`;
      },
      axisPointer: { type: 'none' },
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: '#6B7280',
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
        name: 'Region',
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
          position: 'center'
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: chartData,
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
        <GlobeIcon /> Incidents by Region
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
