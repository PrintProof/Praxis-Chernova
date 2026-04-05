import type {ReactNode} from 'react';

type SectionProps = {
  id?: string;
  className?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function Section({id, className, eyebrow, title, description, children}: SectionProps) {
  return (
    <section id={id} className={`section ${className ?? ''}`.trim()}>
      <div className="container">
        <div className="section-header">
          {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
          {description ? <p className="section-description">{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
