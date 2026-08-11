import { Link } from 'react-router-dom';
import './card.css';

const Card = ({ id, name, status, image }) => {
  // Приводим статус к нижнему регистру для совпадения со стилями в CSS (alive, dead, unknown)
  const statusClass = status ? `card--${status.toLowerCase()}` : 'card--unknown';

  return (
    <Link to={`/character/${id}`} className="card-link">
      <article className={`card ${statusClass}`}>
        <div className="card__content">
          <h3 className="card__title">Name: {name}</h3>
          <span className="card__status">Status: {status}</span>
        </div>
        <img
          src={image}
          alt={name}
          className="card__image"
        />
      </article>
    </Link>
  );
};

export default Card;