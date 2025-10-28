import axios from "axios"

export const API_CONFIG = {
    BASE_URL: "http://18.117.29.228:5000",
    // BASE_URL: "http://192.168.1.2:5000",

    // Endpoints de la API
    ENDPOINTS: {
        LOGIN: "/login",
        LOGOUT: "/logout",
        CLIENTES_EJECUTIVO: "/ConsultaClientesEjecutivo",
        DETALLE_CREDITO: "/DetalleMovimientosCliente",
        AGREGAR_PAGO_CLIENTE: "/AgregarPagoCliente",
        CATALOGO_TIPOS_PAGO: "/CatalogoTiposPago",
        RESUMEN_DIARIO: "/ResumenDiario",
        REGISTRO_VISITA: "/RegistrarVisita",
        CATALOGO_MOTIVOS_VISITA: "/CatalogoMotivosVisita"
    },

    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        UNPROCESSABLE_ENTITY: 422,
        INTERNAL_SERVER_ERROR: 500
    },

    AXIOS_CONFIG: {
        timeout: 10000, // 10 segundos
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }
    }
}

// Crear instancia de axios con configuración base
export const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    ...API_CONFIG.AXIOS_CONFIG
})

// Implementación alternativa usando fetch
// export const apiClient = {
//     async request({ url, method = "GET", data = null, headers = {}, params = {} }) {
//         // Construir la URL con parámetros si existen
//         let fullUrl = API_CONFIG.BASE_URL + url
//         if (params && Object.keys(params).length > 0) {
//             const query = new URLSearchParams(params).toString()
//             fullUrl += `?${query}`
//         }

//         // Configuración de headers
//         const configHeaders = {
//             ...API_CONFIG.AXIOS_CONFIG.headers,
//             ...headers
//         }

//         // Configuración de la petición
//         const fetchConfig = {
//             method,
//             headers: configHeaders
//         }
//         if (data) {
//             fetchConfig.body = JSON.stringify(data)
//         }

//         // Timeout manual
//         const controller = new AbortController()
//         const timeout = setTimeout(() => controller.abort(), API_CONFIG.AXIOS_CONFIG.timeout)
//         fetchConfig.signal = controller.signal

//         try {
//             console.log("API Request:", { method, fullUrl })

//             const response = await fetch(fullUrl, fetchConfig)
//             clearTimeout(timeout)
//             const contentType = response.headers.get("content-type")
//             let responseData
//             if (contentType && contentType.includes("application/json")) {
//                 responseData = await response.json()
//             } else {
//                 responseData = await response.text()
//             }
//             return {
//                 status: response.status,
//                 data: responseData
//             }
//         } catch (error) {
//             clearTimeout(timeout)
//             if (error.name === "AbortError") {
//                 return {
//                     status: null,
//                     error: "La petición ha sido abortada por timeout"
//                 }
//             }
//             if (error.name === "TypeError") {
//                 return {
//                     status: null,
//                     error: "Error de red o CORS"
//                 }
//             }
//             if (error.response) {
//                 console.log("API Response Error:", error.response)

//                 const errorData = await error.response.json()
//                 return {
//                     status: error.response.status,
//                     error: errorData
//                 }
//             }
//         }
//     },
//     get(url, config = {}) {
//         return this.request({ url, method: "GET", ...config })
//     },
//     post(url, data, config = {}) {
//         return this.request({ url, method: "POST", data, ...config })
//     },
//     put(url, data, config = {}) {
//         return this.request({ url, method: "PUT", data, ...config })
//     },
//     delete(url, config = {}) {
//         return this.request({ url, method: "DELETE", ...config })
//     }
// }
