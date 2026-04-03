import React from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-50 text-green-700 ring-green-600/20',
  danger: 'bg-red-50 text-red-700 ring-red-600/20',
  warning: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  info: 'bg-blue-50 text-[#000091] ring-blue-600/20',
  neutral: 'bg-gray-50 text-gray-700 ring-gray-600/20',
};

const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral' }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
};

export default Badge;
