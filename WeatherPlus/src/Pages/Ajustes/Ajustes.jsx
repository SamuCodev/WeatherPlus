import { useAjustes } from "../../Context/AjustesContext";
import "./Ajustes.css";

export const Ajustes = () => {
    const {
        tempUnit,
        setTempUnit,
        windUnit,
        setWindUnit,
        ciudadDefecto,
        setCiudadDefecto,
    } = useAjustes();

    return (
        <section className="ajustes">
            <div className="title">
                <h2>Ajustes</h2>
            </div>
            <div className="options__container">
                <div className="op op__temp--unit">
                    <p>Unidad de temperatura</p>
                    <select
                        name="select__temp"
                        id="select__temp"
                        value={tempUnit}
                        onChange={(e) => setTempUnit(e.target.value)}
                    >
                        <option value="c__temp">°C</option>
                        <option value="f__temp">°F</option>
                    </select>
                </div>
                <div className="op op__wind--unit">
                    <p>Unidad de viento</p>
                    <select
                        name="select__wind"
                        id="select__wind"
                        value={windUnit}
                        onChange={(e) => setWindUnit(e.target.value)}
                    >
                        <option value="ms"> M/s</option>
                        <option value="kmh">Km/h</option>
                        <option value="mph">Mph</option>
                    </select>
                </div>
                <div className="op op__default--city">
                    <p>Ciudad por defecto</p>
                    <input
                        type="text"
                        value={ciudadDefecto}
                        onChange={(e) => setCiudadDefecto(e.target.value)}
                    />
                </div>
            </div>
        </section>
    );
};
