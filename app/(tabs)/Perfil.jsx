import { View, Text, StyleSheet, Image, Pressable } from "react-native"
import { Feather } from "@expo/vector-icons"
import { COLORS, images } from "../../constants"
import { useSession } from "../../context/SessionContext"
import CustomAlert from "../../components/CustomAlert"
import { useCustomAlert } from "../../hooks/useCustomAlert"

export default function Perfil() {
    const { usuario, logout } = useSession()
    const { alertRef, showWarning, showSuccess, showError } = useCustomAlert()

    const cierraSesion = async () => {
        showWarning(
            "Cerrar Sesión",
            "¿Estás seguro que deseas cerrar sesión? Perderás el acceso a tu cuenta hasta que vuelvas a iniciar sesión.",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Cerrar Sesión",
                    onPress: async () => {
                        try {
                            const logoutSuccess = await logout()
                            if (logoutSuccess) {
                                showSuccess(
                                    "Sesión cerrada",
                                    "Has cerrado sesión exitosamente. ¡Hasta pronto!",
                                    [
                                        {
                                            text: "Aceptar",
                                            onPress: () => {
                                                // El layout de tabs se encargará de la redirección
                                            },
                                            style: "default"
                                        }
                                    ]
                                )
                            } else {
                                showError(
                                    "Error al cerrar sesión",
                                    "Ocurrió un problema al cerrar tu sesión. Por favor, inténtalo de nuevo."
                                )
                            }
                        } catch (error) {
                            showError(
                                "Error inesperado",
                                "Ocurrió un error inesperado al cerrar la sesión. La aplicación se reiniciará."
                            )
                        }
                    },
                    style: "destructive"
                }
            ]
        )
    }

    return (
        <View className="flex-1">
            <View className="h-60" style={{ backgroundColor: COLORS.primary }}>
                <View style={styles.avatarContainer}>
                    <Image source={images.avatar} style={styles.avatar} />
                </View>
            </View>

            <View className="mt-16 items-center">
                <Text className="text-lg font-bold text-gray-900">
                    {usuario?.nombre || "Ejecutivo"}
                </Text>
                <Text className="text-sm text-gray-700">{usuario?.id_usuario || "Usuario"}</Text>
            </View>

            <View className="flex-1 justify-center items-center px-8 py-12">
                <Pressable
                    className="bg-red-50 border border-red-200 rounded-2xl px-8 py-4 flex-row items-center"
                    onPress={cierraSesion}
                >
                    <Feather name="log-out" size={24} color={COLORS.error} />
                    <Text className="text-red-600 text-base font-medium ml-3">Cerrar Sesión</Text>
                </Pressable>
            </View>

            {/* Modal de alertas personalizadas */}
            <CustomAlert ref={alertRef} />
        </View>
    )
}

const styles = StyleSheet.create({
    avatarContainer: {
        position: "absolute",
        top: 150,
        alignSelf: "center"
    },
    avatar: {
        width: 112,
        height: 112,
        borderRadius: 56,
        borderWidth: 4,
        borderColor: "#fff"
    }
})
