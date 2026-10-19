import { IconCurrentLocation, IconSearch } from "@tabler/icons-react";
import { CardClima } from "../../Components/CardClima/CardClima";
import { CardPronostico } from "../../Components/CardPronostico/CardPronostico";

import "./Home.css";
import { useEffect, useState } from "react";
import { obtenerClima } from "../../Services/clima";
import { toast } from "react-hot-toast";

const fondosClima = {
    Clear: "var(--clear)",
    Clouds: "var(--clouds)",
    Rain: "var(--rain)",
    Thunderstorm: "var(--thunderstorm)",
    Snow: "var(--snow)",
    Mist: "var(--mist)",
};

export const Home = () => {
    const [ciudadSeleccionada, setCiudadSeleccionada] = useState("Itagui");
    const [busqueda, setBusqueda] = useState("");
    const [fondo, setFondo] = useState("var(--fondo)");

    const handleSearch = (e) => {
        e.preventDefault();
        if (!busqueda.trim()) return;

        setCiudadSeleccionada(busqueda.trim());
        setBusqueda("");
    };

    useEffect(() => {
        obtenerClima(ciudadSeleccionada).then((datos) => {
            if (!datos || !datos.weather) {
                return toast.error("No se pudo encontrar la ciudad.", { id: "clima" });
            }
            const condicionPrincipal = datos.weather[0]?.main;
            const nuevoFondo =
                fondosClima[condicionPrincipal] || "var(--fondo)";

            setFondo(nuevoFondo);
            document.body.style.background = nuevoFondo;
            toast.success("Se encontro la ciudad correctamente.", { id: "clima" });
        });
    }, [ciudadSeleccionada]);

    return (
        <section className="home__container">
            <form className="buscador" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Ciudad.."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button type="submit" className="btn__buscar">
                    <IconSearch size={22} stroke={2} />
                </button>
                <button
                    type="button"
                    className="btn__ubicacion"
                    onClick={() =>
                        toast("Buscando tu ubicación...", { icon: "📍" })
                    }
                >
                    <IconCurrentLocation size={22} stroke={2} />
                </button>
            </form>
            <div className="home__card">
                <CardClima ciudad={ciudadSeleccionada} />
                {/* <p className="titulo__pronostico">Pronostico 5 dias</p> */}
                <CardPronostico ciudad={ciudadSeleccionada} />
            </div>
        </section>
    );
};
