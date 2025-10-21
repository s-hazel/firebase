import "./Nav.css"
import { signOut } from "firebase/auth"
import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext.js";
import { auth } from "../fb/fbConfig.js"
import { NavLink, useNavigate, Outlet } from "react-router-dom"

const Nav = () => {
    const { setSignedIn } = useContext(AuthContext);
    const navigate = useNavigate()

    const handleOut = () => {

        signOut(auth)
            .then(() => {
                setSignedIn(false)
                navigate("/")
            })
            .catch((err) => {
                alert("Error signing out: ", err)
            })
    }

    const hideHam = () => {
        document.getElementById("ham").checked = false;
    }

    return (
        <>
            <div className="sidebar">
                <input type="checkbox" name="ham" id="ham" className="hidden-check" />
                <div>
                    <div className="topbar">
                        <img src="./main-logo.jpeg" alt="" className="nav-logo" />
                        <label htmlFor="ham">
                            <span className="hamburger material-symbols-rounded">
                                menu
                            </span>
                        </label>
                    </div>
                    <div id="pages" className="pages">
                        <NavLink to="/dashboard" className="link" activeClassName="active" onClick={hideHam}>
                            <span className="material-symbols-rounded">
                                grid_view
                            </span>
                            <span className="link-label">
                                Dashboard
                            </span>
                        </NavLink>
                        <NavLink to="/schedule" className="link" activeClassName="active" onClick={hideHam}>
                            <span className="material-symbols-rounded">
                                calendar_today
                            </span>
                            <span className="link-label">
                                Schedule
                            </span>
                        </NavLink>
                        <NavLink to="/announcements" className="link" activeClassName="active" onClick={hideHam}>
                            <span className="material-symbols-rounded">
                                campaign
                            </span>
                            <span className="link-label">
                                Announcements
                            </span>
                        </NavLink>
                        <NavLink to="/colors" className="link" activeClassName="active" onClick={hideHam}>
                           <span className="material-symbols-rounded">
                                palette
                            </span>
                            <span className="link-label">
                                Colors
                            </span>
                        </NavLink>
                        <NavLink to="/resources" className="link" activeClassName="active" onClick={hideHam}>
                            <span className="material-symbols-rounded">
                                help
                            </span>
                            <span className="link-label">
                                Resources
                            </span>
                        </NavLink>
                    </div>
                </div>
                <button onClick={handleOut} className="log-out">
                    <span className="material-symbols-rounded">
                        logout
                    </span>
                    <span className="link-label">
                        Sign Out
                    </span>
                </button>
            </div>
        </>
    )
}

export default Nav