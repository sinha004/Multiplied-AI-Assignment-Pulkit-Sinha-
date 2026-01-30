interface KpiCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  variant?: 'default' | 'orange' | 'purple' | 'green' | 'yellow';
}

export function KpiCard({ title, value, icon, variant = 'default' }: KpiCardProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className={`kpi-card ${variant}`}>
      <div className="kpi-card-icon">
        {icon}
      </div>
      <div className="kpi-card-label">{title}</div>
      <div className="kpi-card-value">{formatValue(value)}</div>
    </div>
  );
}
