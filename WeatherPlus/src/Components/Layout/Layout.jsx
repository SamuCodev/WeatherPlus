import { Outlet } from "react-router-dom";
import { NavBar } from "../NavBar/NavBar";

import "./Layout.css";

export const Layout = () => {
    return (
        <div className="layout">
            <NavBar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};
