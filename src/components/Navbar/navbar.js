
import React from 'react';
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import NavbarStyles from "./navbar.module.css";
import logo from "../../resources/images/umu_coat.png";

// Defines the navbar styles and behavior.
export default function Navbar() {
    return (
        <nav className={NavbarStyles.navbar}>
            <Link to="/" className={NavbarStyles.logo}>
                <img src={logo} width={40} height={40} alt="Home menu, displaying University of Murcia's logo." />
            </Link>
            <ul className={NavbarStyles.navlinks}>
                <input type="checkbox" className={NavbarStyles.checkbox_toggle} />
                <label className={NavbarStyles.hamburger}>&#9776;</label>
                <div className={NavbarStyles.menu}>
                    <li><CustomLink to="/">Home</CustomLink></li>
                    <li><CustomLink to="/queries">Queries</CustomLink></li>
                    <li><CustomLink to="/about">About</CustomLink></li>
                </div>
            </ul>

        </nav>
    )
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })

    return (
        <div className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </div>
    )
}