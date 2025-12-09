import { apiClient, API_CONFIG } from "./api"
import storage from "../utils/storage"
import catalogos from "./catalogos"

/**
 * Servicios de autenticación
 */
export default {
    /**
     * Realizar login con usuario y contraseña
     * @param {string} usuario - Nombre de usuario
     * @param {string} password - Contraseña
     * @returns {Promise} - Respuesta de la API
     */
    login: async (usuario, password) => {
        try {
            const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
                usuario,
                password
            })
            console.log(response.status)

            // Si el login es exitoso, inicializar catálogos
            if (response.status === API_CONFIG.HTTP_STATUS.OK) {
                try {
                    await catalogos.inicializarCatalogos()
                } catch (error) {
                    console.warn("Error al inicializar catálogos tras login:", error)
                }
            }

            return {
                success: true,
                data: response.data,
                status: response.status
            }
        } catch (error) {
            console.error("Error de conexión:", error)
            let errorMessage = "Error de conexión"

            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        errorMessage = "Credenciales incorrectas"
                        break
                    case 500:
                        errorMessage = "Error interno del servidor"
                        break
                    default:
                        errorMessage = error.response.data?.message || "Error desconocido"
                }
            } else if (error.request) {
                errorMessage = "Error de conexión. Verifica tu internet"
            } else {
                errorMessage = "Error al procesar la petición"
            }

            return {
                success: false,
                error: errorMessage,
                status: error.response?.status || null
            }
        }
    },

    /**
     * Inicializar sesión (verificar si ya está logueado y cargar catálogos)
     * @returns {Promise} - Resultado de la inicialización
     */
    inicializarSesion: async () => {
        try {
            const token = await storage.getToken()

            if (token) {
                await catalogos.inicializarCatalogos()

                return {
                    success: true,
                    sesionActiva: true,
                    catalogosInicializados: true
                }
            } else {
                const tiposLocal = await catalogos.getTiposPagoLocal()

                return {
                    success: true,
                    sesionActiva: false,
                    catalogosInicializados: false,
                    tiposPagoLocal: tiposLocal
                }
            }
        } catch (error) {
            console.error("Error al inicializar sesión:", error)

            return {
                success: false,
                sesionActiva: false,
                catalogosInicializados: false,
                error: error.message
            }
        }
    },

    /**
     * Logout (para cuando necesites invalidar tokens)
     * @param {string} token - Token de autenticación
     * @returns {Promise} - Respuesta de la API
     */
    logout: async (token) => {
        try {
            const response = await apiClient.post(
                API_CONFIG.ENDPOINTS.LOGOUT,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            return {
                success: true,
                data: response.data,
                status: response.status
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Error al cerrar sesión",
                status: error.response?.status || null
            }
        }
    },

    /**
     * Validar token
     * @param {string} token - Token de autenticación
     * @returns {Promise} - Respuesta de la API
     */
    validateToken: async (token) => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.VALIDATE_TOKEN, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return {
                success: true,
                data: response.data,
                status: response.status
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Token inválido",
                status: error.response?.status || null
            }
        }
    }
}
