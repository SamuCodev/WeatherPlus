//Variable Globales

//API
const apiKey = "155004c6739f3e0e7f53148a43c13441"
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=es&q="

//Variables DOM para actualizar datos en la pagina
let temperatura = document.querySelector(".temperatura")
let descripcion = document.querySelector(".descripcion")
let ciudadNombre = document.querySelector(".ciudad")
let humedad = document.querySelector(".humedad")
let viento = document.querySelector(".viento")
let presion = document.querySelector(".presion")
let inputUser = document.querySelector(".input-ciudad")
let btnBuscar = document.querySelector(".btn-busqueda")
let btnUbicacion = document.querySelector(".btn-ubicacion")
let graduacion = document.querySelector(".temp-info")
let ciudadActual = ""

/*
Funcion async (Asincronica): Indica a JS que es una funcion que en su interior tendra
un await(Espera que se le devuelva la promesa, para obtener el dato necesario para poder continuar)

Funcion para obtener el clima en base al ingreso de el nombre de la ciudad del usuario.
*/
async function obtenerClima(ciudad) {
    if (ciudad == ""){
        alert("Por favor ingrese una ciudad.")
    }else{
        try {
            const respuesta = await fetch(apiUrl + ciudad + "&appid=" + apiKey) 
            const datos = await respuesta.json()
            ciudadActual = ciudad

            if (datos.cod == "404"){
                alert("ERROR 404: Esta ciudad no existe")
            }else{
                actualizarClima(datos)
                actualizarFondo(datos)
                obtenerPronostico(ciudad)
                inputUser.value = ""
            }
        } catch(error) {
            alert("Error de conexión, intentalo de nuevo.")
        }
    }
}

/*
Funcion para poder obtener el clima en base a la geolocalizacion del usuario pidiendole
su permiso y accediendo a esta para mostrar los datos
*/
function buscarClimaUbicacion(){
    navigator.geolocation.getCurrentPosition(async position => {
        let lat = position.coords.latitude
        let lon = position.coords.longitude

        const respuestaUbi = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lang=es&lat=${lat}&lon=${lon}&appid=${apiKey}`)
        const datosUbi = await respuestaUbi.json()
        ciudadActual = datosUbi.name

        actualizarClima(datosUbi)
        actualizarFondo(datosUbi)
        obtenerPronostico(ciudadActual)
    })

}
//Esta funcion actualiza los valores del clima en los elementos del HTML, en base a los actuales del clima
function actualizarClima(datos){
    cambiarGraduacion(datos)
    descripcion.textContent = datos.weather[0].description
    ciudadNombre.textContent = datos.name + ", " + datos.sys.country
    humedad.textContent = "Humedad " + datos.main.humidity + "%"
    viento.textContent = "Viento " + datos.wind.speed + "km/h"
    presion.textContent = "Presion " + datos.main.pressure + "mb"
}

function cambiarGraduacion(datos){
    if (graduacion.value == "celsius"){
        temperatura.textContent = Math.round(datos.main.temp) + " °C"
    }else if (graduacion.value == "fahrenheit"){
        let fahrenheit = Math.round((datos.main.temp * (9/5)) + 32)
        temperatura.textContent = fahrenheit + " °F"
    }
}
graduacion.addEventListener("change", () => {
if(ciudadActual != ""){
    obtenerClima(ciudadActual)
}
})

//Esta funcion actualiza el fondo dependiendo de los datos del clima que nos entregue la API
function actualizarFondo(datos){
    switch(datos.weather[0].main){
        case "Clear":
            document.body.className = "clear"
            break
        case "Clouds":
            document.body.className = "clouds"
            break
        case "Rain":
            document.body.className = "rain"
            break
        case "Thunderstorm":
            document.body.className = "thunderstorm"
            break
        case "Snow":
        document.body.className = "snow"
        break
        case "Mist":
            document.body.className = "mist"
            break
    }
}

async function obtenerPronostico(ciudad) {
    const respuesta = await fetch(`https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=es&q=${ciudad}&appid=${apiKey}`)
    const datos = await respuesta.json()
    const pronosticoDiario = datos.list.filter(item => item.dt_txt.includes("12:00:00"))
    mostrarPronostico(pronosticoDiario)
}

function mostrarPronostico(pronosticoDiarioCard){
    let cardPronostico = document.querySelector(".card-pronostico")
    cardPronostico.innerHTML= ""

    pronosticoDiarioCard.forEach(dia => {
        let fecha = new Date(dia.dt_txt) 
        let diaString = fecha.toLocaleDateString("es-ES", { weekday: "short" })
        diaString = diaString.charAt(0).toUpperCase() + diaString.slice(1)

        let cardDia = document.createElement("div")
        cardDia.classList.add("pronostico-dia")

        cardDia.innerHTML = `
        <p>${diaString}</p>
        <p>${Math.round(dia.main.temp)}°C</p>
        <p>${dia.weather[0].main}</p>
        `
        cardPronostico.appendChild(cardDia)
    });
}

//Cuando se presione el boton de la ubicacion, se llamara a la funcion de la ubicacion para poder acceder a los datos
btnUbicacion.addEventListener("click", () => {
    buscarClimaUbicacion()
})
//Cuando se presione el boton, con el valor del input se buscara la ciudad y mostrara los datos
btnBuscar.addEventListener("click", () => {
        obtenerClima(inputUser.value)
    })
//Cuando se presione enter y haya un valor en el input que sea valido, este mostrara los datos
inputUser.addEventListener("keypress", (evento) => {
        if(evento.key == "Enter"){
            obtenerClima(inputUser.value)
        }
    })   
//Cada 60 segundos se actualizara la informacion de la pagina
setInterval(() => {
    if(ciudadActual != ""){
        obtenerClima(ciudadActual)
    }
}, 60000)