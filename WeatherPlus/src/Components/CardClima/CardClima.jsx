import { IconDroplet, IconWind, IconGauge } from "@tabler/icons-react";
import { obtenerClima } from "../../Services/clima";
import "./CardClima.css";
import { useEffect, useState } from "react";

export const CardClima = ({ ciudad }) => {
    const [clima, setClima] = useState(null);

    useEffect(() => {
        obtenerClima(ciudad).then((datos) => {
            if (datos && datos.weather && datos.sys && datos.main) {
                setClima(datos);
            }
        });
    }, [ciudad]);

    if (!clima) {
        return (
            <div className="card__clima">
                <p>Cargando clima...</p>
            </div>
        );
    }

    return (
        <div className="card__clima">
            <div className="clima__info">
                <span>
                    {clima.name}, {clima.sys.country}
                </span>
                <h2>{Math.round(clima.main.temp)} °C</h2>
                <span style={{ textTransform: "capitalize" }}>
                    {clima.weather[0].description}
                </span>
            </div>
            <div className="clima__extra--info">
                <div className="humedad__info">
                    <IconDroplet size={30} stroke={2} />
                    <span>Humedad</span>
                    <p>{clima.main.humidity}%</p>
                </div>
                <div className="viento__info">
                    <IconWind size={30} stroke={2} />
                    <span>Viento</span>
                    <p>{clima.wind.speed}km/h</p>
                </div>
                <div className="presion__info">
                    <IconGauge size={30} stroke={2} />
                    <span>Presion</span>
                    <p>{clima.main.pressure}mb</p>
                </div>
            </div>
        </div>
    );
};
