import { useEffect, useState, useContext } from "react"
import {
    View,
    Text,
    StatusBar,
    Image,
    FlatList,
    ActivityIndicator,
    Pressable,
    Platform
} from "react-native"
import { COLORS, images } from "../../constants"
import { useSession } from "../../context/SessionContext"
import { catalogos } from "../../services"
import { Feather } from "@expo/vector-icons"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import TarjetaCarteraCredito from "../../components/TarjetaCarteraCredito"

export default function Cartera() {
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

    const handleToggleExpansion = (clienteId) => {
        setExpandedId(expandedId === clienteId ? null : clienteId)
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
                <Image
                    source={images.avatar}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        borderColor: COLORS.white,
                        borderWidth: 1
                    }}
                />
                <Text className="flex-1 ml-2.5 text-white">HOLA, {usuario?.nombre}</Text>
            </View>

            <View className="bg-white flex-1 rounded-t-3xl">
                <View className="flex-row justify-between items-center border-b border-gray-200 px-3">
                    <Text className="text-lg font-semibold my-5">Mi cartera</Text>

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
                            renderItem={({ item }) => (
                                <TarjetaCarteraCredito
                                    cliente={item}
                                    isExpanded={expandedId === item.cdgns}
                                    onToggle={() => handleToggleExpansion(item.cdgns)}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            className="pt-2"
                        />
                    )}
                </View>
            </View>
        </View>
    )
}
