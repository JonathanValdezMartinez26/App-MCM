import { apiClient, API_CONFIG } from "./api"
import storage from "../utils/storage"

export default {
    getDetalleCredito: async (cdgns, ciclo) => {
        const token = await storage.getToken()

        try {
            const response = await apiClient.post(
                API_CONFIG.ENDPOINTS.DETALLE_CREDITO,
                {
                    cdgns,
                    ciclo
                },
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
            console.error("Error al obtener detalle del crédito:", error)
            let errorMessage = "Error de conexión"

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