import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import moment from "moment";
import { useSelector } from "react-redux";

const BookingList = ({ bookings = [] }) => {
  const user = useSelector((state) => state.userStore.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    nameSearch: "",
    movie: "",
    fromDate: "",
    toDate: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const getRoleBasedClass = (roleCondition) =>
    roleCondition ? "" : "visually-hidden";

  // ✅ Unique movie titles for dropdown
  const uniqueMovies = useMemo(() => {
    return [...new Set(bookings.map((b) => b.show.movie.title))].sort();
  }, [bookings]);

  // ✅ Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchTerm = filters.nameSearch.toLowerCase().trim();

      // 🔍 Search by name, email, or phone
      const matchesSearch =
        !searchTerm ||
        booking.user.name.toLowerCase().includes(searchTerm) ||
        booking.user.email.toLowerCase().includes(searchTerm) ||
        booking.user.phone.includes(searchTerm);

      // 🎬 Filter by movie
      const matchesMovie =
        !filters.movie || booking.show.movie.title === filters.movie;

      // 📅 Filter by date range
      const bookingDate = moment(booking.show.date);
      const matchesFromDate =
        !filters.fromDate || bookingDate.isSameOrAfter(filters.fromDate, "day");
      const matchesToDate =
        !filters.toDate || bookingDate.isSameOrBefore(filters.toDate, "day");

      return matchesSearch && matchesMovie && matchesFromDate && matchesToDate;
    });
  }, [bookings, filters]);

  // ✅ Sorting Logic
  const sortedBookings = useMemo(() => {
    let sortableBookings = [...filteredBookings];
    if (sortConfig.key) {
      sortableBookings.sort((a, b) => {
        let aValue, bValue;
        switch (sortConfig.key) {
          case "userName":
            aValue = a.user.name.toLowerCase();
            bValue = b.user.name.toLowerCase();
            break;
          case "email":
            aValue = a.user.email.toLowerCase();
            bValue = b.user.email.toLowerCase();
            break;
          case "phone":
            aValue = a.user.phone;
            bValue = b.user.phone;
            break;
          case "theatre":
            aValue = a.show.theatre.name.toLowerCase();
            bValue = b.show.theatre.name.toLowerCase();
            break;
          case "movie":
            aValue = a.show.movie.title.toLowerCase();
            bValue = b.show.movie.title.toLowerCase();
            break;
          case "date":
            aValue = moment(a.show.date);
            bValue = moment(b.show.date);
            break;
          case "seats":
            aValue = a.seats.length;
            bValue = b.seats.length;
            break;
          default:
            return 0;
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableBookings;
  }, [filteredBookings, sortConfig]);

  // ✅ Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = sortedBookings.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ✅ Handlers
  const handleFiltersChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ nameSearch: "", movie: "", fromDate: "", toDate: "" });
    setCurrentPage(1);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <i className="bi bi-arrow-down-up ms-1"></i>;
    return sortConfig.direction === "asc" ? (
      <i className="bi bi-arrow-up ms-1"></i>
    ) : (
      <i className="bi bi-arrow-down ms-1"></i>
    );
  };

  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => paginate(number)}
      >
        {number}
      </Pagination.Item>,
    );
  }

  const today = moment().format("YYYY-MM-DD");
  const yearAgo = moment().subtract(1, "year").format("YYYY-MM-DD");

  // ✅ JSX Output
  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12">
          <h3 className="mb-4 text-center text-muted">Booking History</h3>

          {/* 🔍 Filters */}
          <Card className="mb-4 shadow-sm">
            <Card.Body className="p-3">
              <Row className="g-3 align-items-end">
                {user.role !== "user" && (
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="small">
                        Search (Name / Email / Phone)
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light">
                          <i className="bi bi-search"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Search by name, email, or phone..."
                          value={filters.nameSearch}
                          onChange={(e) =>
                            handleFiltersChange("nameSearch", e.target.value)
                          }
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                )}

                <Col md={user.role !== "user" ? 3 : 4}>
                  <Form.Group>
                    <Form.Label className="small">Movie</Form.Label>
                    <Form.Select
                      value={filters.movie}
                      onChange={(e) =>
                        handleFiltersChange("movie", e.target.value)
                      }
                    >
                      <option value="">All Movies</option>
                      {uniqueMovies.map((movieTitle) => (
                        <option key={movieTitle} value={movieTitle}>
                          {movieTitle}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={user.role !== "user" ? 3 : 4}>
                  <Form.Group>
                    <Form.Label className="small">From Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={filters.fromDate}
                      onChange={(e) =>
                        handleFiltersChange("fromDate", e.target.value)
                      }
                      max={filters.toDate || today}
                    />
                  </Form.Group>
                </Col>

                <Col md={user.role !== "user" ? 3 : 4}>
                  <Form.Group>
                    <Form.Label className="small">To Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={filters.toDate}
                      onChange={(e) =>
                        handleFiltersChange("toDate", e.target.value)
                      }
                      min={filters.fromDate || yearAgo}
                    />
                  </Form.Group>
                </Col>

                <Col xs="12" className="text-end">
                  <Form.Text className="text-muted me-3">
                    Showing {sortedBookings.length} of {bookings.length}{" "}
                    bookings
                  </Form.Text>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={clearFilters}
                    disabled={!Object.values(filters).some((v) => v !== "")}
                  >
                    <i className="bi bi-x-circle me-1"></i> Clear Filters
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* 📋 Booking Table */}
          <div className="table-responsive mb-4">
            <Table
              striped
              bordered
              hover
              variant="light"
              size="sm"
              className="shadow-sm rounded mb-0"
            >
              <thead className="table-dark">
                <tr>
                  <th
                    className={getRoleBasedClass(user.role !== "user")}
                    onClick={
                      user.role !== "user"
                        ? () => requestSort("userName")
                        : undefined
                    }
                    style={{
                      cursor: user.role !== "user" ? "pointer" : "default",
                    }}
                  >
                    Customer Name{" "}
                    {user.role !== "user" && getSortIcon("userName")}
                  </th>
                  <th
                    className={getRoleBasedClass(user.role !== "user")}
                    onClick={
                      user.role !== "user"
                        ? () => requestSort("email")
                        : undefined
                    }
                    style={{
                      cursor: user.role !== "user" ? "pointer" : "default",
                    }}
                  >
                    Customer Email{" "}
                    {user.role !== "user" && getSortIcon("email")}
                  </th>
                  <th
                    className={getRoleBasedClass(user.role !== "user")}
                    onClick={
                      user.role !== "user"
                        ? () => requestSort("phone")
                        : undefined
                    }
                    style={{
                      cursor: user.role !== "user" ? "pointer" : "default",
                    }}
                  >
                    Customer Phone{" "}
                    {user.role !== "user" && getSortIcon("phone")}
                  </th>
                  <th
                    className="text-center"
                    onClick={() => requestSort("theatre")}
                    style={{ cursor: "pointer" }}
                  >
                    Theatre Name {getSortIcon("theatre")}
                  </th>
                  <th
                    className="text-center"
                    onClick={() => requestSort("movie")}
                    style={{ cursor: "pointer" }}
                  >
                    Movie Name {getSortIcon("movie")}
                  </th>
                  <th
                    className="text-center"
                    onClick={() => requestSort("date")}
                    style={{ cursor: "pointer" }}
                  >
                    Show Timings {getSortIcon("date")}
                  </th>
                  <th
                    className="text-center"
                    onClick={() => requestSort("seats")}
                    style={{ cursor: "pointer" }}
                  >
                    Booked Seats {getSortIcon("seats")}
                  </th>
                </tr>
              </thead>

              <tbody className="table-group-divider">
                {currentBookings.map((booking, index) => (
                  <tr key={booking.id || index} className="align-middle">
                    <td className={getRoleBasedClass(user.role !== "user")}>
                      <strong>{booking.user.name}</strong>
                    </td>
                    <td className={getRoleBasedClass(user.role !== "user")}>
                      <small className="text-muted">{booking.user.email}</small>
                    </td>
                    <td className={getRoleBasedClass(user.role !== "user")}>
                      <small className="text-muted">{booking.user.phone}</small>
                    </td>
                    <td className="fw-semibold text-primary">
                      {booking.show.theatre.name}
                    </td>
                    <td className="fw-semibold">{booking.show.movie.title}</td>
                    <td className="text-center">
                      <div>
                        <div className="fw-medium">
                          {moment(booking.show.date).format("DD-MM-YYYY")}
                        </div>
                        <div className="text-muted small">
                          {moment(booking.show.date).format("hh:mm A")}
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="d-flex flex-wrap justify-content-center gap-1">
                        {booking.seats.map((seat, seatIndex) => (
                          <Badge
                            key={seatIndex}
                            bg="success"
                            className="px-2 py-1"
                          >
                            {seat}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* 📄 Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination size="sm">
                <Pagination.Prev
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                />
                {paginationItems}
                <Pagination.Next
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}

          {/* 🈳 Empty States */}
          {currentBookings.length === 0 && sortedBookings.length > 0 && (
            <div className="text-center py-5">
              <p className="text-muted">No bookings found on this page.</p>
            </div>
          )}
          {sortedBookings.length === 0 && (
            <div className="text-center py-5">
              <p className="text-muted">
                No bookings found matching the filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingList;
