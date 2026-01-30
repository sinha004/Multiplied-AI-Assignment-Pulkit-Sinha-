import ReactECharts from 'echarts-for-react';
import { GlobeIcon } from '../common/Icons';
import type { StatItem } from '../../types/incident.types';
import { chartColors, commonChartOptions, formatNumber } from '../../utils/chartConfig';

interface RegionBarChartProps {
  data: StatItem[];
  loading?: boolean;
}

export function RegionBarChart({ data, loading }: RegionBarChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Group remaining items as "Other"
  const topItems = [...data].sort((a, b) => b.value - a.value).slice(0, 5);
  const otherTotal = data.reduce((sum, item) => sum + item.value, 0) - topItems.reduce((sum, item) => sum + item.value, 0);
  
  const chartData = [
    ...topItems.map((item, index) => ({
      name: item.label,
      value: item.value,
      itemStyle: {
        color: chartColors.palette[index % chartColors.palette.length],
      },
    })),
    ...(otherTotal > 0 ? [{
      name: 'Other',
      value: otherTotal,
      itemStyle: {
        color: chartColors.palette[5],
      },
    }] : []),
  ];

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
      right: 10,
      top: 'middle',
      textStyle: {
        color: '#6B7280',
        fontSize: 11,
      },
      itemGap: 8,
      itemWidth: 10,
      itemHeight: 10,
      formatter: (name: string) => {
        return name.length > 18 ? name.substring(0, 18) + '...' : name;
      },
    },
    graphic: [
      {
        type: 'text',
        left: '22%',
        top: '42%',
        style: {
          text: formatNumber(total),
          textAlign: 'center',
          fill: '#1E293B',
          fontSize: 24,
          fontWeight: 'bold',
        },
      },
      {
        type: 'text',
        left: '22%',
        top: '54%',
        style: {
          text: 'Total',
          textAlign: 'center',
          fill: '#94A3B8',
          fontSize: 12,
        },
      },
    ],
    series: [
      {
        name: 'Region',
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['28%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#FFFFFF',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          scale: true,
          scaleSize: 5,
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
