import { useContext, useState, useEffect, useRef } from "react"
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    Image,
    Platform,
    Animated,
    FlatList
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { COLORS, images } from "../../constants"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import { useCustomAlert } from "../../hooks/useCustomAlert"
import { resumenDiario } from "../../services"
import CustomAlert from "../../components/CustomAlert"
import DateSelector from "../../components/DateSelector"
import MapModal from "../../components/MapModal"
import storage from "../../utils/storage"
import numeral from "numeral"

export default function Resumen() {
    const insets = useContext(SafeAreaInsetsContext)
    const { alertRef, showError, showWait, hideWait } = useCustomAlert()
    const [expandedId, setExpandedId] = useState(null)

    // Estados para el usuario
    const [usuario, setUsuario] = useState(null)

    // Estados para las fechas
    const [fechaInicio, setFechaInicio] = useState(null)
    const [fechaFin, setFechaFin] = useState(null)
    const [minDate, setMinDate] = useState(null)
    const [maxDate, setMaxDate] = useState(new Date())

    // Estados para los datos
    const [resumenData, setResumenData] = useState(null)
    const [operaciones, setOperaciones] = useState([])
    const [operacionesFiltradas, setOperacionesFiltradas] = useState([])

    // Estados para la interfaz
    const [busqueda, setBusqueda] = useState("")
    const [ordenamiento, setOrdenamiento] = useState("fecha")
    const [mostrarTodos, setMostrarTodos] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    // Estados para el modal del mapa
    const [mapModalVisible, setMapModalVisible] = useState(false)
    const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null)

    useEffect(() => {
        inicializarDatos()
    }, [])

    useEffect(() => {
        if (fechaInicio && fechaFin) {
            if (fechaInicio > fechaFin) {
                showError("Error de Fechas", "La fecha de inicio debe ser menor a la fecha fin")
                return
            }
            buscarResumen()
        }
    }, [fechaInicio, fechaFin])

    useEffect(() => {
        filtrarYOrdenarOperaciones()
    }, [operaciones, busqueda, ordenamiento])

    const inicializarDatos = async () => {
        try {
            // Obtener datos del usuario
            const userData = await storage.getUser()
            setUsuario(userData)

            // Configurar fechas por defecto
            const hoy = new Date()
            const ayer = new Date(hoy)
            ayer.setDate(hoy.getDate() - 1)

            // Fecha mínima: primer día del sexto mes atrás
            const fechaMinima = new Date(hoy)
            fechaMinima.setMonth(hoy.getMonth() - 6)
            fechaMinima.setDate(1)

            setFechaInicio(ayer)
            setFechaFin(hoy)
            setMinDate(fechaMinima)
            setMaxDate(hoy)
        } catch (error) {
            console.error("Error al inicializar datos:", error)
            showError("Error", "No se pudieron cargar los datos del usuario")
        }
    }

    const buscarResumen = async () => {
        if (!fechaInicio || !fechaFin) return

        try {
            showWait("Cargando Resumen", "Obteniendo los datos de pagos registrados...")

            const fechaInicioStr = fechaInicio.toISOString().split("T")[0]
            const fechaFinStr = fechaFin.toISOString().split("T")[0]

            const resultado = await resumenDiario.obtenerResumen(fechaInicioStr, fechaFinStr)

            hideWait()

            if (resultado.success) {
                setResumenData(resultado.data.resumen_diario)
                setOperaciones(resultado.data.detalle_operaciones || [])
                setMostrarTodos(false)
            } else {
                showError("Error", resultado.error || "No se pudo obtener el resumen")
                setResumenData(null)
                setOperaciones([])
            }
        } catch (error) {
            hideWait()
            console.error("Error al buscar resumen:", error)
            showError("Error", "Ocurrió un error al obtener el resumen")
        }
    }

    const filtrarYOrdenarOperaciones = () => {
        let filtradas = [...operaciones]

        // Filtrar por búsqueda
        if (busqueda.trim()) {
            const termino = busqueda.toLowerCase().trim()
            filtradas = filtradas.filter(
                (op) =>
                    op.nombre.toLowerCase().includes(termino) ||
                    op.cdgns.toLowerCase().includes(termino)
            )
        }

        // Ordenar
        filtradas.sort((a, b) => {
            switch (ordenamiento) {
                case "nombre":
                    return a.nombre.localeCompare(b.nombre)
                case "credito":
                    return a.cdgns.localeCompare(b.cdgns)
                case "fecha":
                default:
                    return new Date(b.fregistro) - new Date(a.fregistro)
            }
        })

        setOperacionesFiltradas(filtradas)
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await buscarResumen()
        setRefreshing(false)
    }

    const mostrarUbicacion = (operacion) => {
        setUbicacionSeleccionada({
            latitud: operacion.latitud,
            longitud: operacion.longitud,
            nombreCliente: operacion.nombre,
            credito: operacion.cdgns
        })
        setMapModalVisible(true)
    }

    const scrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true })
        }
    }

    const operacionesParaMostrar = mostrarTodos
        ? operacionesFiltradas
        : operacionesFiltradas.slice(0, 10)

    const scrollViewRef = useRef(null)

    const handleToggleExpansion = (operacion) => {
        setExpandedId(expandedId === operacion ? null : operacion)
    }

    return (
        <View
            className="flex-1 bg-primary"
            style={{
                paddingTop: insets.top,
                paddingBottom: Platform.OS === "ios" ? 90 : 60
            }}
        >
            <CustomAlert ref={alertRef} />

            {/* Header */}

            <View className="flex-row items-center p-4">
                <Image
                    source={images.avatar}
                    className="w-10 h-10 rounded-full border border-white"
                />
                <Text className="flex-1 ml-2.5 text-white">HOLA, {usuario?.nombre}</Text>
            </View>

            <View className="bg-white flex-1 rounded-t-3xl">
                <View className="flex-row justify-between items-center border-b border-gray-200 px-3">
                    <Text className="text-lg font-semibold my-5">Mis pagos registrados</Text>
                </View>
                <ScrollView ref={scrollViewRef} className="flex-1">
                    {/* Selectores de Fecha */}
                    <View className="mx-4 mt-4 p-4 rounded-xl">
                        <Text className="text-lg font-bold text-gray-800 mb-4">
                            Rango de Fechas
                        </Text>

                        <View className="flex-row gap-2">
                            <View className="flex-1">
                                <DateSelector
                                    label="Inicio"
                                    date={fechaInicio}
                                    onDateChange={(date) => {
                                        setFechaInicio(date)
                                        if (fechaFin && date > fechaFin) {
                                            setFechaFin(date)
                                        }
                                    }}
                                    minDate={minDate}
                                    maxDate={fechaFin || maxDate}
                                />
                            </View>
                            <View className="flex-1">
                                <DateSelector
                                    label="Fin"
                                    date={fechaFin}
                                    onDateChange={(date) => {
                                        setFechaFin(date)
                                        if (fechaInicio && date < fechaInicio) {
                                            setFechaInicio(date)
                                        }
                                    }}
                                    minDate={fechaInicio || minDate}
                                    maxDate={maxDate}
                                />
                            </View>
                        </View>

                        <Pressable
                            onPress={buscarResumen}
                            className="bg-blue-600 rounded-xl p-4 flex-row justify-center items-center"
                        >
                            <Feather name="search" size={20} color="white" />
                            <Text className="text-white font-semibold text-base ml-2">
                                Consultar
                            </Text>
                        </Pressable>
                    </View>

                    {/* Resumen Diario */}
                    {resumenData && (
                        <View className="bg-white mx-4 mt-4 p-6 rounded-xl shadow-sm">
                            <Text className="text-lg font-bold text-gray-800 mb-4">
                                Resumen del Período
                            </Text>

                            <View className="space-y-3">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-gray-600">Rango de fechas:</Text>
                                    <Text className="font-semibold text-gray-800">
                                        {resumenData.rango_fechas}
                                    </Text>
                                </View>

                                <View className="flex-row justify-between items-center">
                                    <Text className="text-gray-600">Total operaciones:</Text>
                                    <Text className="font-semibold text-blue-600 text-lg">
                                        {resumenData.total_operaciones}
                                    </Text>
                                </View>

                                <View className="flex-row justify-between items-center border-t border-gray-200 pt-3">
                                    <Text className="text-gray-600 font-medium">Monto total:</Text>
                                    <Text className="font-bold text-green-600 text-xl">
                                        ${numeral(resumenData.monto_total).format("0,0.00")}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Búsqueda y Filtros */}
                    {operaciones.length > 0 && (
                        <View className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
                            <View className="flex-row items-center space-x-3 mb-4">
                                <View className="flex-1 flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
                                    <Feather name="search" size={20} color="#9CA3AF" />
                                    <TextInput
                                        className="flex-1 ml-3 text-gray-800"
                                        placeholder="Buscar por nombre o crédito..."
                                        value={busqueda}
                                        onChangeText={setBusqueda}
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            </View>

                            <View className="flex-row items-center space-x-2">
                                <Text className="text-gray-600 font-medium">Ordenar por:</Text>
                                {["fecha", "nombre", "credito"].map((tipo) => (
                                    <Pressable
                                        key={tipo}
                                        onPress={() => setOrdenamiento(tipo)}
                                        className={`px-3 py-2 rounded-lg ${
                                            ordenamiento === tipo
                                                ? "bg-blue-100 border border-blue-300"
                                                : "bg-gray-100"
                                        }`}
                                    >
                                        <Text
                                            className={`text-sm font-medium ${
                                                ordenamiento === tipo
                                                    ? "text-blue-700"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {tipo === "fecha"
                                                ? "Fecha"
                                                : tipo === "nombre"
                                                ? "Nombre"
                                                : "Crédito"}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Lista de Operaciones */}
                    {operacionesParaMostrar.length > 0 && (
                        <View className="mx-4 mt-4 mb-6">
                            <Text className="text-lg font-bold text-gray-800 mb-4 px-2">
                                Detalle de Operaciones ({operacionesFiltradas.length})
                            </Text>

                            <FlatList
                                data={operacionesParaMostrar}
                                keyExtractor={(operacion) =>
                                    operacion.cdgns && operacion.ciclo && operacion.secuencia
                                }
                                renderItem={({ item }) => (
                                    <OperacionCard
                                        operacion={item}
                                        expandida={expandedId === item}
                                        onToggle={() => handleToggleExpansion(item)}
                                        onVerUbicacion={mostrarUbicacion}
                                    />
                                )}
                                showsVerticalScrollIndicator={false}
                                className="pt-2"
                            />

                            {/* Botones de control */}
                            <View className="mt-4 space-y-3">
                                {operacionesFiltradas.length > 10 && !mostrarTodos && (
                                    <Pressable
                                        onPress={() => setMostrarTodos(true)}
                                        className="bg-blue-600 rounded-xl p-4 flex-row justify-center items-center"
                                    >
                                        <Feather name="chevron-down" size={20} color="white" />
                                        <Text className="text-white font-semibold text-base ml-2">
                                            Mostrar Todos ({operacionesFiltradas.length})
                                        </Text>
                                    </Pressable>
                                )}

                                {mostrarTodos && operacionesFiltradas.length > 10 && (
                                    <Pressable
                                        onPress={scrollToTop}
                                        className="bg-gray-600 rounded-xl p-4 flex-row justify-center items-center"
                                    >
                                        <Feather name="chevron-up" size={20} color="white" />
                                        <Text className="text-white font-semibold text-base ml-2">
                                            Volver al Inicio
                                        </Text>
                                    </Pressable>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Estado vacío */}
                    {operaciones.length === 0 && resumenData && (
                        <View className="mx-4 mt-8 p-8 bg-white rounded-xl shadow-sm items-center">
                            <Feather name="inbox" size={48} color="#9CA3AF" />
                            <Text className="text-lg font-medium text-gray-800 mt-4 mb-2">
                                Sin Operaciones
                            </Text>
                            <Text className="text-gray-600 text-center">
                                No se encontraron operaciones en el rango de fechas seleccionado
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>

            {/* Modal del Mapa */}
            <MapModal
                visible={mapModalVisible}
                onClose={() => setMapModalVisible(false)}
                latitud={ubicacionSeleccionada?.latitud}
                longitud={ubicacionSeleccionada?.longitud}
                nombreCliente={ubicacionSeleccionada?.nombreCliente}
                credito={ubicacionSeleccionada?.credito}
            />
        </View>
    )
}

// Componente para las cards de operaciones
function OperacionCard({ operacion, expandida, onToggle, onVerUbicacion }) {
    const [animatedHeight] = useState(new Animated.Value(expandida ? 1 : 0))
    const [contentHeight, setContentHeight] = useState(0)

    useEffect(() => {
        const toValue = expandida ? 1 : 0

        Animated.timing(animatedHeight, {
            toValue,
            duration: 300,
            useNativeDriver: false
        }).start()
    }, [expandida])

    const expandedHeight = animatedHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Math.max(contentHeight, 100)]
    })

    const opacity = animatedHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    })

    const handleContentLayout = (event) => {
        const { height } = event.nativeEvent.layout
        setContentHeight(height)
    }

    return (
        <Pressable
            onPress={onToggle}
            className="bg-white rounded-2xl shadow-md p-4 mb-4 border border-gray-200"
        >
            <View className="flex-row justify-between items-center">
                <View className="flex-1">
                    <Text className="font-semibold text-base">
                        {operacion.nombre || "No disponible"}
                    </Text>
                    <Text className="text-gray-600 text-sm mb-1">
                        Crédito: {operacion.cdgns} • Ciclo: {operacion.ciclo}
                    </Text>
                    <Text className="text-gray-600 text-sm mb-1">Fecha: {operacion.fecha}</Text>
                    <View className="flex-row items-center">
                        <View className="px-2 py-1 rounded-full mr-2 bg-blue-100">
                            <Text className="text-xs font-medium text-blue-700">
                                {operacion.tipo}
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="items-end">
                    <Text className="text-sm text-gray-500">Monto</Text>
                    <Text className="font-semibold text-base">
                        {isNaN(parseFloat(operacion.monto))
                            ? operacion.monto
                            : numeral(operacion.monto).format("$0,0.00")}
                    </Text>
                    <Animated.View
                        style={{
                            transform: [
                                {
                                    rotate: animatedHeight.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ["0deg", "180deg"]
                                    })
                                }
                            ]
                        }}
                    >
                        <Feather name="chevron-down" size={20} color="#6B7280" />
                    </Animated.View>
                </View>
            </View>

            <Animated.View
                style={{
                    height: expandedHeight,
                    opacity: opacity,
                    overflow: "hidden"
                }}
            >
                <View
                    className="mt-3 pt-3 border-t border-gray-200 border-dashed"
                    onLayout={handleContentLayout}
                >
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                            <Text className="text-sm text-gray-700 mb-1">
                                Fecha de registro: {operacion.fregistro}
                            </Text>
                            <Text className="text-sm text-gray-700 mb-1">
                                Secuencia: {operacion.secuencia}
                            </Text>

                            {operacion.comentarios_ejecutivo && (
                                <Text className="text-sm text-gray-700 mb-1">
                                    Comentarios: {operacion.comentarios_ejecutivo}
                                </Text>
                            )}
                        </View>
                        <Pressable
                            onPress={() => onVerUbicacion(operacion)}
                            className="bg-purple-600 rounded-xl p-3 flex-row justify-center items-center"
                        >
                            <Feather name="map-pin" size={18} color="white" />
                            <Text className="text-white font-semibold text-base ml-2">
                                Ubicación
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Animated.View>
        </Pressable>
    )
}
