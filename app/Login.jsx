import { useState, useContext } from "react"
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    Pressable,
    Image,
    Alert
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { Feather } from "@expo/vector-icons"
import { router } from "expo-router"
import { useSession } from "../context/SessionContext"
import { COLORS } from "../constants"
import { sesion } from "../services"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import "../styles/global.css"

export default function Login() {
    const { login } = useSession()
    const insets = useContext(SafeAreaInsetsContext)
    const [usuario, setUsuario] = useState("")
    const [password, setPassword] = useState("")
    const [secureText, setSecureText] = useState(true)
    const [usuarioFocused, setUsuarioFocused] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)
    const [validando, setValidando] = useState(false)

    const validaLogin = async () => {
        if (!usuario.trim() || !password.trim())
            return Alert.alert("Error", "Por favor completa todos los campos")

        setValidando(true)
        try {
            const response = await sesion.login(usuario, password)
            if (!response.success) return Alert.alert("Error", response.error)

            const userData = response.data
            const loginSuccess = await login(userData.access_token, userData.usuario)

            if (loginSuccess) router.push("/(tabs)/Cartera")
            else Alert.alert("Error", "Error al guardar sesión")
        } catch (error) {
            Alert.alert("Error", `Error inesperado: ${error.message}`)
        } finally {
            setValidando(false)
        }
    }

    return (
        <View
            className="flex-1"
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom
            }}
        >
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <Image
                    source={require("../assets/images/logo.png")}
                    className="w-52 h-52 self-center"
                    resizeMode="contain"
                />

                <View
                    style={[
                        styles.inputContainer,
                        { borderColor: usuarioFocused ? COLORS.info : "#ccc" }
                    ]}
                >
                    <Feather name="user" size={20} color={COLORS.neutralBlack} className="mr-2" />
                    <TextInput
                        style={styles.input}
                        placeholder="Usuario"
                        autoCapitalize="characters"
                        value={usuario}
                        onChangeText={setUsuario}
                        onFocus={() => setUsuarioFocused(true)}
                        onBlur={() => setUsuarioFocused(false)}
                    />
                </View>

                <View
                    style={[
                        styles.inputContainer,
                        { borderColor: passwordFocused ? COLORS.info : "#ccc" }
                    ]}
                >
                    <Feather name="key" size={20} color={COLORS.neutralBlack} className="mr-2" />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        secureTextEntry={secureText}
                        value={password}
                        onChangeText={setPassword}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                    />
                    <Pressable onPress={() => setSecureText(!secureText)}>
                        <Feather
                            name={secureText ? "eye-off" : "eye"}
                            size={20}
                            color={COLORS.neutralBlack}
                        />
                    </Pressable>
                </View>

                <Pressable
                    onPress={validaLogin}
                    className="bg-black rounded-full h-12 w-[80%] self-center justify-center items-center mb-5"
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

                <Text style={styles.footer}>Tienes detalles, contacta a Soporte Operativo.</Text>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
        flexGrow: 1,
        justifyContent: "center",
        alignContent: "center"
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 15,
        height: 50,
        width: "80%",
        alignItems: "center",
        alignSelf: "center"
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: COLORS.shadesBlack,
        fontFamily: "regular"
    },
    footer: {
        textAlign: "center",
        fontSize: 12,
        marginTop: 50,
        fontFamily: "regular"
    }
})
