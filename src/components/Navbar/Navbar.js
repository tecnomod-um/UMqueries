
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import NavbarStyles from "./Navbar.module.css";
import logo from "../../resources/icons/logo.webp";

export default function Navbar() {
    return (
        <nav className={NavbarStyles.navbar}>
            <Link to="/" className={NavbarStyles.logo}>
            <img src={logo} width={50} height={50} />
            </Link>
            <ul className={NavbarStyles.navlinks}>
                <input type="checkbox" className={NavbarStyles.checkbox_toggle} />
                <label for="checkbox_toggle" className={NavbarStyles.hamburger}>&#9776;</label>
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
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}