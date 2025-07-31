import { createContext, useContext, useState, useEffect } from "react"
import storage from "../utils/storage"

const SessionContext = createContext()

export const useSession = () => {
    const context = useContext(SessionContext)
    if (!context) throw new Error("useSession debe ser usado dentro de un SessionProvider")
    return context
}

export const SessionProvider = ({ children }) => {
    const [token, setToken] = useState(null)
    const [usuario, setUsuario] = useState(null)

    useEffect(() => {
        const checkToken = async () => {
            const storedToken = await storage.getToken()
            if (storedToken) setToken(storedToken)
        }
        checkToken()
    }, [])

    const login = async (userToken, userData = null) => {
        try {
            if (userData) {
                setUsuario(userData)
            }
            await storage.saveToken(userToken)
            setToken(userToken)
            return true
        } catch (error) {
            console.error("Error en login:", error)
            return false
        }
    }

    const logout = async () => {
        try {
            await storage.removeToken()
            setToken(null)
            setUsuario(null)
            return true
        } catch (error) {
            console.error("Error en logout:", error)
            return false
        }
    }

    const value = {
        token,
        usuario,
        login,
        logout
    }

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}