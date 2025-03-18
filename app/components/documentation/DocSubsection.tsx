import { ReactNode } from 'react';

interface DocSubsectionProps {
  title: string;
  children: ReactNode;
}

export default function DocSubsection({ title, children }: DocSubsectionProps) {
  return (
    <div className="my-6">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
