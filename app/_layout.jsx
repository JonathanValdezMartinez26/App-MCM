import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from "react"
import { LogBox } from "react-native"
import { FONTS } from "../constants/fonts"
import { SessionProvider } from "../context/SessionContext"
import { SafeAreaProvider } from "react-native-safe-area-context"
import SplashScreenComponent from "../components/SplashScreen"

SplashScreen.preventAutoHideAsync()
LogBox.ignoreAllLogs()

function RootLayoutNav() {
    const [loaded] = useFonts(FONTS)
    const [showSplash, setShowSplash] = useState(true)

    useEffect(() => {
        if (loaded) SplashScreen.hideAsync()
    }, [loaded])

    if (!loaded) return null

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(screens)/DetalleCredito" />
                <Stack.Screen name="+not-found" />
            </Stack>

            {showSplash && <SplashScreenComponent onFinish={() => setShowSplash(false)} />}
        </>
    )
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <SessionProvider>
                <RootLayoutNav />
            </SessionProvider>
        </SafeAreaProvider>
    )
}
