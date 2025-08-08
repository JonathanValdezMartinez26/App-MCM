import AsyncStorage from "@react-native-async-storage/async-storage"

const PAGOS_PENDIENTES_KEY = "pagos_pendientes"

// Estructura de un pago pendiente:
// {
//     id: string (timestamp + credito),
//     credito: string,
//     ciclo: string,
//     monto: number,
//     tipoPago: string (código del tipo de pago),
//     tipoEtiqueta: string (descripción del tipo para mostrar),
//     fechaCaptura: string (ISO date),
//     nombreCliente: string,
//     estado: 'pendiente',
//     foto: string (opcional, URL de la imagen),
//     latitud: number (opcional, coordenada de latitud),
//     longitud: number (opcional, coordenada de longitud)
// }

export const pagosPendientes = {
    // Obtener todos los pagos pendientes
    async obtenerTodos() {
        try {
            const pagosString = await AsyncStorage.getItem(PAGOS_PENDIENTES_KEY)
            return pagosString ? JSON.parse(pagosString) : []
        } catch (error) {
            console.error("Error al obtener pagos pendientes:", error)
            return []
        }
    },

    // Obtener pagos pendientes por número de crédito
    async obtenerPorCredito(numeroCredito) {
        try {
            const todosPagos = await this.obtenerTodos()
            return todosPagos.filter((pago) => pago.credito === numeroCredito)
        } catch (error) {
            console.error("Error al obtener pagos por crédito:", error)
            return []
        }
    },

    // Guardar un nuevo pago pendiente
    async guardar(pagoData) {
        try {
            const pagosExistentes = await this.obtenerTodos()

            const nuevoPago = {
                id: `${Date.now()}_${pagoData.credito}`,
                credito: pagoData.credito,
                ciclo: pagoData.ciclo,
                monto: parseFloat(pagoData.monto),
                comentarios: pagoData.comentarios || "",
                tipoPago: pagoData.tipoPago,
                tipoEtiqueta: pagoData.tipoEtiqueta || "Desconocido",
                fechaCaptura: new Date().toISOString(),
                nombreCliente: pagoData.nombreCliente || "",
                estado: "pendiente",
                fotoComprobante: pagoData.fotoComprobante || null,
                latitud: pagoData.latitud || null,
                longitud: pagoData.longitud || null
            }

            const pagosActualizados = [...pagosExistentes, nuevoPago]
            await AsyncStorage.setItem(PAGOS_PENDIENTES_KEY, JSON.stringify(pagosActualizados))

            return { success: true, pago: nuevoPago }
        } catch (error) {
            console.error("Error al guardar pago pendiente:", error)
            return { success: false, error: error.message }
        }
    },

    // Eliminar un pago pendiente por ID
    async eliminar(pagoId) {
        try {
            const pagosExistentes = await this.obtenerTodos()
            const pagosActualizados = pagosExistentes.filter((pago) => pago.id !== pagoId)
            await AsyncStorage.setItem(PAGOS_PENDIENTES_KEY, JSON.stringify(pagosActualizados))

            return { success: true }
        } catch (error) {
            console.error("Error al eliminar pago pendiente:", error)
            return { success: false, error: error.message }
        }
    },

    // Marcar un pago como procesado (eliminar de pendientes)
    async marcarComoProcesado(pagoId) {
        return await this.eliminar(pagoId)
    },

    // Limpiar todos los pagos pendientes
    async limpiarTodos() {
        try {
            await AsyncStorage.removeItem(PAGOS_PENDIENTES_KEY)
            return { success: true }
        } catch (error) {
            console.error("Error al limpiar pagos pendientes:", error)
            return { success: false, error: error.message }
        }
    },

    // Obtener el total de pagos pendientes para un crédito
    async obtenerTotalPendientePorCredito(numeroCredito) {
        try {
            const pagosPorCredito = await this.obtenerPorCredito(numeroCredito)
            return pagosPorCredito.reduce((total, pago) => total + pago.monto, 0)
        } catch (error) {
            console.error("Error al calcular total pendiente:", error)
            return 0
        }
    }
}
