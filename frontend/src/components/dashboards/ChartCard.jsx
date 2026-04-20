import React from 'react';
import Card from '../ui/Card.jsx';

const ChartCard = ({ title, children, className = '' }) => {
  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">{title}</h3>
      <div className="h-80">
        {children}
      </div>
    </Card>
  );
};

export default ChartCard;