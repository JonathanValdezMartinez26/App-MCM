import { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    Pressable,
    Image,
    Alert,
    Platform
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { router } from "expo-router"
import { useSession } from "../context/SessionContext"
import { COLORS } from "../constants"
import { sesion } from "../services"
import "../styles/global.css"

export default function Login() {
    const { login } = useSession()
    const [usuario, setUsuario] = useState("")
    const [password, setPassword] = useState("")
    const [secureText, setSecureText] = useState(true)
    const [usuarioFocused, setUsuarioFocused] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)
    const [validando, setValidando] = useState(false)

    const validaLogin = async () => {
        if (!usuario.trim() || !password.trim()) {
            if (Platform.OS === "web") {
                window.alert("Por favor completa todos los campos")
            } else {
                Alert.alert("Error", "Por favor completa todos los campos")
            }
            return
        }

        setValidando(true)
        try {
            const response = await sesion.login(usuario, password)
            if (!response.success) {
                if (Platform.OS === "web") {
                    window.alert(response.error)
                } else {
                    Alert.alert("Error", response.error)
                }
                return
            }

            const userData = response.data
            const loginSuccess = await login(userData.access_token, userData.usuario)

            if (loginSuccess) {
                router.push("/(tabs)/Cartera")
            } else {
                if (Platform.OS === "web") {
                    window.alert("Error al guardar sesión")
                } else {
                    Alert.alert("Error", "Error al guardar sesión")
                }
            }
        } catch (error) {
            if (Platform.OS === "web") {
                window.alert(`Error inesperado: ${error.message}`)
            } else {
                Alert.alert("Error", `Error inesperado: ${error.message}`)
            }
        } finally {
            setValidando(false)
        }
    }

    return (
        <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            className="flex-1"
        >
            <Image
                source={require("../assets/images/logo.png")}
                className="w-52 h-52 self-center mb-8"
                resizeMode="contain"
            />

            <View
                className="flex-row items-center border rounded-3xl px-4 mb-4 h-12 w-4/5 self-center"
                style={{
                    borderColor: usuarioFocused ? COLORS.info : "#ccc"
                }}
            >
                <Feather name="user" size={20} color={COLORS.neutralBlack} className="mr-2" />
                <TextInput
                    className="flex-1 text-sm"
                    style={{ color: COLORS.shadesBlack, fontFamily: "regular" }}
                    placeholder="Usuario"
                    autoCapitalize="characters"
                    value={usuario}
                    onChangeText={setUsuario}
                    onFocus={() => setUsuarioFocused(true)}
                    onBlur={() => setUsuarioFocused(false)}
                />
            </View>

            <View
                className="flex-row items-center border rounded-3xl px-4 mb-6 h-12 w-4/5 self-center"
                style={{
                    borderColor: passwordFocused ? COLORS.info : "#ccc"
                }}
            >
                <Feather name="key" size={20} color={COLORS.neutralBlack} className="mr-2" />
                <TextInput
                    className="flex-1 text-sm"
                    style={{ color: COLORS.shadesBlack, fontFamily: "regular" }}
                    placeholder="Contraseña"
                    secureTextEntry={secureText}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                />
                <Pressable onPress={() => setSecureText(!secureText)} className="p-1">
                    <Feather
                        name={secureText ? "eye-off" : "eye"}
                        size={20}
                        color={COLORS.neutralBlack}
                    />
                </Pressable>
            </View>

            <Pressable
                onPress={validaLogin}
                className="rounded-full h-12 w-4/5 self-center justify-center items-center mb-5"
                style={{
                    backgroundColor: COLORS.primary,
                    opacity: validando ? 0.5 : 1
                }}
                disabled={validando}
            >
                {validando ? (
                    <Feather name="loader" size={20} color="white" className="animate-spin" />
                ) : (
                    <Text className="text-white font-medium">Ingresar</Text>
                )}
            </Pressable>

            <Text className="text-center text-xs mt-12" style={styles.footer}>
                Tienes detalles, contacta a Soporte Operativo.
            </Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
        flexGrow: 1,
        justifyContent: "center"
    },
    footer: {
        fontFamily: "regular"
    }
})
