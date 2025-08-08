import { useState, useContext, useEffect } from "react"
import {
    View,
    Text,
    StatusBar,
    Image,
    FlatList,
    ActivityIndicator,
    Pressable,
    Platform,
    TextInput
} from "react-native"
import { COLORS, images } from "../../constants"
import { useSession } from "../../context/SessionContext"
import { useCartera } from "../../context/CarteraContext"
import { MaterialIcons } from "@expo/vector-icons"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import TarjetaCarteraCredito from "../../components/TarjetaCarteraCredito"

export default function Cartera() {
    const { usuario } = useSession()
    const { clientes, loading, obtenerCartera } = useCartera()
    const insets = useContext(SafeAreaInsetsContext)
    const [expandedId, setExpandedId] = useState(null)
    const [mostrarBusqueda, setMostrarBusqueda] = useState(false)
    const [terminoBusqueda, setTerminoBusqueda] = useState("")
    const [clientesFiltrados, setClientesFiltrados] = useState([])

    useEffect(() => {
        if (terminoBusqueda.length >= 3) {
            const filtrados = clientes.filter((cliente) => {
                const nombreMatch = cliente.nombre
                    ?.toLowerCase()
                    .includes(terminoBusqueda.toLowerCase())
                const creditoMatch = cliente.creditos?.some((credito) =>
                    credito.no_credito?.includes(terminoBusqueda)
                )
                return nombreMatch || creditoMatch
            })
            setClientesFiltrados(filtrados)
        } else {
            setClientesFiltrados(clientes)
        }
    }, [terminoBusqueda, clientes])

    useEffect(() => {
        setClientesFiltrados(clientes)
    }, [clientes])

    const actualizarClientes = async () => {
        await obtenerCartera(true)
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

                    <View className="flex-row items-center">
                        <Pressable
                            onPress={() => setMostrarBusqueda(!mostrarBusqueda)}
                            className="mr-3 p-2"
                        >
                            <MaterialIcons
                                name="search"
                                size={24}
                                color={mostrarBusqueda ? COLORS.primary : "black"}
                            />
                        </Pressable>

                        <Pressable onPress={actualizarClientes} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="black" size="small" />
                            ) : (
                                <MaterialIcons name="refresh" size={24} color="black" />
                            )}
                        </Pressable>
                    </View>
                </View>

                {/* Campo de búsqueda */}
                {mostrarBusqueda && (
                    <View className="px-3 py-3 border-b border-gray-100">
                        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
                            <MaterialIcons name="search" size={20} color="#6B7280" />
                            <TextInput
                                value={terminoBusqueda}
                                onChangeText={setTerminoBusqueda}
                                placeholder="Buscar por nombre o número de crédito..."
                                className="flex-1 ml-2 text-base"
                                autoFocus={true}
                            />
                            {terminoBusqueda.length > 0 && (
                                <Pressable onPress={() => setTerminoBusqueda("")}>
                                    <MaterialIcons name="clear" size={20} color="#6B7280" />
                                </Pressable>
                            )}
                        </View>
                        {terminoBusqueda.length > 0 && terminoBusqueda.length < 3 && (
                            <Text className="text-xs text-gray-500 mt-2">
                                Ingrese al menos 3 caracteres para buscar
                            </Text>
                        )}
                        {terminoBusqueda.length >= 3 && (
                            <Text className="text-xs text-gray-600 mt-2">
                                {clientesFiltrados.length} resultado(s) encontrado(s)
                            </Text>
                        )}
                    </View>
                )}

                <View className="flex-1 px-5">
                    {clientesFiltrados.length === 0 && !loading ? (
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-gray-500">
                                {terminoBusqueda.length >= 3
                                    ? "No se encontraron resultados para la búsqueda"
                                    : "No tiene clientes asignados"}
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={clientesFiltrados}
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
