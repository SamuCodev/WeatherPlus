import {
    IconHome,
    IconCloud,
    IconSettings,
    IconCloudRain,
} from "@tabler/icons-react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

export const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="header-nav">
                <h1>WeatherPlus</h1>
                <IconCloud size={28} stroke={2} />
            </div>
            <div className="navbar__menu">
                <NavLink
                    to={"/"}
                    end
                    className={({ isActive }) =>
                        isActive
                            ? "navbar__item navbar__item--active"
                            : "navbar__item"
                    }
                >
                    <IconHome size={22} stroke={2} />
                    <span>Inicio</span>
                </NavLink>
                <NavLink
                    to={"/pronostico"}
                    end
                    className={({ isActive }) =>
                        isActive
                            ? "navbar__item navbar__item--active"
                            : "navbar__item"
                    }
                >
                    <IconCloudRain size={22} stroke={2} />
                    <span>Pronóstico</span>
                </NavLink>
                <NavLink
                    to={"/ajustes"}
                    end
                    className={({ isActive }) =>
                        isActive
                            ? "navbar__item navbar__item--active"
                            : "navbar__item"
                    }
                >
                    <IconSettings size={22} stroke={2} />
                    <span>Ajustes</span>
                </NavLink>
            </div>
        </nav>
    );
};
