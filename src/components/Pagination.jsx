function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(prev => Math.max(1, prev - 1))}
        disabled={page === 1}
        className="pagination-btn"
      >
        ⬅️ Назад
      </button>
      
      <span className="pagination-info">
        Страница {page} из {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(prev => Math.min(totalPages, prev + 1))}
        disabled={page === totalPages}
        className="pagination-btn"
      >
        Вперед ➡️
      </button>
    </div>
  );
}

export default Pagination;