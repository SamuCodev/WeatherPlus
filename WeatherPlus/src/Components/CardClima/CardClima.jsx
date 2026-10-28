import { useAjustes } from "../../Context/AjustesContext";
import {
    convertirTemperatura,
    convertirViento,
    obtenerEtiquetaTemperatura,
    obtenerEtiquetaViento,
} from "../../utils/unidades";
import { IconDroplet, IconWind, IconGauge } from "@tabler/icons-react";
import { WeatherIcon } from "../WeatherIcon/WeatherIcon";
import { obtenerClima } from "../../services/clima";
import "./CardClima.css";
import { useEffect, useState } from "react";

export const CardClima = ({ ciudad, clima: climaProp, cargando: cargandoProp }) => {
    const { tempUnit, windUnit } = useAjustes();
    const [climaLocal, setClimaLocal] = useState(null);
    const [cargandoLocal, setCargandoLocal] = useState(!climaProp);

    const clima = climaProp !== undefined ? climaProp : climaLocal;
    const cargando = cargandoProp !== undefined ? cargandoProp : cargandoLocal;

    useEffect(() => {
        if (climaProp !== undefined || !ciudad) return;

        let activo = true;
        obtenerClima(ciudad).then((datos) => {
            if (!activo) return;
            if (datos && datos.weather && datos.sys && datos.main) {
                setClimaLocal(datos);
            } else {
                setClimaLocal(null);
            }
            setCargandoLocal(false);
        });

        return () => {
            activo = false;
        };
    }, [ciudad, climaProp]);

    if (cargando && !clima) {
        return (
            <div className="card__clima card__clima--loading">
                <div className="card__spinner"></div>
                <p>Cargando clima actual...</p>
            </div>
        );
    }

    if (!clima || !clima.main || !clima.weather) {
        return (
            <div className="card__clima card__clima--error">
                <p>No se pudo cargar la información del clima.</p>
            </div>
        );
    }

    const condicion = clima.weather[0]?.main || "Clear";
    const iconCode = clima.weather[0]?.icon || "01d";
    const etiquetaTemp = obtenerEtiquetaTemperatura(tempUnit);
    const etiquetaViento = obtenerEtiquetaViento(windUnit);

    return (
        <div className="card__clima">
            <div className="clima__info">
                <span className="clima__ubicacion">
                    {clima.name}, {clima.sys?.country}
                </span>
                <div className="clima__temp-contenedor">
                    <WeatherIcon
                        condition={condicion}
                        iconCode={iconCode}
                        size={56}
                    />
                    <h2>
                        {convertirTemperatura(clima.main.temp, tempUnit)}
                        <span className="unidad__temp">{etiquetaTemp}</span>
                    </h2>
                </div>
                <span className="clima__descripcion">
                    {clima.weather[0]?.description}
                </span>
                <div className="clima__sensacion">
                    <span>
                        Sensación: {convertirTemperatura(clima.main.feels_like, tempUnit)}
                        {etiquetaTemp}
                    </span>
                    <span className="separador">•</span>
                    <span>
                        Mín: {convertirTemperatura(clima.main.temp_min, tempUnit)}
                        {etiquetaTemp} / Máx: {convertirTemperatura(clima.main.temp_max, tempUnit)}
                        {etiquetaTemp}
                    </span>
                </div>
            </div>
            <div className="clima__extra--info">
                <div className="humedad__info">
                    <IconDroplet size={28} stroke={2} />
                    <span>Humedad</span>
                    <p>{clima.main.humidity}%</p>
                </div>
                <div className="viento__info">
                    <IconWind size={28} stroke={2} />
                    <span>Viento</span>
                    <p>
                        {convertirViento(clima.wind?.speed, windUnit)}{" "}
                        {etiquetaViento}
                    </p>
                </div>
                <div className="presion__info">
                    <IconGauge size={28} stroke={2} />
                    <span>Presión</span>
                    <p>{clima.main.pressure} hPa</p>
                </div>
            </div>
        </div>
    );
};
