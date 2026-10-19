import { useEffect, useState } from "react";
import { convertirTemperatura, convertirViento } from "../../utils/unidades";
import "./Ajustes.css";

export const Ajustes = () => {
    const [tempUnit, setTempUnit] = useState("c__temp");
    const [windUnit, setWindUnit] = useState("ms");

    return (
        <section className="ajustes">
            <div className="title">
                <h2>Ajustes</h2>
            </div>
            <div className="options__container">
                <div className="op op__temp--unit">
                    <p>Unidad de temperatura</p>
                    <select name="select__temp" id="select__temp">
                        <option value="c__temp">°C</option>
                        <option value="f__temp">°F</option>
                    </select>
                </div>
                <div className="op op__wind--unit">
                    <p>Unidad de viento</p>
                    <select name="select__wind" id="select__wind">
                        <option value="ms"> M/s</option>
                        <option value="kmh">Km/h</option>
                        <option value="mph">Mph</option>
                    </select>
                </div>
                <div className="op op__default--city">
                    <p>Ciudad por defecto</p>
                    <input type="text" />
                </div>
            </div>
        </section>
    );
};
