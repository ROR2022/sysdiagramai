import { ReactNode } from 'react';

interface DocCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function DocCard({ title, children, className = '' }: DocCardProps) {
  return (
    <div className={`card bg-base-200 shadow-md my-4 not-prose ${className}`}>
      <div className="card-body">
        {title && <h4 className="card-title">{title}</h4>}
        {children}
      </div>
    </div>
  );
}
