import axios from "axios"

export const API_CONFIG = {
    BASE_URL: "http://18.117.29.228:5000",

    // Endpoints de la API
    ENDPOINTS: {
        LOGIN: "/login",
        LOGOUT: "/logout",
        CLIENTES_EJECUTIVO: "/ConsultaClientesEjecutivo",
        DETALLE_CREDITO: "/DetalleMovimientosCliente"
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
        withCredentials: false,
        maxRedirects: 5,
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

export default apiClient