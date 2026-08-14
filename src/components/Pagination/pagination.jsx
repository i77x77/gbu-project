import React from 'react';
import './pagination.css';

const Pagination = ({ page, pages, prev, next, onPageChange }) => {
  if (!pages || pages <= 1) return null;

  return (
    <div className="pagination-controls">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(prev)}
        disabled={!prev}
      >
        Назад
      </button>

      <span className="pagination-info">
        Страница {page} из {pages}
      </span>

      <button
        className="pagination-btn"
        onClick={() => onPageChange(next)}
        disabled={!next}
      >
        Далее
      </button>
    </div>
  );
};

export default Pagination;