function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="pagination-btn"
      >
        ← Назад
      </button>
      
      <span className="pagination-info">
        Страница {page} из {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="pagination-btn"
      >
        Вперед →
      </button>
    </div>
  );
}

export default Pagination;