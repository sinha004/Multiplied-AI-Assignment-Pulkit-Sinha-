// Chart Configuration and Color Palette
// Updated with user-specified warm/earthy tones

export const chartColors = {
  // Ordered array for charts that need sequence (like pie/bar series)
  palette: [
    '#EE7674', // Red/Coral
    '#F9B5AC', // Light Coral/Pink
    '#D0D6B5', // Sage Green Light
    '#9DBF9E', // Sage Green Medium
    '#987284', // Mauve/Purple
    '#E8AFA8', // Muted Pink
    '#B7C4A3', // Olive Light
    '#A88C82', // Brown/Taupe
  ],
  
  // Semantic mapping (using closest matches from palette)
  primary: '#EE7674',
  secondary: '#9DBF9E',
  success: '#D0D6B5',
  warning: '#F9B5AC', // Using light coral for warning/attention
  danger: '#EE7674',
  info: '#987284',
  
  // Additional for special cases
  purple: '#987284',
  orange: '#E8AFA8',
  teal: '#9DBF9E',
  
  // Gradients (using palette pairs)
  gradients: {
    primary: ['#EE7674', '#F9B5AC'],
    secondary: ['#9DBF9E', '#D0D6B5'],
    purple: ['#987284', '#E8AFA8'],
    orange: ['#A88C82', '#E8AFA8'],
  }
};

// ECharts common options
export const commonChartOptions = {
  textStyle: {
    fontFamily: 'Inter, sans-serif',
  },
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    padding: [10, 15],
    textStyle: {
      color: '#1F2937',
    },
    extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-radius: 8px;',
  },
  grid: {
    top: 40,
    right: 20,
    bottom: 20,
    left: 20,
    containLabel: true,
  },
};

export const pieColors = chartColors.palette;
export const severityColors = chartColors.palette;

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
