import { ReactNode } from 'react';

interface DocSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export default function DocSection({ id, title, children }: DocSectionProps) {
  return (
    <section id={id} className="mb-12">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
