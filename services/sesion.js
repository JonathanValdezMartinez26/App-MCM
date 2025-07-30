import { apiClient, API_CONFIG } from "./api"

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

            return {
                success: true,
                data: response.data,
                status: response.status
            }
        } catch (error) {
            console.error("Error de conexión:", error)
            let errorMessage = "Error de conexión"

            if (error.response) {
                // Error de respuesta del servidor
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
