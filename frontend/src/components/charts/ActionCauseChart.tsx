import ReactECharts from 'echarts-for-react';
import { commonChartOptions } from '../../utils/chartConfig';
import { ActionCauseDetails } from '../../types/incident.types';

interface ActionCauseChartProps {
  data: ActionCauseDetails[];
  loading: boolean;
}

export function ActionCauseChart({ data, loading }: ActionCauseChartProps) {
  // Extract all unique behavior types for series
  const behaviorTypes = Array.from(new Set(
    data.flatMap(item => Object.keys(item.breakdown))
  ));

  // Define specific colors for behavior types
  const getColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('safe')) return '#9DBF9E'; // Green
    if (lowerType.includes('risk')) return '#EE7674'; // Red
    return '#F9B5AC'; // Orange (Undetermined/Other)
  };

  const option = {
    ...commonChartOptions,
    title: {
      text: 'Action Cause by Behavior Type',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#6B7280',
      },
    },
    tooltip: {
      ...commonChartOptions.tooltip,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      bottom: 0,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        fontSize: 12,
        color: '#6B7280',
      },
    },
    grid: {
      ...commonChartOptions.grid,
      bottom: 40,
      left: 200, // Increase left margin for long labels
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
      data: data.map(item => item.actionCause),
      axisLabel: {
        interval: 0,
        color: '#6B7280',
        fontSize: 11,
        width: 180,
        overflow: 'truncate',
        ellipsis: '...',
      },
      axisLine: {
        lineStyle: {
          color: '#E5E7EB',
        },
      },
    },
    series: behaviorTypes.map(type => ({
      name: type,
      type: 'bar',
      stack: 'total',
      barCategoryGap: '40%',
      color: getColor(type),
      emphasis: {
        focus: 'series'
      },
      data: data.map(item => item.breakdown[type] || 0)
    })),
  };

  // Calculate dynamic height based on number of categories
  const chartHeight = Math.max(400, data.length * 45);

  return (
    <div className="card" style={{ height: `${chartHeight}px` }}>
      {loading ? (
        <div className="flex-center" style={{ height: '100%' }}>
          <div className="loading-spinner" />
        </div>
      ) : (
        <ReactECharts option={option} style={{ height: '100%' }} />
      )}
    </div>
  );
}
