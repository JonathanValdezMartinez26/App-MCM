import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { useState } from "react"
import { LogBox } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { FONTS } from "../constants/fonts"
import { SessionProvider } from "../context/SessionContext"
import { CarteraProvider } from "../context/CarteraContext"
import SplashScreenComponent from "../components/SplashScreen"

LogBox.ignoreAllLogs()

export default function RootLayout() {
    const [loaded] = useFonts(FONTS)
    const [showSplash, setShowSplash] = useState(true)

    if (!loaded) return null

    return (
        <SafeAreaProvider>
            <SessionProvider>
                <CarteraProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="(screens)/DetalleCredito" />
                        <Stack.Screen name="+not-found" />
                    </Stack>

                    {showSplash && <SplashScreenComponent onFinish={() => setShowSplash(false)} />}
                </CarteraProvider>
            </SessionProvider>
        </SafeAreaProvider>
    )
}
