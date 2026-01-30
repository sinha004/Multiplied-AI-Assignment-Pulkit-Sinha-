import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Select, Space } from 'antd';
import { commonChartOptions } from '../../utils/chartConfig';
import { ZapIcon } from '../common/Icons';
import { ActionCauseDetails, ActionCauseFilters, FilterOptions } from '../../types/incident.types';

interface ActionCauseChartProps {
  data: ActionCauseDetails[];
  loading: boolean;
  filterOptions?: FilterOptions;
  onFilterChange?: (filters: ActionCauseFilters) => void;
}

export function ActionCauseChart({ data, loading, filterOptions, onFilterChange }: ActionCauseChartProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [selectedSeverity, setSelectedSeverity] = useState<number[]>([]);

  // Trigger filter change when any filter updates
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        region: selectedRegion,
        year: selectedYear,
        severityLevel: selectedSeverity.length > 0 ? selectedSeverity : undefined,
      });
    }
  }, [selectedRegion, selectedYear, selectedSeverity, onFilterChange]);

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
      left: 20,
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
      data: data.map(item => item.actionCause),
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    series: behaviorTypes.map((type, typeIndex) => ({
      name: type,
      type: 'bar',
      stack: 'total',
      barCategoryGap: '35%',
      color: getColor(type),
      emphasis: {
        focus: 'series'
      },
      label: typeIndex === 0 ? {
        show: true,
        position: 'insideLeft',
        formatter: (params: { dataIndex: number }) => {
          const label = data[params.dataIndex]?.actionCause || '';
          return label.length > 35 ? label.substring(0, 35) + '...' : label;
        },
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 500,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowBlur: 2,
      } : { show: false },
      data: data.map(item => item.breakdown[type] || 0)
    })),
  };

  // Calculate dynamic height based on number of categories
  const chartHeight = Math.max(400, data.length * 45);

  const handleClearFilters = () => {
    setSelectedRegion(undefined);
    setSelectedYear(undefined);
    setSelectedSeverity([]);
  };

  return (
    <div className="chart-container" style={{ height: `${chartHeight + 100}px` }}>
      <h3 className="chart-title">
        <ZapIcon /> Action Cause by Behavior Type
      </h3>
      {/* Filter Controls */}
      <div style={{ 
        padding: '12px 16px', 
        borderBottom: '1px solid #F3F4F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <Space wrap size="small">
          <Select
            placeholder="Filter by Region"
            allowClear
            style={{ minWidth: 150 }}
            value={selectedRegion}
            onChange={setSelectedRegion}
            options={filterOptions?.regions?.map(r => ({ label: r, value: r })) || []}
          />
          <Select
            placeholder="Filter by Year"
            allowClear
            style={{ minWidth: 120 }}
            value={selectedYear}
            onChange={setSelectedYear}
            options={filterOptions?.years?.map(y => ({ label: String(y), value: y })) || []}
          />
          <Select
            placeholder="Filter by Severity"
            mode="multiple"
            allowClear
            style={{ minWidth: 160 }}
            value={selectedSeverity}
            onChange={setSelectedSeverity}
            options={filterOptions?.severityLevels?.map(s => ({ label: `Level ${s}`, value: s })) || []}
            maxTagCount={2}
          />
        </Space>
        {(selectedRegion || selectedYear || selectedSeverity.length > 0) && (
          <a 
            onClick={handleClearFilters} 
            style={{ color: '#6B7280', fontSize: 12, cursor: 'pointer' }}
          >
            Clear filters
          </a>
        )}
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: `${chartHeight}px` }}>
          <div className="loading-spinner" />
        </div>
      ) : (
        <ReactECharts option={option} style={{ height: `${chartHeight}px` }} />
      )}
    </div>
  );
}
