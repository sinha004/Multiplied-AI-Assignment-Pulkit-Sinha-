interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="header">
      <div>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 700, 
          color: '#1F2937',
          marginBottom: subtitle ? '0.25rem' : 0
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ 
            color: '#6B7280', 
            fontSize: '0.875rem'
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
