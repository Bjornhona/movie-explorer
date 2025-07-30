import { ReactNode } from 'react';
import '../styles/components/Card.scss';

interface CardProps {
  icon?: string;
  title?: string;
  children?: ReactNode;
}

const Card = ({icon, title, children}: CardProps) => {
  return (
    <section className="card-section fade-in">
      {(icon || title) && <div className="card-header">
        <h2>
          {icon && <span className="card-icon">{icon}</span>}
          {title && title}
        </h2>
      </div>}
      <div className="card-content">
        {children}
      </div>
    </section>
  )
}

export default Card;
