import { useEffect, useState } from "react";
import { useAjustes } from "../../Context/AjustesContext";
import {
    convertirTemperatura,
    obtenerEtiquetaTemperatura,
} from "../../utils/unidades";
import { procesarPronostico } from "../../utils/climaHelpers";
import { obtenerPronostico } from "../../services/clima";
import { WeatherIcon } from "../WeatherIcon/WeatherIcon";
import { IconDroplet } from "@tabler/icons-react";
import "./CardPronostico.css";

export const CardPronostico = ({
    ciudad,
    pronostico: pronosticoProp,
    cargando: cargandoProp,
}) => {
    const { tempUnit } = useAjustes();
    const [pronosticoLocal, setPronosticoLocal] = useState(null);
    const [cargandoLocal, setCargandoLocal] = useState(!pronosticoProp);

    const pronosticoData =
        pronosticoProp !== undefined ? pronosticoProp : pronosticoLocal;
    const cargando =
        cargandoProp !== undefined ? cargandoProp : cargandoLocal;

    useEffect(() => {
        if (pronosticoProp !== undefined || !ciudad) return;

        let activo = true;
        obtenerPronostico(ciudad).then((datos) => {
            if (!activo) return;
            if (datos && datos.list) {
                const procesado = procesarPronostico(datos);
                setPronosticoLocal(procesado);
            } else {
                setPronosticoLocal(null);
            }
            setCargandoLocal(false);
        });

        return () => {
            activo = false;
        };
    }, [ciudad, pronosticoProp]);

    const etiquetaTemp = obtenerEtiquetaTemperatura(tempUnit);

    if (cargando && !pronosticoData) {
        return (
            <div className="card__pronostico card__pronostico--loading">
                <div className="pronostico__spinner"></div>
                <p>Cargando pronóstico...</p>
            </div>
        );
    }

    if (!pronosticoData || !pronosticoData.dias || pronosticoData.dias.length === 0) {
        return (
            <div className="card__pronostico card__pronostico--error">
                <p>No se pudo cargar el pronóstico de 5 días.</p>
            </div>
        );
    }

    return (
        <div className="card__pronostico">
            <div className="pronostico__header">
                <h3>Pronóstico de 5 días</h3>
                <span className="pronostico__subtitulo">Tendencia diaria</span>
            </div>
            <div className="pronostico__lista">
                {pronosticoData.dias.map((dia, index) => (
                    <div key={dia.fecha || index} className="dia__item">
                        <div className="dia__item-header">
                            <span className="dia__nombre">{dia.diaEtiquetaCorto}</span>
                            <span className="dia__fecha">{dia.fechaCorta}</span>
                        </div>

                        <div className="dia__item-clima">
                            <WeatherIcon
                                condition={dia.condicion}
                                iconCode={dia.icon}
                                size={26}
                            />
                            <span className="dia__descripcion">{dia.descripcion}</span>
                        </div>

                        {dia.popMax > 15 ? (
                            <div className="dia__lluvia" title="Probabilidad de lluvia">
                                <IconDroplet size={14} stroke={2.5} />
                                <span>{dia.popMax}%</span>
                            </div>
                        ) : (
                            <div className="dia__lluvia dia__lluvia--vacio"></div>
                        )}

                        <div className="dia__temperaturas">
                            <span className="temp__max">
                                {convertirTemperatura(dia.tempMax, tempUnit)}
                                {etiquetaTemp}
                            </span>
                            <span className="temp__min">
                                {convertirTemperatura(dia.tempMin, tempUnit)}
                                {etiquetaTemp}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
