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
    const [introOK, setIntroOK] = useState(false)

    useEffect(() => {
        const checkToken = async () => {
            try {
                const introDone = await storage.getIntroStatus()
                setIntroOK(introDone)

                const storedToken = await storage.getToken()
                if (storedToken) {
                    setToken(storedToken)

                    const storedUser = await storage.getUser()
                    if (storedUser) setUsuario(storedUser)
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

    const introMostrada = async () => {
        try {
            await storage.setIntroOK()
            setIntroOK(true)
        } catch (error) {
            console.error("Error completing intro:", error)
        }
    }

    const value = {
        token,
        usuario,
        isLoading,
        introOK,
        login,
        logout,
        introMostrada
    }

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
