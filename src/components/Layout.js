import React from "react";
import { Outlet } from "react-router-dom"
import Nav from "./Nav";
import "./Layout.css"
import { Banner } from "../pages/Dashboard";
import { useLocation } from 'react-router-dom';

const Layout = () => {
    const location = useLocation();
    const currentPage = location.pathname;

    return (
        <div className="layout">
            <div className="nav">
                <Nav />
            </div>
            <div className="right-side">
                {currentPage === "/dashboard" && <Banner />}
                <div className="outlet">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout