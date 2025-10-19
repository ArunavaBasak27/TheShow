import React from "react";

const SearchBar = ({
  searchTerm,
  onSearchChange,
  onClear,
  placeholder = "Search...",
  resultsCount = null,
  resultsQuery = "",
}) => {
  return (
    <div className="mb-4">
      <div className="input-group">
        <span className="input-group-text bg-white">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={searchTerm}
          onChange={onSearchChange}
        />
        {searchTerm && (
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={onClear}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        )}
      </div>
      {resultsQuery && (
        <small className="text-muted mt-2 d-block">
          Found {resultsCount || 0} result{resultsCount !== 1 ? "s" : ""}{" "}
          matching "{resultsQuery}"
        </small>
      )}
    </div>
  );
};

export default SearchBar;
