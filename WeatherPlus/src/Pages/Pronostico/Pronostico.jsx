import { useState, useEffect } from "react";
import {
    IconSearch,
    IconCurrentLocation,
    IconRefresh,
    IconMapPin,
    IconSunrise,
    IconSunset,
    IconWind,
    IconDroplet,
    IconGauge,
    IconEye,
    IconCompass,
    IconTemperature,
    IconChevronDown,
    IconChevronUp,
    IconClock,
} from "@tabler/icons-react";
import { useAjustes } from "../../Context/AjustesContext";
import {
    convertirTemperatura,
    convertirViento,
    obtenerEtiquetaTemperatura,
    obtenerEtiquetaViento,
    obtenerDireccionViento,
} from "../../utils/unidades";
import { procesarPronostico } from "../../utils/climaHelpers";
import {
    obtenerPronostico,
    obtenerPronosticoPorCoords,
} from "../../services/clima";
import { WeatherIcon } from "../../Components/WeatherIcon/WeatherIcon";
import { toast } from "react-hot-toast";
import "./Pronostico.css";

export const Pronostico = () => {
    const { ciudadActual, setCiudadActual, tempUnit, windUnit } = useAjustes();
    const [busqueda, setBusqueda] = useState("");
    const [datosPronostico, setDatosPronostico] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [buscandoUbicacion, setBuscandoUbicacion] = useState(false);
    const [vistaActiva, setVistaActiva] = useState("diaria");
    const [diaExpandido, setDiaExpandido] = useState(null);

    useEffect(() => {
        if (!ciudadActual) return;
        let activo = true;

        obtenerPronostico(ciudadActual)
            .then((respuesta) => {
                if (!activo) return;
                setCargando(false);

                if (respuesta && respuesta.list) {
                    const procesado = procesarPronostico(respuesta);
                    setDatosPronostico(procesado);
                    if (procesado?.dias?.length > 0) {
                        setDiaExpandido((prev) => prev || procesado.dias[0].fecha);
                    }
                } else {
                    toast.error(`No se encontró pronóstico para "${ciudadActual}".`, {
                        id: "pronostico",
                    });
                }
            })
            .catch((error) => {
                if (!activo) return;
                setCargando(false);
                console.error("Error al cargar pronóstico:", error);
                toast.error("Error al obtener datos del pronóstico.", {
                    id: "pronostico",
                });
            });

        return () => {
            activo = false;
        };
    }, [ciudadActual]);

    const handleSearch = (e) => {
        e.preventDefault();
        const termino = busqueda.trim();
        if (!termino) return;
        setCargando(true);
        setCiudadActual(termino);
        setBusqueda("");
    };

    const handleRefresh = () => {
        setCargando(true);
        obtenerPronostico(ciudadActual)
            .then((respuesta) => {
                setCargando(false);
                if (respuesta && respuesta.list) {
                    const procesado = procesarPronostico(respuesta);
                    setDatosPronostico(procesado);
                    toast.success("Pronóstico actualizado.", { id: "pronostico" });
                }
            })
            .catch(() => {
                setCargando(false);
            });
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
                    const respuesta = await obtenerPronosticoPorCoords(
                        latitude,
                        longitude
                    );
                    setBuscandoUbicacion(false);

                    if (!respuesta || !respuesta.list || !respuesta.city) {
                        return toast.error(
                            "No se pudo obtener el pronóstico de tu ubicación.",
                            { id: "geo" }
                        );
                    }

                    const procesado = procesarPronostico(respuesta);
                    setDatosPronostico(procesado);
                    if (procesado?.dias?.length > 0) {
                        setDiaExpandido(procesado.dias[0].fecha);
                    }
                    setCiudadActual(respuesta.city.name);

                    toast.success(
                        `Pronóstico cargado para ${respuesta.city.name}, ${respuesta.city.country}`,
                        { id: "geo" }
                    );
                } catch {
                    setBuscandoUbicacion(false);
                    toast.error("Error al procesar la ubicación.", { id: "geo" });
                }
            },
            (error) => {
                setBuscandoUbicacion(false);
                let mensaje = "No se pudo obtener tu ubicación.";
                if (error.code === error.PERMISSION_DENIED) {
                    mensaje = "Permiso de ubicación denegado.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    mensaje = "Ubicación no disponible.";
                } else if (error.code === error.TIMEOUT) {
                    mensaje = "Tiempo agotado al buscar tu ubicación.";
                }
                toast.error(mensaje, { id: "geo" });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    };

    const etiquetaTemp = obtenerEtiquetaTemperatura(tempUnit);
    const etiquetaViento = obtenerEtiquetaViento(windUnit);

    const toggleDia = (fecha) => {
        setDiaExpandido(diaExpandido === fecha ? null : fecha);
    };

    return (
        <section className="pronostico__container">
            {/* Barra de Búsqueda y Herramientas */}
            <div className="pronostico__toolbar">
                <form className="pronostico__buscador" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Buscar ciudad para pronóstico..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        aria-label="Buscar ciudad para pronóstico"
                    />
                    <button
                        type="submit"
                        className="btn__accion"
                        title="Buscar pronóstico"
                    >
                        <IconSearch size={20} stroke={2} />
                    </button>
                    <button
                        type="button"
                        className={`btn__accion ${
                            buscandoUbicacion ? "btn__accion--loading" : ""
                        }`}
                        onClick={handleUbicacion}
                        disabled={buscandoUbicacion}
                        title="Obtener pronóstico de mi ubicación actual"
                    >
                        <IconCurrentLocation size={20} stroke={2} />
                    </button>
                    <button
                        type="button"
                        className="btn__accion"
                        onClick={handleRefresh}
                        title="Actualizar pronóstico"
                    >
                        <IconRefresh size={20} stroke={2} />
                    </button>
                </form>
            </div>

            {cargando && !datosPronostico && (
                <div className="pronostico__loading-card">
                    <div className="pronostico__spinner-lg"></div>
                    <p>Obteniendo pronóstico meteorológico detallado...</p>
                </div>
            )}

            {!cargando && !datosPronostico && (
                <div className="pronostico__empty-card">
                    <p>No hay datos disponibles para la ciudad seleccionada.</p>
                    <button
                        className="btn__reintentar"
                        onClick={handleRefresh}
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {datosPronostico && (
                <>
                    {/* Tarjeta Resumen / Encabezado de Ciudad */}
                    <div className="pronostico__hero">
                        <div className="hero__info">
                            <div className="hero__titulo">
                                <IconMapPin size={28} className="icono__ubicacion" />
                                <div>
                                    <h2>
                                        {datosPronostico.ciudad.nombre}
                                        <span className="pais__badge">
                                            {datosPronostico.ciudad.pais}
                                        </span>
                                    </h2>
                                    <span className="hero__sub">
                                        Coord: {datosPronostico.ciudad.coord?.lat?.toFixed(2)}°,{" "}
                                        {datosPronostico.ciudad.coord?.lon?.toFixed(2)}°
                                        {datosPronostico.ciudad.poblacion > 0 && (
                                            <>
                                                {" • "}Población:{" "}
                                                {datosPronostico.ciudad.poblacion.toLocaleString()}
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <p className="hero__descripcion">
                                Pronóstico extendido para los próximos 5 días con análisis
                                cada 3 horas.
                            </p>
                        </div>

                        <div className="hero__solar">
                            <div className="solar__item">
                                <IconSunrise size={28} className="icono__amanecer" />
                                <div>
                                    <span className="solar__etiqueta">Amanecer</span>
                                    <p className="solar__valor">
                                        {datosPronostico.ciudad.amanecer}
                                    </p>
                                </div>
                            </div>
                            <div className="solar__item">
                                <IconSunset size={28} className="icono__atardecer" />
                                <div>
                                    <span className="solar__etiqueta">Atardecer</span>
                                    <p className="solar__valor">
                                        {datosPronostico.ciudad.atardecer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Selector de Vistas / Pestañas */}
                    <div className="pronostico__tabs">
                        <button
                            className={`tab__btn ${
                                vistaActiva === "diaria" ? "tab__btn--active" : ""
                            }`}
                            onClick={() => setVistaActiva("diaria")}
                        >
                            Vista Diaria (5 Días)
                        </button>
                        <button
                            className={`tab__btn ${
                                vistaActiva === "horaria" ? "tab__btn--active" : ""
                            }`}
                            onClick={() => setVistaActiva("horaria")}
                        >
                            Próximas Horas (24h)
                        </button>
                        <button
                            className={`tab__btn ${
                                vistaActiva === "metricas" ? "tab__btn--active" : ""
                            }`}
                            onClick={() => setVistaActiva("metricas")}
                        >
                            Métricas Clave
                        </button>
                    </div>

                    {/* VISTA 1: PRONÓSTICO DIARIO (5 DÍAS CON ACORDEÓN DESPLEGABLE) */}
                    {vistaActiva === "diaria" && (
                        <div className="dias__container">
                            {datosPronostico.dias.map((dia) => {
                                const isExpanded = diaExpandido === dia.fecha;
                                return (
                                    <div
                                        key={dia.fecha}
                                        className={`dia__card ${
                                            isExpanded ? "dia__card--expanded" : ""
                                        }`}
                                    >
                                        <div
                                            className="dia__card-header"
                                            onClick={() => toggleDia(dia.fecha)}
                                            role="button"
                                            tabIndex={0}
                                            aria-expanded={isExpanded}
                                        >
                                            <div className="dia__info-primaria">
                                                <span className="dia__titulo">
                                                    {dia.diaEtiqueta}
                                                </span>
                                                <span className="dia__subfecha">
                                                    {dia.fechaCorta}
                                                </span>
                                            </div>

                                            <div className="dia__condicion">
                                                <WeatherIcon
                                                    condition={dia.condicion}
                                                    iconCode={dia.icon}
                                                    size={36}
                                                />
                                                <span className="dia__desc">
                                                    {dia.descripcion}
                                                </span>
                                            </div>

                                            <div className="dia__metricas-resumen">
                                                <div
                                                    className="metrica__mini"
                                                    title="Probabilidad de lluvia"
                                                >
                                                    <IconDroplet
                                                        size={18}
                                                        color="#38bdf8"
                                                    />
                                                    <span>{dia.popMax}%</span>
                                                </div>
                                                <div
                                                    className="metrica__mini"
                                                    title="Viento máximo"
                                                >
                                                    <IconWind
                                                        size={18}
                                                        color="var(--acento)"
                                                    />
                                                    <span>
                                                        {convertirViento(
                                                            dia.vientoMax,
                                                            windUnit
                                                        )}{" "}
                                                        {etiquetaViento}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="dia__termometro">
                                                <span className="temp__alta">
                                                    {convertirTemperatura(
                                                        dia.tempMax,
                                                        tempUnit
                                                    )}
                                                    {etiquetaTemp}
                                                </span>
                                                <div className="temp__barra">
                                                    <span className="temp__barra-fill"></span>
                                                </div>
                                                <span className="temp__baja">
                                                    {convertirTemperatura(
                                                        dia.tempMin,
                                                        tempUnit
                                                    )}
                                                    {etiquetaTemp}
                                                </span>
                                            </div>

                                            <button
                                                className="dia__toggle-btn"
                                                aria-label="Ver detalles por horas"
                                            >
                                                {isExpanded ? (
                                                    <IconChevronUp size={20} />
                                                ) : (
                                                    <IconChevronDown size={20} />
                                                )}
                                            </button>
                                        </div>

                                        {/* Detalle expandible con mediciones cada 3 horas */}
                                        {isExpanded && (
                                            <div className="dia__detalle">
                                                <h4 className="detalle__titulo">
                                                    <IconClock size={16} />
                                                    Desglose por horas para {dia.diaEtiqueta} (
                                                    {dia.fechaCorta})
                                                </h4>
                                                <div className="detalle__grid">
                                                    {dia.horas.map((h, i) => (
                                                        <div
                                                            key={h.dt || i}
                                                            className="hora__card"
                                                        >
                                                            <span className="hora__tiempo">
                                                                {h.hora}
                                                            </span>
                                                            <WeatherIcon
                                                                condition={h.condicion}
                                                                iconCode={h.icon}
                                                                size={28}
                                                            />
                                                            <span className="hora__temp">
                                                                {convertirTemperatura(
                                                                    h.temp,
                                                                    tempUnit
                                                                )}
                                                                {etiquetaTemp}
                                                            </span>
                                                            <span className="hora__desc">
                                                                {h.descripcion}
                                                            </span>
                                                            <div className="hora__stats">
                                                                <span title="Lluvia">
                                                                    <IconDroplet size={14} />{" "}
                                                                    {h.pop}%
                                                                </span>
                                                                <span title="Viento">
                                                                    <IconWind size={14} />{" "}
                                                                    {convertirViento(
                                                                        h.viento,
                                                                        windUnit
                                                                    )}{" "}
                                                                    {etiquetaViento}
                                                                </span>
                                                                <span title="Humedad">
                                                                    {h.humedad}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* VISTA 2: PRONÓSTICO HORARIO CONTINUO (PRÓXIMAS 24-30 HORAS) */}
                    {vistaActiva === "horaria" && (
                        <div className="horaria__container">
                            <div className="horaria__header">
                                <h3>Evolución de las próximas 24 horas</h3>
                                <span>Pronóstico continuo en intervalos de 3 horas</span>
                            </div>
                            <div className="horaria__scroll">
                                {datosPronostico.proximasHoras.map((horaItem, idx) => (
                                    <div key={horaItem.dt || idx} className="timeline__card">
                                        <span className="timeline__dia">
                                            {horaItem.diaCorto}
                                        </span>
                                        <span className="timeline__hora">
                                            {horaItem.hora}
                                        </span>
                                        <div className="timeline__icon">
                                            <WeatherIcon
                                                condition={horaItem.condicion}
                                                iconCode={horaItem.icon}
                                                size={36}
                                            />
                                        </div>
                                        <span className="timeline__temp">
                                            {convertirTemperatura(
                                                horaItem.temp,
                                                tempUnit
                                            )}
                                            {etiquetaTemp}
                                        </span>
                                        <span className="timeline__sensacion">
                                            Sens:{" "}
                                            {convertirTemperatura(
                                                horaItem.sensacion,
                                                tempUnit
                                            )}
                                            {etiquetaTemp}
                                        </span>
                                        <div className="timeline__pop">
                                            <IconDroplet size={14} color="#38bdf8" />
                                            <span>{horaItem.pop}%</span>
                                        </div>
                                        <div className="timeline__extra">
                                            <span>
                                                {convertirViento(
                                                    horaItem.viento,
                                                    windUnit
                                                )}{" "}
                                                {etiquetaViento}
                                            </span>
                                            <span>{horaItem.humedad}% hum</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* VISTA 3: MÉTRICAS CLAVE Y CONDICIONES ATMOSFÉRICAS */}
                    {vistaActiva === "metricas" && (
                        <div className="metricas__grid">
                            {/* Tarjeta 1: Ciclo Solar */}
                            <div className="metrica__card">
                                <div className="metrica__card-header">
                                    <IconSunrise size={24} className="icono__amanecer" />
                                    <h4>Ciclo Solar</h4>
                                </div>
                                <div className="metrica__card-body">
                                    <div className="ciclo__fila">
                                        <span>Salida del sol:</span>
                                        <strong>{datosPronostico.ciudad.amanecer}</strong>
                                    </div>
                                    <div className="ciclo__fila">
                                        <span>Puesta del sol:</span>
                                        <strong>{datosPronostico.ciudad.atardecer}</strong>
                                    </div>
                                    <div className="ciclo__fila">
                                        <span>Zona Horaria:</span>
                                        <strong>
                                            UTC{" "}
                                            {datosPronostico.ciudad.timezone >= 0
                                                ? `+${datosPronostico.ciudad.timezone / 3600}`
                                                : `${datosPronostico.ciudad.timezone / 3600}`}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            {/* Tarjeta 2: Viento y Dirección */}
                            <div className="metrica__card">
                                <div className="metrica__card-header">
                                    <IconWind size={24} color="var(--acento)" />
                                    <h4>Viento y Ráfagas</h4>
                                </div>
                                <div className="metrica__card-body">
                                    <div className="ciclo__fila">
                                        <span>Velocidad media:</span>
                                        <strong>
                                            {convertirViento(
                                                datosPronostico.dias[0]?.vientoMax,
                                                windUnit
                                            )}{" "}
                                            {etiquetaViento}
                                        </strong>
                                    </div>
                                    <div className="ciclo__fila">
                                        <span>Dirección estimada:</span>
                                        <strong>
                                            {obtenerDireccionViento(
                                                datosPronostico.dias[0]?.vientoDeg
                                            )}{" "}
                                            ({datosPronostico.dias[0]?.vientoDeg || 0}°)
                                        </strong>
                                    </div>
                                    <div className="ciclo__fila">
                                        <span>Rosa de los vientos:</span>
                                        <IconCompass size={22} color="var(--acento)" />
                                    </div>
                                </div>
                            </div>

                            {/* Tarjeta 3: Probabilidad y Volumen de Precipitación */}
                            <div className="metrica__card">
                                <div className="metrica__card-header">
                                    <IconDroplet size={24} color="#38bdf8" />
                                    <h4>Precipitación</h4>
                                </div>
                                <div className="metrica__card-body">
                                    <div className="ciclo__fila">
                                        <span>Probabilidad máx hoy:</span>
                                        <strong className="texto__lluvia">
                                            {datosPronostico.dias[0]?.popMax}%
                                        </strong>
                                    </div>
                                    <div className="ciclo__fila">
                                        <span>Lluvia acumulada prevista:</span>
                                        <strong>
                                            {datosPronostico.dias[0]?.lluviaTotal} mm
                                        </strong>
                                    </div>
                                    <div className="ciclo__fila">
                                        <span>Humedad relativa:</span>
                                        <strong>
                                            {datosPronostico.dias[0]?.humedadPromedio}%
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            {/* Tarjeta 4: Presión Barométrica */}
                            <div className="metrica__card">
                                <div className="metrica__card-header">
                                    <IconGauge size={24} color="#34d399" />
                                    <h4>Presión Atmosférica</h4>
                                </div>
                                <div className="metrica__card-body">
                                    <div className="ciclo__fila">
                                        <span>Presión promedio:</span>
                                        <strong>
                                            {datosPronostico.dias[0]?.presionPromedio} hPa
                                        </strong>
                                    </div>
                                    <div className="ciclo__fila">
                                        <span>Estado barométrico:</span>
                                        <strong>
                                            {datosPronostico.dias[0]?.presionPromedio > 1013
                                                ? "Alta (Estable)"
                                                : "Baja (Posible lluvia)"}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            {/* Tarjeta 5: Rango Térmico del Periodo */}
                            <div className="metrica__card">
                                <div className="metrica__card-header">
                                    <IconTemperature size={24} color="#f59e0b" />
                                    <h4>Rango Térmico Semanal</h4>
                                </div>
                                <div className="metrica__card-body">
                                    <div className="ciclo__fila">
                                        <span>Máxima esperada:</span>
                                        <strong className="texto__calor">
                                            {convertirTemperatura(
                                                Math.max(
                                                    ...datosPronostico.dias.map(
                                                        (d) => d.tempMax
                                                    )
                                                ),
                                                tempUnit
                                            )}
                                            {etiquetaTemp}
                                        </strong>
                                    </div>
                                    <div className="ciclo__fila">
                                        <span>Mínima esperada:</span>
                                        <strong className="texto__frio">
                                            {convertirTemperatura(
                                                Math.min(
                                                    ...datosPronostico.dias.map(
                                                        (d) => d.tempMin
                                                    )
                                                ),
                                                tempUnit
                                            )}
                                            {etiquetaTemp}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            {/* Tarjeta 6: Nubosidad y Visibilidad */}
                            <div className="metrica__card">
                                <div className="metrica__card-header">
                                    <IconEye size={24} color="#94a3b8" />
                                    <h4>Nubosidad y Visibilidad</h4>
                                </div>
                                <div className="metrica__card-body">
                                    <div className="ciclo__fila">
                                        <span>Cobertura de nubes:</span>
                                        <strong>
                                            {datosPronostico.dias[0]?.nubosidadPromedio}%
                                        </strong>
                                    </div>
                                    <div className="ciclo__fila">
                                        <span>Condición visual:</span>
                                        <strong>
                                            {datosPronostico.dias[0]?.nubosidadPromedio > 70
                                                ? "Cielo muy nublado"
                                                : datosPronostico.dias[0]
                                                        ?.nubosidadPromedio > 30
                                                  ? "Parcialmente nublado"
                                                  : "Mayormente despejado"}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};
