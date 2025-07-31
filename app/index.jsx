import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"
import { useContext, useEffect } from "react"
import { View, ActivityIndicator } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import { useSession } from "../context/SessionContext"
import { COLORS } from "../constants"
import Login from "../components/Login"

export default function index() {
    const insets = useContext(SafeAreaInsetsContext)
    const { token, isLoading } = useSession()

    useEffect(() => {
        if (!isLoading && token) router.replace("/(tabs)/Cartera")
    }, [isLoading, token])

    if (isLoading) {
        return (
            <SafeAreaProvider>
                <StatusBar style="light" />
                <View
                    className="flex-1 justify-center items-center"
                    style={{
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                        backgroundColor: COLORS.primary
                    }}
                >
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            </SafeAreaProvider>
        )
    }

    // Si no hay token, mostrar login
    return (
        <SafeAreaProvider>
            <View
                className="flex-1"
                style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom
                }}
            >
                <Login />
            </View>
        </SafeAreaProvider>
    )
}
