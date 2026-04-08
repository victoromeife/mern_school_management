import React from 'react';

const Skeleton = ({ variant = 'text', className = '' }) => {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-8 w-1/3',
    card: 'h-40 w-full',
    avatar: 'h-16 w-16 rounded-full',
    button: 'h-10 w-24',
  };

  return (
    <div className={`animate-pulse bg-surface-200 rounded ${variants[variant]} ${className}`} />
  );
};

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-5">
    <div className="flex items-start justify-between mb-4">
      <Skeleton variant="title" className="w-2/3" />
      <Skeleton variant="button" className="w-16" />
    </div>
    <Skeleton variant="text" className="mb-2" />
    <Skeleton variant="text" className="w-3/4 mb-4" />
    <div className="flex items-center justify-between">
      <Skeleton variant="text" className="w-24" />
      <Skeleton variant="text" className="w-16" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-4 pb-2 border-b border-surface-200">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} variant="text" className="w-1/4" />
      ))}
    </div>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 py-3">
        {[...Array(4)].map((_, j) => (
          <Skeleton key={j} variant="text" className="w-1/4" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className="h-80 flex items-end gap-2 p-4">
    {[...Array(12)].map((_, i) => (
      <Skeleton key={i} variant="text" className={`h-${20 + Math.random() * 40} w-8`} />
    ))}
  </div>
);

export default Skeleton;