import React, { ReactNode } from 'react';

interface CardProps {
  className?: string;
  children: ReactNode;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ className = '', children, hoverable = false }) => {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md overflow-hidden 
        ${hoverable ? 'transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;

export const CardHeader: React.FC<{ className?: string; children: ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`p-4 border-b ${className}`}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<{ className?: string; children: ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<{ className?: string; children: ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`p-4 border-t ${className}`}>
      {children}
    </div>
  );
};