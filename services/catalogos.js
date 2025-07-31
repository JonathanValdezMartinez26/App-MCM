import { apiClient, API_CONFIG } from "./api"
import storage from "../utils/storage"

export default {
    getClientesEjecutivo: async () => {
        const token = await storage.getToken()

        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.CLIENTES_EJECUTIVO, {
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
            console.error("Error al obtener clientes del ejecutivo:", error)
            let errorMessage = "Error de conexión"

            if (error.response) errorMessage = error.response.data?.message || "Error desconocido"

            if (error.response) {
                errorMessage = error.response.data?.message || "Error desconocido"
            } else if (error.request) {
                errorMessage = "Error de conexión. Verifica tu internet"
            }

            return {
                success: false,
                error: errorMessage,
                status: error.response?.status || null
            }
        }
    }
}