/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react";

export const AjustesContext = createContext();

export const AjustesProvider = ({ children }) => {
    const [tempUnit, setTempUnit] = useState(() => {
        return localStorage.getItem("tempUnit") || "c__temp";
    });

    const [windUnit, setWindUnit] = useState(() => {
        return localStorage.getItem("windUnit") || "ms";
    });

    const [ciudadDefecto, setCiudadDefecto] = useState(() => {
        return localStorage.getItem("ciudadDefecto") || "Itagui";
    });

    const [ciudadActual, setCiudadActual] = useState(() => {
        return (
            sessionStorage.getItem("ciudadActual") ||
            localStorage.getItem("ciudadDefecto") ||
            "Itagui"
        );
    });

    useEffect(() => {
        localStorage.setItem("tempUnit", tempUnit);
    }, [tempUnit]);

    useEffect(() => {
        localStorage.setItem("windUnit", windUnit);
    }, [windUnit]);

    useEffect(() => {
        localStorage.setItem("ciudadDefecto", ciudadDefecto);
    }, [ciudadDefecto]);

    useEffect(() => {
        sessionStorage.setItem("ciudadActual", ciudadActual);
    }, [ciudadActual]);

    return (
        <AjustesContext.Provider
            value={{
                tempUnit,
                setTempUnit,
                windUnit,
                setWindUnit,
                ciudadDefecto,
                setCiudadDefecto,
                ciudadActual,
                setCiudadActual,
            }}
        >
            {children}
        </AjustesContext.Provider>
    );
};

export const useAjustes = () => useContext(AjustesContext);
