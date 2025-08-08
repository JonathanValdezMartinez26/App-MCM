import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { useState } from "react"
import { LogBox } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { FONTS } from "../constants/fonts"
import { SessionProvider } from "../context/SessionContext"
import { CarteraProvider } from "../context/CarteraContext"
import { PagoProvider } from "../context/PagoContext"
import { DetalleProvider } from "../context/DetalleContext"
import SplashScreenComponent from "../components/SplashScreen"

LogBox.ignoreAllLogs()

export default function RootLayout() {
    const [loaded] = useFonts(FONTS)
    const [showSplash, setShowSplash] = useState(true)

    if (!loaded) return null

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <SessionProvider>
                    <CarteraProvider>
                        <DetalleProvider>
                            <PagoProvider>
                                <Stack screenOptions={{ headerShown: false }}>
                                    <Stack.Screen name="index" />
                                    <Stack.Screen name="(tabs)" />
                                    <Stack.Screen name="(screens)/DetalleCredito" />
                                    <Stack.Screen name="(screens)/SincronizarPagos" />
                                    <Stack.Screen name="+not-found" />
                                </Stack>

                                {showSplash && (
                                    <SplashScreenComponent onFinish={() => setShowSplash(false)} />
                                )}
                            </PagoProvider>
                        </DetalleProvider>
                    </CarteraProvider>
                </SessionProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}
