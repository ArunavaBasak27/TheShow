import { useEffect, useState } from "react";

const Pagination = ({ onPageChange, totalPages }) => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const THRESHOLD = 3;

  useEffect(() => {
    const list = Array.from(
      { length: Math.min(totalPages, THRESHOLD) },
      (_, i) => i + 1,
    );
    setPages(list);
  }, [totalPages]);

  useEffect(() => {
    if (selectedPage > totalPages && totalPages > 0) {
      setSelectedPage(1);
      setNewPageList(1);
      onPageChange(1);
    }
  }, [totalPages]);

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
    setSelectedPage(page);
    setNewPageList(page);
  };

  if (totalPages <= 1) return null;

  return (
    <nav>
      <ul className="pagination justify-content-center mt-3">
        <li className={`page-item ${selectedPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => handleClick(1)}>
            &laquo;
          </button>
        </li>
        <li className={`page-item ${selectedPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => handleClick(selectedPage - 1)}
          >
            &lt;
          </button>
        </li>

        {pages.map((page) => (
          <li
            key={page}
            className={`page-item ${page === selectedPage ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => handleClick(page)}>
              {page}
            </button>
          </li>
        ))}

        <li
          className={`page-item ${selectedPage === totalPages ? "disabled" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => handleClick(selectedPage + 1)}
          >
            &gt;
          </button>
        </li>
        <li
          className={`page-item ${selectedPage === totalPages ? "disabled" : ""}`}
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
