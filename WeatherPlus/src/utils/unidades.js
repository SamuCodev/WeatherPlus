export const convertirTemperatura = (value, unit, prevUnit = "c") => {
    if (unit === prevUnit) return Math.round(value);

    if (unit === "f" || unit === "f__temp") {
        return Math.round((value * 9) / 5 + 32);
    } else {
        return Math.round(((value - 32) * 5) / 9);
    }
};

export const convertirViento = (value, unit, prevUnit = "ms") => {
    if (unit === prevUnit) return Math.round(value);

    let ms = value;
    if (prevUnit === "kmh") ms = value / 3.6;
    if (prevUnit === "mph") ms = value / 2.237;

    if (unit === "kmh") return Math.round(ms * 3.6);
    if (unit === "mph") return Math.round(ms * 2.237);
    return Math.round(ms);
};
