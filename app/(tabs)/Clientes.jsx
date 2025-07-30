import { useEffect, useState, useRef, useContext } from "react"
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Image,
    FlatList,
    ActivityIndicator,
    Animated,
    Pressable,
    Platform
} from "react-native"
import { COLORS, images } from "@/constants"
import { useSession } from "@/context/SessionContext"
import { catalogos } from "@/services"
import { Feather } from "@expo/vector-icons"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import { router } from "expo-router"

export default function Clientes() {
    const { usuario } = useSession()
    const insets = useContext(SafeAreaInsetsContext)
    const [clientes, setClientes] = useState([])
    const [expandedId, setExpandedId] = useState(null)
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        actualizarClientes()
    }, [])

    const actualizarClientes = async () => {
        try {
            setIsRefreshing(true)

            const respuesta = await catalogos.getClientesEjecutivo()
            const nuevosClientes = respuesta.data.clientes || []

            setClientes(nuevosClientes)
        } catch (error) {
            console.error("Error al obtener clientes:", error)
            setClientes([])
        } finally {
            setIsRefreshing(false)
        }
    }

    const TarjetaAnimada = ({ cliente, index }) => {
        const opacity = useRef(new Animated.Value(0)).current
        const isExpanded = expandedId === cliente.cdgns

        const toggleExpansion = () => {
            setExpandedId(isExpanded ? null : cliente.cdgns)
        }

        useEffect(() => {
            if (isRefreshing) {
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    delay: index * 500,
                    useNativeDriver: true
                }).start()
            } else {
                opacity.setValue(1)
            }
        }, [])

        return (
            <Animated.View style={{ opacity }}>
                <Pressable
                    onPress={toggleExpansion}
                    className="bg-white rounded-2xl shadow-md p-4 mb-4 border border-gray-200"
                >
                    <View className="flex-row justify-between items-center">
                        <View className="flex-1">
                            <Text className="text-lg font-semibold">Credito: {cliente.cdgns}</Text>
                            <Text className="text-gray-600">Ciclo: {cliente.ciclo}</Text>
                        </View>
                        <Feather
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#6B7280"
                        />
                    </View>

                    {isExpanded && (
                        <View className="mt-3 pt-3 border-t border-gray-200 border-dashed">
                            <View className="flex-row justify-between items-start">
                                <View className="flex-1">
                                    <Text className="text-sm text-gray-700 mb-1">
                                        Nombre: {cliente.nombre || "No disponible"}
                                    </Text>
                                    <Text className="text-sm text-gray-700">
                                        Fecha de inicio: {cliente.inicio || "No disponible"}
                                    </Text>
                                </View>
                                <Pressable
                                    onPress={() =>
                                        router.push(
                                            `/DetalleCredito?noCredito=${cliente.cdgns}&ciclo=${cliente.ciclo}`
                                        )
                                    }
                                    className="ml-3 p-2 bg-blue-50 rounded-full"
                                >
                                    <Feather name="eye" size={16} color="#3B82F6" />
                                </Pressable>
                            </View>
                        </View>
                    )}
                </Pressable>
            </Animated.View>
        )
    }

    return (
        <View
            className="flex-1"
            style={{
                paddingTop: insets.top,
                paddingBottom: Platform.OS === "ios" ? 90 : 60,
                backgroundColor: COLORS.primary
            }}
        >
            <StatusBar barStyle="light-content" />
            <View className="flex-row items-center p-4">
                <Image source={images.avatar} style={styles.avatar} />
                <Text className="flex-1 ml-2.5 text-white text-base">{usuario?.nombre}</Text>
            </View>

            <View className="bg-white flex-1 rounded-t-3xl">
                <View className="flex-row justify-between items-center border-b border-gray-200 px-3">
                    <Text className="text-lg font-semibold my-5">Mis clientes asignados</Text>

                    <Pressable onPress={actualizarClientes} disabled={isRefreshing}>
                        {isRefreshing ? (
                            <ActivityIndicator color="black" size="small" />
                        ) : (
                            <Feather name="refresh-ccw" size={24} color="black" />
                        )}
                    </Pressable>
                </View>

                <View className="flex-1 px-5">
                    {clientes.length === 0 && !isRefreshing ? (
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-gray-500">No tiene clientes asignados</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={clientes}
                            keyExtractor={(cliente) => cliente.cdgns}
                            renderItem={({ item, index }) => (
                                <TarjetaAnimada cliente={item} index={index} />
                            )}
                            showsVerticalScrollIndicator={false}
                            className=" pt-2"
                        />
                    )}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderColor: COLORS.white,
        borderWidth: 1
    }
})
