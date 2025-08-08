import * as Crypto from "expo-crypto"

/**
 * Genera un ID único hasheado para un pago
 * @param {string} credito - Número de crédito
 * @param {string} fechaCaptura - Fecha de captura en ISO
 * @param {string} usuario - ID del usuario
 * @param {number} monto - Monto del pago
 * @returns {Promise<string>} ID hasheado único
 */
export async function generarIdPago(credito, fechaCaptura, usuario, monto) {
    try {
        const timestamp = new Date(fechaCaptura).getTime()
        const datosUnicos = `${credito}-${timestamp}-${usuario}-${monto}`
        const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.MD5, datosUnicos)
        return hash
    } catch (error) {
        console.error("Error al generar ID del pago:", error)
        const timestamp = Date.now()
        return `${timestamp}_${credito}`
    }
}
