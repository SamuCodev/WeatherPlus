const apiKey = import.meta.env.VITE_API_KEY;
const apiClimaUrl = import.meta.env.VITE_CLIMA_API_URL;
const apiPronosticoUrl = import.meta.env.VITE_PRONOSTICO_API_URL;

export const obtenerClima = async (ciudad) => {
    try {
        if (!ciudad || !ciudad.trim()) return null;
        const response = await fetch(
            `${apiClimaUrl}${encodeURIComponent(ciudad.trim())}&appid=${apiKey}`
        );
        if (!response.ok) {
            console.error(`Error ${response.status} al obtener el clima`);
            return null;
        }
        const datos = await response.json();
        return datos;
    } catch (error) {
        console.error("Error al obtener el clima:", error);
        return null;
    }
};

export const obtenerClimaPorCoords = async (lat, lon) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?units=metric&lang=es&lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        if (!response.ok) {
            console.error(`Error ${response.status} al obtener el clima por coordenadas`);
            return null;
        }
        const datos = await response.json();
        return datos;
    } catch (error) {
        console.error("Error al obtener el clima por coordenadas:", error);
        return null;
    }
};

export const obtenerPronostico = async (ciudad) => {
    try {
        if (!ciudad || !ciudad.trim()) return null;
        const response = await fetch(
            `${apiPronosticoUrl}${encodeURIComponent(ciudad.trim())}&appid=${apiKey}`
        );
        if (!response.ok) {
            console.error(`Error ${response.status} al obtener el pronóstico`);
            return null;
        }
        const datos = await response.json();
        return datos;
    } catch (error) {
        console.error("Error al obtener el pronóstico: ", error);
        return null;
    }
};

export const obtenerPronosticoPorCoords = async (lat, lon) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=es&lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        if (!response.ok) {
            console.error(`Error ${response.status} al obtener el pronóstico por coordenadas`);
            return null;
        }
        const datos = await response.json();
        return datos;
    } catch (error) {
        console.error("Error al obtener el pronóstico por coordenadas: ", error);
        return null;
    }
};

