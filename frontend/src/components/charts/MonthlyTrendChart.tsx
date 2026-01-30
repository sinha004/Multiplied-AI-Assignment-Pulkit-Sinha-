import ReactECharts from 'echarts-for-react';
import type { MonthlyTrend } from '../../types/incident.types';
import { monthNames, commonChartOptions, chartColors } from '../../utils/chartConfig';

interface MonthlyTrendChartProps {
  data: MonthlyTrend[];
  loading?: boolean;
}

export function MonthlyTrendChart({ data, loading }: MonthlyTrendChartProps) {
  // Group by year and create series
  const years = [...new Set(data.map((d) => d.year))].sort();
  
  const xAxisData = monthNames;
  
  const colorPalette = [chartColors.primary, chartColors.orange, chartColors.purple, chartColors.teal];
  
  const series = years.map((year, idx) => {
    const yearData = new Array(12).fill(0);
    data
      .filter((d) => d.year === year)
      .forEach((d) => {
        yearData[d.month - 1] = d.count;
      });
    
    return {
      name: year.toString(),
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 3,
        color: colorPalette[idx % colorPalette.length],
      },
      itemStyle: {
        color: colorPalette[idx % colorPalette.length],
        borderWidth: 2,
        borderColor: '#FFFFFF',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: colorPalette[idx % colorPalette.length] + '40' },
            { offset: 1, color: colorPalette[idx % colorPalette.length] + '05' },
          ],
        },
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 10,
          shadowColor: colorPalette[idx % colorPalette.length] + '50',
        },
      },
      data: yearData,
      animationDelay: (i: number) => i * 20 + idx * 200,
    };
  });

  const option = {
    ...commonChartOptions,
    tooltip: {
      ...commonChartOptions.tooltip,
      trigger: 'axis',
      formatter: (params: { seriesName: string; value: number; axisValueLabel: string; color: string }[]) => {
        let result = `<strong>${params[0].axisValueLabel}</strong><br/>`;
        params.forEach((p) => {
          result += `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color};margin-right:5px;"></span>${p.seriesName}: ${p.value}<br/>`;
        });
        return result;
      },
    },
    legend: {
      data: years.map(String),
      textStyle: { color: '#64748B' },
      top: 0,
      itemGap: 20,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLabel: { color: '#64748B' },
      axisLine: { lineStyle: { color: '#E2E8F0' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#64748B' },
      splitLine: { lineStyle: { color: '#F1F5F9' } },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
    ],
    series,
    animationEasing: 'cubicOut',
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
        <span>📈</span> Monthly Trends
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
