import { View, Text, StyleSheet, Image, Alert, Pressable } from "react-native"
import { router } from "expo-router"
import { Feather } from "@expo/vector-icons"
import { COLORS, images } from "../../constants"
import { useSession } from "../../context/SessionContext"

export default function Perfil() {
    const { usuario, logout } = useSession()

    const cierraSesion = () => {
        Alert.alert("Cerrar Sesión", "¿Estás seguro que deseas cerrar sesión?", [
            {
                text: "Cancelar",
                style: "cancel"
            },
            {
                text: "Cerrar Sesión",
                style: "destructive",
                onPress: () => {
                    logout()
                    router.push("/Login")
                }
            }
        ])
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
