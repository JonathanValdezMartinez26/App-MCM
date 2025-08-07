import React, { createContext, useContext, useState } from "react"

const DetalleContext = createContext()

export const useDetalle = () => {
    const context = useContext(DetalleContext)
    if (!context) {
        throw new Error("useDetalle debe ser usado dentro de DetalleProvider")
    }
    return context
}

export const DetalleProvider = ({ children }) => {
    const [datosDetalle, setDatosDetalle] = useState(null)

    const establecerDatosDetalle = (datos) => {
        setDatosDetalle({
            ...datos,
            vieneDeCartera: true,
            timestamp: Date.now()
        })
    }

    const limpiarDatosDetalle = () => {
        setDatosDetalle(null)
    }

    const tieneContextoDetalle = () => {
        return (
            datosDetalle !== null &&
            datosDetalle.vieneDeCartera === true &&
            Date.now() - datosDetalle.timestamp < 5 * 60 * 1000
        ) // 5 minutos
    }

    return (
        <DetalleContext.Provider
            value={{
                datosDetalle,
                establecerDatosDetalle,
                limpiarDatosDetalle,
                tieneContextoDetalle
            }}
        >
            {children}
        </DetalleContext.Provider>
    )
}
