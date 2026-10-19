const apiKey = import.meta.env.VITE_API_KEY;
const apiClimaUrl = import.meta.env.VITE_CLIMA_API_URL;
const apiPronosticoUrl = import.meta.env.VITE_PRONOSTICO_API_URL;

export const obtenerClima = async (ciudad) => {
    try {
        const response = await fetch(apiClimaUrl + ciudad + "&appid=" + apiKey);
        const datos = await response.json();
        return datos;
    } catch (error) {
        console.error("Error al obtener el clima:", error);
        return null;
    }
};

export const obtenerPronostico = async (ciudad) => {
    try {
        const response = await fetch(
            apiPronosticoUrl + ciudad + "&appid" + apiKey,
        );
        const datos = await response.json();
        return datos;
    } catch (error) {
        console.error("Error al obtener el clima: ", error);
        return null;
    }
};
