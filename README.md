<div align="center">

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![OpenWeather](https://img.shields.io/badge/API-OpenWeatherMap-orange?style=for-the-badge&logo=open-access&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router_7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

# ⛅ WeatherPlus

**WeatherPlus** es una aplicación web moderna, interactiva y reactiva desarrollada con **React 19** y **Vite**, diseñada para consultar el clima en tiempo real y explorar pronósticos meteorológicos extendidos y detallados en cualquier lugar del mundo a través de la API de **OpenWeatherMap**.

[Vista Previa](#-vistas-previas) • [Características](#-características) • [Tecnologías](#-tecnologías-utilizadas) • [Instalación](#-instalación-y-uso) • [Estructura](#-estructura-del-proyecto) • [Autor](#-autor)

---

</div>

## 🌟 Descripción

WeatherPlus combina diseño moderno, estética basada en **glassmorphism**, fondos dinámicos y arquitectura de componentes reutilizables. Ofrece una experiencia de usuario fluida con soporte para geolocalización nativa, visualización de métricas avanzadas (ciclo solar, sensación térmica, viento con rosa de los vientos, presión barométrica y visibilidad) y persistencia de preferencias de unidades.

---

## ✨ Características

- 📍 **Geolocalización Automática en 1 Clic**: Detección inmediata de las coordenadas geográficas (`lat`, `lon`) mediante la API nativa `navigator.geolocation` para obtener el clima local exacto.
- 🔍 **Búsqueda Dinámica Global**: Consulta rápida por nombre de ciudad o país con sincronización en toda la aplicación.
- 🌡️ **Monitoreo Climático en Tiempo Real**:
    - Temperatura actual y sensación térmica (_feels like_).
    - Rango térmico del día (mínimas y máximas).
    - Porcentaje de humedad relativa, presión barométrica (hPa) y velocidad de viento.
    - Iconos meteorológicos dinámicos adaptados para el día y la noche.
- 📅 **Pronóstico Extendido de 5 Días**:
    - Agrupación por días calendario considerando la zona horaria local de cada ciudad.
    - Barras visuales de gradiente de temperatura mínima y máxima.
    - Probabilidad de precipitación (% POP) y lluvia acumulada en mm.
    - **Desglose horario desplegable**: Acordeón interactivo que muestra las mediciones cada 3 horas para cada día seleccionado.
- ⏰ **Línea de Tiempo Continua (Próximas 24 Horas)**:
    - Carrusel horizontal interactivo que muestra la evolución horaria del clima a corto plazo.
- 📊 **Métricas Atmosféricas Avanzadas**:
    - **Ciclo Solar**: Horas exactas de salida (_amanecer_) y puesta del sol (_atardecer_).
    - **Viento & Ráfagas**: Velocidad convertida y dirección en grados con rosa de los vientos (N, NE, E, SE, S, SO, O, NO).
    - **Presión y Estabilidad**: Indicador barométrico de frentes de alta o baja presión.
    - **Nubosidad & Visibilidad**: Porcentaje de nubes y distancia de visibilidad en kilómetros.
- 🎨 **Fondos Dinámicos y Reactivos**: El gradiente de fondo de la aplicación cambia automáticamente para reflejar la condición climática actual (_Clear, Clouds, Rain, Thunderstorm, Snow, Mist_).
- ⚙️ **Panel de Ajustes y Personalización**:
    - Conversión dinámica de temperatura (**Celsius °C** / **Fahrenheit °F**).
    - Conversión de unidades de velocidad de viento (**m/s**, **km/h**, **mph**).
    - Configuración de ciudad predeterminada persistida en `localStorage`.
- 🔔 **Notificaciones Interactivas**: Feedback en tiempo real con toasts flotantes (`react-hot-toast`) ante búsquedas, geolocalización o errores de red.

---

## 🛠️ Tecnologías Utilizadas

- **Core**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Enrutamiento**: [React Router v7](https://reactrouter.com/)
- **Iconografía**: [@tabler/icons-react](https://tabler.io/icons)
- **Notificaciones**: [react-hot-toast](https://react-hot-toast.com/)
- **Estilos**: Vanilla CSS con Variables y Tokens de Diseño (`tokens.css`, `global.css`)
- **Gestión de Estado**: React Context API (`AjustesContext`) + Hooks personalizados
- **Persistencia**: Web Storage API (`localStorage` & `sessionStorage`)
- **Servicios**: OpenWeatherMap REST API (Current Weather & 5-Day/3-Hour Forecast)

---

## 📂 Estructura del Proyecto

```text
WeatherPlus/
├── legacy/                  # Versión original en Vanilla JavaScript
├── WeatherPlus/             # Aplicación moderna en React + Vite
│   ├── public/              # Recursos estáticos
│   ├── src/
│   │   ├── Components/      # Componentes UI reutilizables
│   │   │   ├── CardClima/       # Tarjeta principal de clima actual
│   │   │   ├── CardPronostico/  # Resumen de pronóstico de 5 días
│   │   │   ├── Layout/          # Estructura general y contenedor
│   │   │   ├── NavBar/          # Barra lateral de navegación
│   │   │   └── WeatherIcon/     # Mapeo inteligente de iconos climáticos
│   │   ├── Context/         # Contexto global para unidades y ciudad activa
│   │   │   └── AjustesContext.jsx
│   │   ├── Pages/           # Vistas principales de la aplicación
│   │   │   ├── Ajustes/         # Configuración de unidades y preferencias
│   │   │   ├── Home/            # Dashboard principal con buscador y tarjetas
│   │   │   └── Pronostico/      # Vista extendida (diaria, horaria y métricas)
│   │   ├── services/        # Servicios de comunicación con la API
│   │   │   └── clima.js         # Métodos de consulta por ciudad y coordenadas
│   │   ├── Styles/          # Tokens de diseño y estilos globales
│   │   │   ├── global.css
│   │   │   └── tokens.css
│   │   ├── utils/           # Funciones auxiliares y formateadores
│   │   │   ├── climaHelpers.js  # Agrupación y procesamiento de pronósticos
│   │   │   └── unidades.js      # Conversores de temperatura y viento
│   │   ├── App.jsx          # Configuración de rutas y proveedores
│   │   └── main.jsx         # Punto de entrada de la aplicación
│   ├── .env                 # Variables de entorno (API Keys y Endpoints)
│   ├── package.json         # Dependencias y scripts de ejecución
│   └── vite.config.js       # Configuración del bundler Vite
└── README.md
```

---

## 🚀 Instalación y Uso

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- Clave de API de [OpenWeatherMap](https://openweathermap.org/api)

### Pasos

1. **Clonar el repositorio:**

    ```bash
    git clone https://github.com/SamuCodev/WeatherPlus.git
    cd WeatherPlus/WeatherPlus
    ```

2. **Instalar dependencias:**

    ```bash
    npm install
    ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto `WeatherPlus/` con la siguiente configuración:

    ```env
    VITE_API_KEY="TU_API_KEY_DE_OPENWEATHER"
    VITE_CLIMA_API_URL="https://api.openweathermap.org/data/2.5/weather?units=metric&lang=es&q="
    VITE_PRONOSTICO_API_URL="https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=es&q="
    ```

4. **Ejecutar en modo de desarrollo:**

    ```bash
    npm run dev
    ```

    Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la aplicación.

5. **Compilar para producción:**
    ```bash
    npm run build
    ```

---

## 👤 Autor

**Samuel David**

- GitHub: [@SamuCodev](https://github.com/SamuCodev)
- Repositorio: [github.com/SamuCodev/WeatherPlus](https://github.com/SamuCodev/WeatherPlus)

---

<div align="center">
  <sub>Desarrollado con ❤️ usando React y OpenWeatherMap API</sub>
</div>
