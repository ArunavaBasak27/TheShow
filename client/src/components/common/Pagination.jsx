import { useEffect, useState } from "react";

const Pagination = ({ onPageChange, totalPages, currentPage = 1 }) => {
  const [pages, setPages] = useState([]);
  const THRESHOLD = 5;

  useEffect(() => {
    setNewPageList(currentPage);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      onPageChange(1); // Reset to first page if out of bounds
    }
  }, [currentPage, totalPages, onPageChange]);

  const setNewPageList = (pageNo) => {
    const itemsLength = Math.min(totalPages, THRESHOLD);
    const itemsOnLeft = Math.ceil(THRESHOLD / 2) - 1;
    let startingPage = Math.max(pageNo - itemsOnLeft, 1);

    if (startingPage + itemsLength > totalPages) {
      startingPage = totalPages - itemsLength + 1;
    }

    const list = Array.from(
      { length: itemsLength },
      (_, i) => i + startingPage,
    );
    setPages(list);
  };

  const handleClick = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  if (totalPages <= 1) return null;

  return (
    <nav>
      <ul className="pagination justify-content-center mt-3">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => handleClick(1)}>
            &laquo;
          </button>
        </li>
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => handleClick(currentPage - 1)}
          >
            &lt;
          </button>
        </li>

        {pages.map((page) => (
          <li
            key={page}
            className={`page-item ${page === currentPage ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => handleClick(page)}>
              {page}
            </button>
          </li>
        ))}

        <li
          className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => handleClick(currentPage + 1)}
          >
            &gt;
          </button>
        </li>
        <li
          className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
        >
          <button className="page-link" onClick={() => handleClick(totalPages)}>
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
