import { useState } from "react"
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Image } from "react-native"
import { Feather } from "@expo/vector-icons"
import { router } from "expo-router"
import { useSession } from "../context/SessionContext"
import { COLORS, images } from "../constants"
import { sesion } from "../services"
import CustomAlert from "./CustomAlert"
import { useCustomAlert } from "../hooks/useCustomAlert"
import "../styles/global.css"

export default function Login() {
    const { login } = useSession()
    const { alertRef, showError, showSuccess } = useCustomAlert()
    const [usuario, setUsuario] = useState("")
    const [password, setPassword] = useState("")
    const [secureText, setSecureText] = useState(true)
    const [usuarioFocused, setUsuarioFocused] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)
    const [validando, setValidando] = useState(false)

    const validaLogin = async () => {
        if (!usuario.trim() || !password.trim()) {
            showError("Campos requeridos", "Por favor completa todos los campos para continuar.")
            return
        }

        setValidando(true)
        try {
            const response = await sesion.login(usuario, password)
            if (!response.success) {
                showError(
                    "Error de autenticación",
                    response.error || "Credenciales incorrectas. Verifica tu usuario y contraseña."
                )
                return
            }

            const userData = response.data
            const loginSuccess = await login(userData.access_token, userData.usuario)

            if (loginSuccess) {
                showSuccess("¡Bienvenido!", "Inicio de sesión exitoso. Redirigiendo...", [
                    {
                        text: "Continuar",
                        onPress: () => router.push("/(tabs)/Cartera"),
                        style: "default"
                    }
                ])

                setTimeout(() => {
                    router.push("/(tabs)/Cartera")
                }, 1500)
            } else {
                showError(
                    "Error del sistema",
                    "Error al guardar la sesión. Por favor, inténtalo de nuevo."
                )
            }
        } catch (error) {
            showError("Error inesperado", `Ocurrió un problema: ${error.message}`, [
                {
                    text: "Reintentar",
                    onPress: () => validaLogin(),
                    style: "default"
                },
                {
                    text: "Cancelar",
                    onPress: () => {},
                    style: "cancel"
                }
            ])
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
            <Image source={images.logo} className="h-36 self-center mb-8" resizeMode="contain" />

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

            <Text className="text-center text-xs mt-12 font-bold" style={styles.footer}>
                ¿Tienes problemas?
            </Text>
            <Text className="text-center text-xs" style={styles.footer}>
                Contacta a Soporte Operativo.
            </Text>

            {/* Modal de alertas personalizadas */}
            <CustomAlert ref={alertRef} />
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
