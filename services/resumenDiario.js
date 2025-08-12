import { apiClient, API_CONFIG } from "./api"
import storage from "../utils/storage"

const resumenDiario = {
    obtenerResumen: async (fechaInicio, fechaFin) => {
        try {
            const token = await storage.getToken()
            const response = await apiClient.post(
                API_CONFIG.ENDPOINTS.RESUMEN_DIARIO,
                {
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (response.data) {
                return {
                    success: true,
                    data: response.data
                }
            } else {
                return {
                    success: false,
                    error: "No se recibieron datos"
                }
            }
        } catch (error) {
            console.error("Error al obtener resumen diario:", error)
            return {
                success: false,
                error: error.response?.data?.message || "Error al obtener el resumen diario"
            }
        }
    }
}

export default resumenDiario
