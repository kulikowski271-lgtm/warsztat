function Pagination({ page, pageSize, total, onPageChange }) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    if (total <= pageSize) return null;

    return (
        <div className="pagination">
            <button
                className="btn btn-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
            >
                Wstecz
            </button>
            <span className="pagination-info">
                Strona {page} z {totalPages} ({total} wyników)
            </span>
            <button
                className="btn btn-secondary btn-sm"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Dalej
            </button>
        </div>
    );
}

export default Pagination;