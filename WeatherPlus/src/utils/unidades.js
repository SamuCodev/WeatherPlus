export const convertirTemperatura = (value, unit) => {
    if (value === null || value === undefined || isNaN(value)) return "--";
    if (unit === "f" || unit === "f__temp") {
        return Math.round((Number(value) * 9) / 5 + 32);
    }
    return Math.round(Number(value));
};

export const convertirViento = (value, unit, prevUnit = "ms") => {
    if (value === null || value === undefined || isNaN(value)) return "--";
    const val = Number(value);
    if (unit === prevUnit) return Math.round(val);

    let ms = val;
    if (prevUnit === "kmh") ms = val / 3.6;
    if (prevUnit === "mph") ms = val / 2.237;

    if (unit === "kmh") return Math.round(ms * 3.6);
    if (unit === "mph") return Math.round(ms * 2.237);
    return Math.round(ms);
};

export const obtenerEtiquetaTemperatura = (unit) => {
    return unit === "f" || unit === "f__temp" ? "°F" : "°C";
};

export const obtenerEtiquetaViento = (unit) => {
    if (unit === "kmh") return "km/h";
    if (unit === "mph") return "mph";
    return "m/s";
};

export const obtenerDireccionViento = (deg) => {
    if (deg === null || deg === undefined) return "N";
    const direcciones = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
    const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
    return direcciones[index];
};
