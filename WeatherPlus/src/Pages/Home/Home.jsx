import { IconCurrentLocation, IconSearch } from "@tabler/icons-react";
import { CardClima } from "../../Components/CardClima/CardClima";
import { CardPronostico } from "../../Components/CardPronostico/CardPronostico";
import { useAjustes } from "../../Context/AjustesContext";
import "./Home.css";
import { useEffect, useState } from "react";
import { obtenerClima, obtenerClimaPorCoords } from "../../services/clima";
import { toast } from "react-hot-toast";

const fondosClima = {
    Clear: "var(--clear)",
    Clouds: "var(--clouds)",
    Rain: "var(--rain)",
    Thunderstorm: "var(--thunderstorm)",
    Snow: "var(--snow)",
    Mist: "var(--mist)",
    Drizzle: "var(--rain)",
    Fog: "var(--mist)",
    Haze: "var(--mist)",
    Smoke: "var(--mist)",
};

export const Home = () => {
    const { ciudadActual, setCiudadActual } = useAjustes();
    const [busqueda, setBusqueda] = useState("");
    const [climaData, setClimaData] = useState(null);
    const [cargandoClima, setCargandoClima] = useState(false);
    const [buscandoUbicacion, setBuscandoUbicacion] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        const termino = busqueda.trim();
        if (!termino) return;

        setCargandoClima(true);
        setCiudadActual(termino);
        setBusqueda("");
    };

    const handleUbicacion = () => {
        if (!navigator.geolocation) {
            return toast.error("La geolocalización no es compatible con tu navegador.", {
                id: "geo",
            });
        }

        setBuscandoUbicacion(true);
        toast.loading("Obteniendo tu ubicación actual...", { id: "geo" });

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const datos = await obtenerClimaPorCoords(latitude, longitude);
                    setBuscandoUbicacion(false);

                    if (!datos || !datos.weather || !datos.name) {
                        return toast.error("No se pudo obtener el clima para tu ubicación.", {
                            id: "geo",
                        });
                    }

                    setClimaData(datos);
                    setCiudadActual(datos.name);

                    const condicionPrincipal = datos.weather[0]?.main;
                    const nuevoFondo = fondosClima[condicionPrincipal] || "var(--fondo)";
                    document.body.style.background = nuevoFondo;

                    toast.success(`Ubicación encontrada: ${datos.name}, ${datos.sys?.country}`, {
                        id: "geo",
                    });
                } catch {
                    setBuscandoUbicacion(false);
                    toast.error("Error al procesar los datos de tu ubicación.", { id: "geo" });
                }
            },
            (error) => {
                setBuscandoUbicacion(false);
                let mensaje = "No se pudo obtener tu ubicación.";
                if (error.code === error.PERMISSION_DENIED) {
                    mensaje = "Permiso de ubicación denegado en el navegador.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    mensaje = "Ubicación no disponible en este momento.";
                } else if (error.code === error.TIMEOUT) {
                    mensaje = "Tiempo de espera agotado al buscar tu ubicación.";
                }
                toast.error(mensaje, { id: "geo" });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            }
        );
    };

    useEffect(() => {
        if (!ciudadActual) return;

        let activo = true;

        obtenerClima(ciudadActual).then((datos) => {
            if (!activo) return;
            setCargandoClima(false);

            if (!datos || !datos.weather) {
                return toast.error(`No se pudo encontrar la ciudad "${ciudadActual}".`, {
                    id: "clima",
                });
            }

            setClimaData(datos);
            const condicionPrincipal = datos.weather[0]?.main;
            const nuevoFondo = fondosClima[condicionPrincipal] || "var(--fondo)";
            document.body.style.background = nuevoFondo;
            toast.success(`Clima cargado para ${datos.name}.`, {
                id: "clima",
            });
        });

        return () => {
            activo = false;
        };
    }, [ciudadActual]);

    return (
        <section className="home__container">
            <form className="buscador" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Buscar ciudad o país..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    aria-label="Buscar ciudad"
                />
                <button
                    type="submit"
                    className="btn__buscar"
                    title="Buscar ciudad"
                    aria-label="Buscar"
                >
                    <IconSearch size={22} stroke={2} />
                </button>
                <button
                    type="button"
                    className={`btn__ubicacion ${
                        buscandoUbicacion ? "btn__ubicacion--loading" : ""
                    }`}
                    onClick={handleUbicacion}
                    disabled={buscandoUbicacion}
                    title="Usar mi ubicación actual"
                    aria-label="Usar mi ubicación actual"
                >
                    <IconCurrentLocation size={22} stroke={2} />
                </button>
            </form>
            <div className="home__card">
                <CardClima
                    ciudad={ciudadActual}
                    clima={climaData}
                    cargando={cargandoClima}
                />
                <CardPronostico ciudad={ciudadActual} />
            </div>
        </section>
    );
};
