import { useContext } from "react"
import { StatusBar } from "expo-status-bar"
import { View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"

import Login from "../components/Login"

export default function index() {
    const insets = useContext(SafeAreaInsetsContext)

    return (
        <SafeAreaProvider>
            <View
                className="flex-1"
                style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom
                }}
            >
                <StatusBar style="dark" />
                <Login />
            </View>
        </SafeAreaProvider>
    )
}
