import { apiClient, API_CONFIG } from "./api"
import storage from "../utils/storage"

const MOTIVOS_VISITA_KEY = "motivos_visita_catalogo"

// Motivo de respaldo (idmotivo 2)
const MOTIVO_RESPALDO = {
    idmotivo: 2,
    descripcion: "Cliente no se encuentra"
}

/**
 * Obtener catálogo de motivos de visita
 * @returns {Promise<Array>} Lista de motivos de visita
 */
export const obtenerMotivosVisita = async () => {
    try {
        const token = await storage.getToken()
        // Intentar obtener del almacenamiento local primero
        const motivosGuardados = await storage.getItem(MOTIVOS_VISITA_KEY)
        if (motivosGuardados) {
            return motivosGuardados
        }

        // Si no hay datos locales, obtener del servidor
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.CATALOGO_MOTIVOS_VISITA, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (response.data && response.data.motivos_visita) {
            const motivos = response.data.motivos_visita
            // Guardar en almacenamiento local
            await storage.setItem(MOTIVOS_VISITA_KEY, motivos)
            return motivos
        }

        // Si falla la respuesta del servidor, usar motivo de respaldo
        console.warn("No se pudo obtener el catálogo de motivos de visita, usando respaldo")
        return [MOTIVO_RESPALDO]
    } catch (error) {
        console.error("Error al obtener motivos de visita:", error)
        // En caso de error, devolver el motivo de respaldo
        return [MOTIVO_RESPALDO]
    }
}

/**
 * Registrar una visita
 * @param {Object} datosVisita - Datos de la visita
 * @param {string} datosVisita.fecha - Fecha de la visita
 * @param {string} datosVisita.cdgns - Número de crédito
 * @param {string} datosVisita.ciclo - Ciclo del crédito
 * @param {number} datosVisita.idmotivo - ID del motivo de visita
 * @param {string} datosVisita.detalle - Comentarios de la visita
 * @param {number} datosVisita.latitud - Latitud GPS
 * @param {number} datosVisita.longitud - Longitud GPS
 * @param {string} datosVisita.foto - Foto en base64
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const registrarVisita = async (datosVisita) => {
    try {
        const token = await storage.getToken()
        const response = await apiClient.post(API_CONFIG.ENDPOINTS.REGISTRO_VISITA, datosVisita, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (response.data) {
            return {
                success: true,
                data: response.data,
                mensaje: "Visita registrada correctamente"
            }
        }

        return {
            success: false,
            error: "No se recibió respuesta del servidor"
        }
    } catch (error) {
        console.error("Error al registrar visita:", error)
        return {
            success: false,
            error: error.response?.data?.mensaje || error.message || "Error al registrar la visita"
        }
    }
}
