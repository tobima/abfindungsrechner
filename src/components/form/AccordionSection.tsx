import type { ReactNode } from 'react';

interface AccordionSectionProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function AccordionSection({ title, description, defaultOpen = false, children }: AccordionSectionProps) {
  return (
    <details className="accordion-section" open={defaultOpen}>
      <summary className="accordion-summary">
        <span className="accordion-title">{title}</span>
        {description && <span className="accordion-description">{description}</span>}
      </summary>
      <div className="accordion-content">{children}</div>
    </details>
  );
}
