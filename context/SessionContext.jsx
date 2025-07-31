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
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkToken = async () => {
            try {
                const storedToken = await storage.getToken()
                const storedUser = await storage.getUser()

                if (storedToken) {
                    setToken(storedToken)
                    if (storedUser) {
                        setUsuario(storedUser)
                    }
                }
            } catch (error) {
                console.error("Error checking stored token:", error)
            } finally {
                setIsLoading(false)
            }
        }
        checkToken()
    }, [])

    const login = async (userToken, userData = null) => {
        try {
            await storage.saveToken(userToken)
            setToken(userToken)

            if (userData) {
                await storage.saveUser(userData)
                setUsuario(userData)
            }
            return true
        } catch (error) {
            console.error("Error en login:", error)
            return false
        }
    }

    const logout = async () => {
        try {
            await storage.clearAll()
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
        isLoading,
        login,
        logout
    }

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
