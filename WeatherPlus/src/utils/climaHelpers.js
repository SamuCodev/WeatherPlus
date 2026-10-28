export const formatearHoraUnix = (unixTimestamp, timezoneOffsetSeconds = 0) => {
    if (!unixTimestamp) return "--:--";
    const date = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
    const horas = String(date.getUTCHours()).padStart(2, "0");
    const minutos = String(date.getUTCMinutes()).padStart(2, "0");
    return `${horas}:${minutos}`;
};

export const procesarPronostico = (datos) => {
    if (!datos || !Array.isArray(datos.list) || datos.list.length === 0) {
        return null;
    }

    const cityTimezone = datos.city?.timezone || 0;
    const diasMap = new Map();

    const hoyLocalMs = Date.now() + cityTimezone * 1000;
    const hoyStr = new Date(hoyLocalMs).toISOString().split("T")[0];
    const mananaStr = new Date(hoyLocalMs + 86400000).toISOString().split("T")[0];

    datos.list.forEach((item) => {
        const localTimeMs = (item.dt + cityTimezone) * 1000;
        const localDate = new Date(localTimeMs);
        const fechaStr = localDate.toISOString().split("T")[0];

        if (!diasMap.has(fechaStr)) {
            diasMap.set(fechaStr, []);
        }
        diasMap.get(fechaStr).push(item);
    });

    const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const nombresDiasCortos = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    const diasPronostico = [];

    for (const [fechaStr, items] of diasMap.entries()) {
        const temps = items.map((i) => i.main.temp);
        const tempsMin = items.map((i) => i.main.temp_min);
        const tempsMax = items.map((i) => i.main.temp_max);
        const pops = items.map((i) => i.pop || 0);
        const humidities = items.map((i) => i.main.humidity || 0);
        const pressures = items.map((i) => i.main.pressure || 0);
        const clouds = items.map((i) => i.clouds?.all || 0);
        const winds = items.map((i) => i.wind?.speed || 0);

        // Prefer daytime forecast (11:00 - 15:00 UTC local)
        const itemMediodia =
            items.find((i) => {
                const hour = new Date((i.dt + cityTimezone) * 1000).getUTCHours();
                return hour >= 11 && hour <= 15;
            }) || items[Math.floor(items.length / 2)];

        const refDate = new Date((items[0].dt + cityTimezone) * 1000);
        const dayOfWeekIndex = refDate.getUTCDay();
        const diaNumero = refDate.getUTCDate();
        const mesNombre = meses[refDate.getUTCMonth()];

        let diaEtiqueta = nombresDias[dayOfWeekIndex];
        let diaEtiquetaCorto = nombresDiasCortos[dayOfWeekIndex];

        if (fechaStr === hoyStr) {
            diaEtiqueta = "Hoy";
            diaEtiquetaCorto = "Hoy";
        } else if (fechaStr === mananaStr) {
            diaEtiqueta = "Mañana";
            diaEtiquetaCorto = "Mañ";
        }

        const lluviaTotal = items.reduce((acc, curr) => acc + (curr.rain?.["3h"] || 0), 0);

        const horasDetalle = items.map((item) => {
            const hDate = new Date((item.dt + cityTimezone) * 1000);
            const horaStr = `${String(hDate.getUTCHours()).padStart(2, "0")}:00`;
            return {
                dt: item.dt,
                hora: horaStr,
                temp: item.main.temp,
                sensacion: item.main.feels_like,
                tempMin: item.main.temp_min,
                tempMax: item.main.temp_max,
                condicion: item.weather[0]?.main || "Clouds",
                descripcion: item.weather[0]?.description || "",
                icon: item.weather[0]?.icon || "01d",
                pop: Math.round((item.pop || 0) * 100),
                lluvia3h: item.rain?.["3h"] || 0,
                humedad: item.main.humidity,
                viento: item.wind.speed,
                vientoDeg: item.wind.deg,
                vientoGust: item.wind.gust,
                presion: item.main.pressure,
                nubosidad: item.clouds?.all || 0,
                visibilidad: item.visibility ? (item.visibility / 1000).toFixed(1) : null,
            };
        });

        diasPronostico.push({
            fecha: fechaStr,
            diaEtiqueta,
            diaEtiquetaCorto,
            fechaCorta: `${diaNumero} ${mesNombre}`,
            tempMin: Math.min(...tempsMin, ...temps),
            tempMax: Math.max(...tempsMax, ...temps),
            tempPromedio: temps.reduce((a, b) => a + b, 0) / temps.length,
            condicion: itemMediodia.weather[0]?.main || "Clouds",
            descripcion: itemMediodia.weather[0]?.description || "",
            icon: itemMediodia.weather[0]?.icon || "01d",
            popMax: Math.round(Math.max(...pops) * 100),
            lluviaTotal: Number(lluviaTotal.toFixed(1)),
            humedadPromedio: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
            presionPromedio: Math.round(pressures.reduce((a, b) => a + b, 0) / pressures.length),
            nubosidadPromedio: Math.round(clouds.reduce((a, b) => a + b, 0) / clouds.length),
            vientoMax: Math.max(...winds),
            vientoDeg: itemMediodia.wind?.deg,
            horas: horasDetalle,
        });
    }

    // Hourly forecast for the next 24-30h
    const proximasHoras = datos.list.slice(0, 10).map((item) => {
        const hDate = new Date((item.dt + cityTimezone) * 1000);
        const horaStr = `${String(hDate.getUTCHours()).padStart(2, "0")}:00`;
        const dayIndex = hDate.getUTCDay();
        return {
            dt: item.dt,
            hora: horaStr,
            diaCorto: nombresDiasCortos[dayIndex],
            temp: item.main.temp,
            sensacion: item.main.feels_like,
            condicion: item.weather[0]?.main || "Clouds",
            descripcion: item.weather[0]?.description || "",
            icon: item.weather[0]?.icon || "01d",
            pop: Math.round((item.pop || 0) * 100),
            lluvia3h: item.rain?.["3h"] || 0,
            humedad: item.main.humidity,
            viento: item.wind.speed,
            vientoDeg: item.wind.deg,
            presion: item.main.pressure,
        };
    });

    const city = datos.city || {};

    return {
        ciudad: {
            id: city.id,
            nombre: city.name,
            pais: city.country,
            coord: city.coord,
            poblacion: city.population,
            timezone: cityTimezone,
            amanecer: formatearHoraUnix(city.sunrise, cityTimezone),
            atardecer: formatearHoraUnix(city.sunset, cityTimezone),
            amanecerUnix: city.sunrise,
            atardecerUnix: city.sunset,
        },
        dias: diasPronostico.slice(0, 5),
        proximasHoras,
    };
};
