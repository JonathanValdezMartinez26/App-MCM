import React, { createContext, useContext, useState } from "react"

const PagoContext = createContext()

export const usePago = () => {
    const context = useContext(PagoContext)
    if (!context) {
        throw new Error("usePago debe ser usado dentro de PagoProvider")
    }
    return context
}

export const PagoProvider = ({ children }) => {
    const [datosPago, setDatosPago] = useState(null)

    const establecerDatosPago = (datos) => {
        setDatosPago({
            ...datos,
            vieneDeDetalle: true,
            timestamp: Date.now()
        })
    }

    const limpiarDatosPago = () => {
        setDatosPago(null)
    }

    const tieneContextoPago = () => {
        return (
            datosPago !== null &&
            datosPago.vieneDeDetalle === true &&
            Date.now() - datosPago.timestamp < 5 * 60 * 1000
        ) // 5 minutos
    }

    return (
        <PagoContext.Provider
            value={{
                datosPago,
                establecerDatosPago,
                limpiarDatosPago,
                tieneContextoPago
            }}
        >
            {children}
        </PagoContext.Provider>
    )
}
