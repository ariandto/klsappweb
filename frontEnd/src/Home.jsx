import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { apiUrl } from './config';
import './styleHome.css';

function Home() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [newData, setNewData] = useState({
    id: '',
    shiptoname: '',
    address: '',
    remarks: '',
    area: ''
  });
  const [editData, setEditData] = useState(null);
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const rowsPerPage = 8;
  const paginationRange = 10;

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, []);

  const fetchData = () => {
    axios
      .get(`${apiUrl}/`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  };
  
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/user`);
      const userData = response.data;
      setUsername(userData.username);
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
      setIsLoggedIn(false);
    }
  };

  const filteredData = data.filter((route) => {
    return (
      route.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.shiptoname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.remarks.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCreateNewData = () => {
    axios
      .post(`${apiUrl}/route`, newData)
      .then((res) => {
        fetchData();
        setNewData({
          id: '',
          shiptoname: '',
          address: '',
          remarks: '',
          area: '',
        });
      })
      .catch((err) => console.log(err));
  };
  
  const handleEditData = (route) => {
    setEditData(route);
    setNewData({
      id: route.id,
      shiptoname: route.shiptoname,
      address: route.address,
      remarks: route.remarks,
      area: route.area
    });
  };

  const handleUpdateData = () => {
    axios
      .put(`${apiUrl}/route/${newData.id}`, newData)
      .then((res) => {
        fetchData();
        setEditData(null);
        setNewData({
          id: '',
          shiptoname: '',
          address: '',
          remarks: '',
          area: ''
        });
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteData = (id) => {
    axios
      .delete(`${apiUrl}/route/${id}`)
      .then((res) => {
        fetchData();
      })
      .catch((err) => console.log(err));
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startPage = Math.max(1, currentPage - Math.floor(paginationRange / 2));
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  const range = [...Array(endPage - startPage + 1)].map((_, i) => startPage + i);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleCancelEdit = () => {
    setEditData(null);
    setNewData({
      id: '',
      shiptoname: '',
      address: '',
      remarks: '',
      area: ''
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <nav className="navbar navbar-expand-lg navbar-light bg-primary mb-0 fixed-top">
            <div className="container">
              <Link to="/" className="navbar-brand text-light">
                Home
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    <Link to="/order-key-parsing" className="nav-link text-light">
                      Order Key Parsing
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/mapping-area" className="nav-link text-light">
                      Mapping Area
                    </Link>
                  </li>
                </ul>
                {isLoggedIn && <span className="navbar-text">{username}</span>}
              </div>
            </div>
          </nav>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <div className="row justify-content-end">
            <input
              type="text"
              className="form-control col-sm-8 col-md-6 col-lg-4 mb-6"
              placeholder="Search by Address, Area, Customer, Remarks"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="thead thead-dark">
                <tr>
                  <th className="text-center bg-secondary text-light">ID</th>
                  <th className="text-center bg-secondary text-light">Ship To Name</th>
                  <th className="text-center bg-secondary text-light">Address</th>
                  <th className="text-center bg-secondary text-light">Remarks</th>
                  <th className="text-center bg-secondary text-light">Area</th>
                  <th className="text-center bg-secondary text-light">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((route) => (
                  <tr key={route.id}>
                    <td>{route.id}</td>
                    <td>{route.shiptoname}</td>
                    <td>{truncateText(route.address, 30)}</td>
                    <td>{truncateText(route.remarks, 30)}</td>
                    <td>{route.area}</td>
                    <td>
                      {editData && editData.id === route.id ? (
                        <>
                          <button
                            className="btn btn-success me-2"
                            onClick={handleUpdateData}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-danger me-2"
                            onClick={() => handleDeleteData(route.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => handleEditData(route)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteData(route.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control col-sm-4 col-md-3 col-lg-2"
              placeholder="Ship To Name"
              value={newData.shiptoname}
              onChange={(e) =>
                setNewData({ ...newData, shiptoname: e.target.value })
              }
            />
            <input
              type="text"
              className="form-control col-sm-4 col-md-3 col-lg-2"
              placeholder="Address"
              value={newData.address}
              onChange={(e) =>
                setNewData({ ...newData, address: e.target.value })
              }
            />
            <input
              type="text"
              className="form-control col-sm-4 col-md-3 col-lg-2"
              placeholder="Remarks"
              value={newData.remarks}
              onChange={(e) =>
                setNewData({ ...newData, remarks: e.target.value })
              }
            />
            <input
              type="text"
              className="form-control col-sm-4 col-md-3 col-lg-2"
              placeholder="Area"
              value={newData.area}
              onChange={(e) =>
                setNewData({ ...newData, area: e.target.value })
              }
            />
            {!editData ? (
              <button
                className="btn btn-primary"
                onClick={handleCreateNewData}
              >
                Add New
              </button>
            ) : (
              <button className="btn btn-success" onClick={handleUpdateData}>
                Update
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          {filteredData.length > rowsPerPage && (
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={goToPreviousPage}
                  aria-label="Previous"
                >
                  <span aria-hidden="true">&laquo;</span>
                  <span className="sr-only">Previous</span>
                </button>
              </li>
              {range.map((page) => (
                <li
                  key={page}
                  className={`page-item ${currentPage === page ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => handlePageChange(page)}>
                    {page}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={goToNextPage}
                  aria-label="Next"
                >
                  <span aria-hidden="true">&raquo;</span>
                  <span className="sr-only">Next</span>
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;