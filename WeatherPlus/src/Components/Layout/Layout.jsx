import { Outlet } from "react-router-dom";
import { NavBar } from "../NavBar/NavBar";

import "./Layout.css";

export const Layout = () => {
    return (
        <div className="layout">
            <NavBar />
            <main>
                <div className="content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
