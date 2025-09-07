import React from 'react';
import {Link} from "react-router";

const Header = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme={"dark"}>
            <div className="container-fluid">
                <a className="navbar-brand" href="#">The Show</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin">Admin Panel</Link>
                        </li>
                    </ul>
                    <form className="d-flex flex-md-row flex-column gap-2" role="search">
                        <Link className="btn btn-outline-primary" to="/login">Login</Link>
                        <Link className="btn btn-outline-secondary" to={"/register"}>Register</Link>
                        <button className="btn btn-outline-warning" type="submit">Logout</button>
                    </form>
                </div>
            </div>
        </nav>
    );
};

export default Header;