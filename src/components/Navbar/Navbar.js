
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import NavbarStyles from "./Navbar.module.css";

export default function Navbar() {
    return (
        <nav className="nav">
            <Link to="/" className="logo">
                Main
            </Link>
            <ul className="nav-links">
                <input type="checkbox" className="checkbox_toggle" />
                <label for="checkbox_toggle" className="hamburger">&#9776;</label>

                <div className="menu">
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
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}