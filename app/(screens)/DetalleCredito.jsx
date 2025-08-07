import { useContext, useEffect, useState } from "react"
import { View, Text, Pressable, ScrollView, Alert, Modal, Image, Animated } from "react-native"
import { PanGestureHandler, State } from "react-native-gesture-handler"
import { useLocalSearchParams, router, useFocusEffect } from "expo-router"
import { Feather, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons"
import { creditos, pagosPendientes } from "../../services"
import { COLORS } from "../../constants"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import numeral from "numeral"
import { useCallback } from "react"
import { usePago } from "../../context/PagoContext"
import { useDetalle } from "../../context/DetalleContext"

numeral.zeroFormat(0)
numeral.nullFormat(0)

export default function DetalleCredito() {
    const { establecerDatosPago } = usePago()
    const { datosDetalle, tieneContextoDetalle, limpiarDatosDetalle } = useDetalle()
    const [detalle, setDetalle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [maxMovimientos, setMaxMovimientos] = useState(10)
    const [pagosPendientesCredito, setPagosPendientesCredito] = useState([])
    const [modalComprobanteVisible, setModalComprobanteVisible] = useState(false)
    const [comprobanteSeleccionado, setComprobanteSeleccionado] = useState(null)
    const maxMov = 10
    const insets = useContext(SafeAreaInsetsContext)

    const volverAClientes = () => {
        limpiarDatosDetalle()
        if (tieneContextoDetalle()) {
            router.push("/(tabs)/Cartera")
        } else {
            router.back()
        }
    }

    const verComprobante = (pago) => {
        if (pago.fotoComprobante) {
            setComprobanteSeleccionado(pago.fotoComprobante)
            setModalComprobanteVisible(true)
        } else {
            Alert.alert("Sin comprobante", "Este pago no tiene una foto del comprobante asociada.")
        }
    }

    const eliminarPago = async (pagoId) => {
        Alert.alert("Eliminar Pago", "¿Está seguro de que desea eliminar este pago pendiente?", [
            {
                text: "Cancelar",
                style: "cancel"
            },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await pagosPendientes.eliminar(pagoId)
                        const pagosPendientes_ = await pagosPendientes.obtenerPorCredito(
                            datosDetalle?.noCredito
                        )
                        setPagosPendientesCredito(pagosPendientes_)
                    } catch (error) {
                        console.error("Error al eliminar pago:", error)
                        Alert.alert("Error", "No se pudo eliminar el pago. Inténtelo de nuevo.")
                    }
                }
            }
        ])
    }

    useEffect(() => {
        const getDetalle = async () => {
            try {
                setLoading(true)
                const response = await creditos.getDetalleCredito(
                    datosDetalle?.noCredito,
                    datosDetalle?.ciclo
                )
                if (response.success) {
                    setDetalle(response.data)
                    setMaxMovimientos(Math.min(response.data.movimientos.length, maxMov))
                } else {
                    console.error("Error al obtener detalle del crédito:", response.error)
                }

                const pagosPendientes_ = await pagosPendientes.obtenerPorCredito(
                    datosDetalle?.noCredito
                )
                setPagosPendientesCredito(pagosPendientes_)
            } catch (error) {
                console.error("Error inesperado al obtener detalle del crédito:", error)
            } finally {
                setLoading(false)
            }
        }

        getDetalle()
    }, [])

    useFocusEffect(
        useCallback(() => {
            const cargarPagosPendientes = async () => {
                const pagosPendientes_ = await pagosPendientes.obtenerPorCredito(
                    datosDetalle?.noCredito
                )
                setPagosPendientesCredito(pagosPendientes_)
            }
            cargarPagosPendientes()
        }, [])
    )

    const resumenDetalle = () => {
        if (!detalle) return null

        const creditoInfo = detalle.detalle_credito || {}
        const movimientos = detalle.movimientos || []
        const totalPagado = detalle.detalle_credito.total_pd
        const totalPendiente = pagosPendientesCredito.reduce((sum, p) => sum + p.monto, 0)
        const pagoPromedio = movimientos.length > 0 ? totalPagado / movimientos.length : 0
        const saldoTotal = creditoInfo?.saldo_total
        const progreso = creditoInfo?.progreso_porcentaje / 100
        const progreso_color = getColorProgreso(progreso)

        return {
            totalPagado,
            totalPendiente,
            pagoPromedio,
            saldoTotal,
            progreso,
            progreso_color,
            pagosSemana: numeral(creditoInfo.pago_semanal).value(),
            totalMovimientos: movimientos.length
        }
    }

    const getColorProgreso = (progreso) => {
        if (progreso >= 1) return "#16a34a"
        if (progreso >= 0.75) return "#f59e0b"
        return "#ef4444"
    }

    const resumen = resumenDetalle()

    const TransaccionPendiente = ({ pago, index }) => {
        const [translateX] = useState(new Animated.Value(0))

        const onGestureEvent = Animated.event([{ nativeEvent: { translationX: translateX } }], {
            useNativeDriver: false
        })

        const onHandlerStateChange = (event) => {
            if (event.nativeEvent.state === State.END) {
                const { translationX } = event.nativeEvent

                if (translationX > 70) {
                    Animated.spring(translateX, {
                        toValue: 80,
                        useNativeDriver: false
                    }).start()
                } else {
                    closeActions()
                }
            }
        }

        const closeActions = () => {
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: false
            }).start()
        }

        return (
            <View className="mb-4" style={{ overflow: "hidden", borderRadius: 16 }}>
                <View
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 160,
                        flexDirection: "row",
                        backgroundColor: "transparent"
                    }}
                >
                    <Pressable
                        onPress={() => {
                            closeActions()
                            verComprobante(pago)
                        }}
                        style={{
                            backgroundColor: "#3b82f6",
                            width: 80,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <MaterialIcons name="visibility" size={24} color="white" />
                        <Text style={{ color: "white", fontSize: 12, marginTop: 4 }}>
                            Comprobante
                        </Text>
                    </Pressable>
                    {/* <Pressable
                        onPress={() => {
                            closeActions()
                            eliminarPago(pago.id)
                        }}
                        style={{
                            backgroundColor: "#ef4444",
                            width: 80,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <MaterialIcons name="delete" size={24} color="white" />
                        <Text style={{ color: "white", fontSize: 12, marginTop: 4 }}>Eliminar</Text>
                    </Pressable> */}
                </View>

                {/* Contenido principal deslizable */}
                <PanGestureHandler
                    onGestureEvent={onGestureEvent}
                    onHandlerStateChange={onHandlerStateChange}
                    minDeltaX={10}
                >
                    <Animated.View
                        style={{
                            transform: [
                                {
                                    translateX: translateX.interpolate({
                                        inputRange: [0, 80],
                                        outputRange: [0, 80],
                                        extrapolate: "clamp"
                                    })
                                }
                            ],
                            backgroundColor: "#fefce8",
                            borderWidth: 1,
                            borderColor: "#fde047",
                            borderRadius: 16,
                            padding: 16,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <View style={{ flexDirection: "row", flex: 1 }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginBottom: 8
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: "#fef3c7",
                                            padding: 8,
                                            borderRadius: 20,
                                            marginRight: 12
                                        }}
                                    >
                                        <MaterialIcons name="schedule" size={16} color="#f59e0b" />
                                    </View>
                                </View>

                                <View style={{ alignItems: "flex-start" }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "500",
                                            color: "#1f2937"
                                        }}
                                    >
                                        Pago{" "}
                                        {new Date(pago.fechaCaptura).toLocaleDateString("es-MX", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit"
                                        })}
                                    </Text>
                                    <Text style={{ fontSize: 12, color: "#6b7280" }}>
                                        {new Date(pago.fechaCaptura).toLocaleTimeString("es-MX", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit"
                                        })}
                                    </Text>
                                    <View
                                        style={{
                                            backgroundColor: "#fef3c7",
                                            paddingHorizontal: 8,
                                            paddingVertical: 4,
                                            borderRadius: 6,
                                            marginTop: 4
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: "500",
                                                color: "#92400e"
                                            }}
                                        >
                                            {pago.tipoEtiqueta}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{ alignItems: "flex-end" }}>
                                <Text
                                    style={{ fontSize: 18, fontWeight: "bold", color: "#d97706" }}
                                >
                                    {numeral(pago.monto).format("$0,0.00")}
                                </Text>
                                <Text style={{ fontSize: 12, color: "#d97706" }}>En Transito</Text>
                                <Text style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
                                    👉 Deslizar para opciones
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                </PanGestureHandler>
            </View>
        )
    }

    if (loading) {
        return (
            <View
                className="flex-1 justify-center items-center"
                style={{ backgroundColor: COLORS.primary }}
            >
                <Text className="text-white text-lg">Cargando detalle...</Text>
            </View>
        )
    }

    return (
        <View
            className="flex-1"
            style={{
                paddingTop: insets.top,
                backgroundColor: COLORS.primary
            }}
        >
            <View className="flex-row items-center p-4">
                <Pressable onPress={volverAClientes} className="mr-4">
                    <Feather name="arrow-left" size={24} color="white" />
                </Pressable>
                <Text className="flex-1 text-white text-lg font-semibold">Detalle del Crédito</Text>
            </View>
            <View className="bg-white flex-1 rounded-t-3xl">
                <View className="p-6 border-b border-gray-200">
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-gray-800 mb-1">
                                {datosDetalle?.nombre || `Cliente ${datosDetalle?.noCredito}`}
                            </Text>
                            <Text className="text-base text-gray-600 mb-2">
                                Crédito {datosDetalle?.noCredito || "N/D"} • Ciclo{" "}
                                {datosDetalle?.ciclo || "N/D"}
                            </Text>
                            <View className="flex-row items-center mb-2">
                                <View
                                    className={`px-3 py-1 rounded-full mr-3 ${
                                        datosDetalle?.tipoCartera === "VIGENTE"
                                            ? "bg-green-100"
                                            : datosDetalle?.tipoCartera === "VENCIDA"
                                            ? "bg-red-100"
                                            : "bg-yellow-100"
                                    }`}
                                >
                                    <Text
                                        className={`text-sm font-medium ${
                                            datosDetalle?.tipoCartera === "VIGENTE"
                                                ? "text-green-700"
                                                : datosDetalle?.tipoCartera === "VENCIDA"
                                                ? "text-red-700"
                                                : "text-yellow-700"
                                        }`}
                                    >
                                        {datosDetalle?.tipoCartera || "Sin estado"}
                                    </Text>
                                </View>

                                {datosDetalle?.diasMora && parseInt(datosDetalle?.diasMora) > 0 && (
                                    <View className="bg-red-100 px-3 py-1 rounded-full">
                                        <Text className="text-sm font-medium text-red-700">
                                            {datosDetalle?.diasMora} días en mora
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        {resumen && resumen.progreso < 1 && (
                            <Pressable
                                onPress={() => {
                                    establecerDatosPago({
                                        noCreditoDetalle: datosDetalle?.noCredito,
                                        cicloDetalle: datosDetalle?.ciclo,
                                        pagoSemanalDetalle: resumen?.pagosSemana,
                                        nombre: datosDetalle?.nombre
                                    })
                                    router.push("/(tabs)/Pago")
                                }}
                                className="ml-4 p-3 bg-green-500 rounded-full shadow-lg"
                            >
                                <MaterialCommunityIcons name="plus" size={24} color="white" />
                            </Pressable>
                        )}
                    </View>

                    <View className="bg-gray-50 rounded-xl p-4">
                        <View className="flex-row justify-between items-center">
                            <View className="items-center flex-1">
                                <Text className="text-xs text-gray-600 mb-1">Saldo Total</Text>
                                <Text className="text-lg font-bold text-gray-800">
                                    {numeral(resumen.saldoTotal).format("$0,0.00")}
                                </Text>
                            </View>
                            {datosDetalle?.moraTotal && parseFloat(datosDetalle?.moraTotal) > 0 && (
                                <View className="items-center flex-1">
                                    <Text className="text-xs text-gray-600 mb-1">Mora Total</Text>
                                    <Text className="text-lg font-bold text-red-600">
                                        {numeral(datosDetalle?.moraTotal).format("$0,0.00")}
                                    </Text>
                                </View>
                            )}
                            <View className="items-center flex-1">
                                <Text className="text-xs text-gray-600 mb-1">Día de pago</Text>
                                <Text className="text-sm font-medium text-gray-700">
                                    {datosDetalle?.diaPago}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {resumen && (
                        <View className="p-6">
                            <Text className="text-lg font-semibold text-gray-800 mb-4">
                                Análisis del Crédito
                            </Text>
                            <View className="flex-row flex-wrap justify-between mb-4">
                                <View className="w-[48%] bg-blue-50 p-4 rounded-xl mb-3">
                                    <View className="flex-row items-center mb-2">
                                        <MaterialIcons
                                            name="account-balance"
                                            size={20}
                                            color="#3b82f6"
                                        />
                                        <Text className="text-sm font-medium text-blue-700 ml-2">
                                            Préstamo
                                        </Text>
                                    </View>
                                    <Text className="text-xl font-bold text-blue-800">
                                        {numeral(datosDetalle?.cantEntregada).format("$0,0.00")}
                                    </Text>
                                </View>
                                <View className="w-[48%] bg-green-50 p-4 rounded-xl mb-3">
                                    <View className="flex-row items-center mb-2">
                                        <MaterialIcons name="payments" size={20} color="#16a34a" />
                                        <Text className="text-sm font-medium text-green-700 ml-2">
                                            Total Pagado
                                        </Text>
                                        <View className="ml-auto">
                                            <MaterialIcons name="info" size={20} color="#4fa2b0" />
                                        </View>
                                    </View>
                                    <Text className="text-xl font-bold text-green-800">
                                        {numeral(resumen.totalPagado).format("$0,0.00")}
                                    </Text>
                                </View>
                                <View className="w-[48%] bg-orange-50 p-4 rounded-xl mb-3">
                                    <View className="flex-row items-center mb-2">
                                        <FontAwesome5
                                            name="hand-holding-usd"
                                            size={20}
                                            color="#ea580c"
                                        />
                                        <Text className="text-sm font-medium text-orange-700 ml-2">
                                            Pago Semanal
                                        </Text>
                                    </View>
                                    <Text className="text-xl font-bold text-orange-800">
                                        {numeral(resumen.pagosSemana).format("$0,0.00")}
                                    </Text>
                                </View>
                                <View className="w-[48%] bg-purple-50 p-4 rounded-xl mb-3">
                                    <View className="flex-row items-center mb-2">
                                        <MaterialIcons
                                            name="calendar-month"
                                            size={20}
                                            color="#9333ea"
                                        />
                                        <Text className="text-sm font-medium text-purple-700 ml-2">
                                            Plazo
                                        </Text>
                                    </View>
                                    <Text className="text-xl font-bold text-purple-800">
                                        {detalle.detalle_credito.plazo}
                                    </Text>
                                </View>
                            </View>
                            <View className="bg-gray-50 rounded-2xl p-4">
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-sm font-medium text-gray-700">
                                        Progreso del Crédito
                                    </Text>
                                    <Text className="text-lg font-bold text-blue-600">
                                        {numeral(resumen.progreso).format("0.0%")}
                                    </Text>
                                </View>
                                <View className="bg-gray-200 h-3 rounded-full overflow-hidden">
                                    <View
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${Math.min(resumen.progreso * 100, 100)}%`,
                                            backgroundColor: `hsl(${Math.min(
                                                resumen.progreso * 120,
                                                120
                                            )}, 100%, 50%)`
                                        }}
                                    />
                                </View>
                                <View className="justify-center items-center mt-3">
                                    <Text className="text-sm font-medium text-gray-500">
                                        {detalle.detalle_credito.mensaje_motivador}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                    <View className="p-6 border-t border-gray-200">
                        {(detalle?.movimientos && detalle.movimientos.length > 0) ||
                        pagosPendientesCredito.length > 0 ? (
                            <>
                                <View className="flex-row justify-between items-center mb-4">
                                    <Text className="text-lg font-semibold text-gray-800">
                                        Historial de Pagos
                                    </Text>
                                    <View className="bg-blue-100 px-3 py-1 rounded-full">
                                        <Text className="text-xs font-medium text-blue-700">
                                            {(detalle.movimientos?.length || 0) +
                                                pagosPendientesCredito.length}{" "}
                                            total
                                        </Text>
                                    </View>
                                </View>
                                <View className="space-y-3">
                                    {pagosPendientesCredito.map((pago, index) => (
                                        <TransaccionPendiente
                                            key={`pendiente-${index}`}
                                            pago={pago}
                                            index={index}
                                        />
                                    ))}
                                    {detalle.movimientos
                                        ?.slice(0, maxMovimientos)
                                        .map((mov, index) => (
                                            <View
                                                key={`procesado-${index}`}
                                                className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-md"
                                            >
                                                <View className="flex-row justify-between items-center">
                                                    <View className="flex-row flex-1">
                                                        <View className="flex-row items-center mb-2">
                                                            <View className="bg-green-100 p-2 rounded-full mr-3">
                                                                <MaterialIcons
                                                                    name="attach-money"
                                                                    size={16}
                                                                    color="#16a34a"
                                                                />
                                                            </View>
                                                        </View>
                                                        <View className="items-start">
                                                            <Text className="text-sm font-medium text-gray-800">
                                                                Pago {mov.fecha_valor}
                                                            </Text>
                                                            <Text className="text-xs text-gray-500">
                                                                {mov.fecha_captura || "Sin fecha"}
                                                            </Text>
                                                            <View className="bg-blue-100 px-2 py-1 rounded-md mr-2 ">
                                                                <Text className="text-xs font-medium text-blue-700">
                                                                    {mov.tipo || "Pago"}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View className="items-end">
                                                        <Text className="text-lg font-bold text-green-600">
                                                            {numeral(mov?.monto).format("$0,0.00")}
                                                        </Text>
                                                        <Text className="text-xs">
                                                            {mov.estatus_caja}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                </View>
                                {detalle.movimientos &&
                                    detalle.movimientos.length > maxMovimientos && (
                                        <Pressable
                                            onPress={() =>
                                                setMaxMovimientos(
                                                    Math.min(
                                                        maxMovimientos + 10,
                                                        detalle.movimientos.length
                                                    )
                                                )
                                            }
                                            className="mt-4 p-3 border border-gray-300 rounded-xl"
                                        >
                                            <Text className="text-center text-blue-600 font-medium">
                                                Ver más movimientos (
                                                {detalle.movimientos.length - maxMovimientos}{" "}
                                                restantes)
                                            </Text>
                                        </Pressable>
                                    )}
                            </>
                        ) : (
                            <View className="bg-gray-50 rounded-xl p-8 items-center">
                                <View className="bg-gray-200 p-4 rounded-full mb-4">
                                    <MaterialIcons name="inbox" size={32} color="#9CA3AF" />
                                </View>
                                <Text className="text-lg font-medium text-gray-600 mb-2">
                                    Sin movimientos registrados
                                </Text>
                                <Text className="text-sm text-gray-500 text-center mb-4">
                                    No se han registrado pagos para este crédito
                                </Text>
                                <Pressable
                                    onPress={() => {
                                        establecerDatosPago({
                                            noCreditoDetalle: datosDetalle?.noCredito,
                                            cicloDetalle: datosDetalle?.ciclo,
                                            nombre: datosDetalle.nombre,
                                            pagoSemanalDetalle: resumen?.pagosSemana || 0
                                        })
                                        router.push("/(tabs)/Pago")
                                    }}
                                    className="bg-blue-500 px-6 py-3 rounded-xl"
                                >
                                    <Text className="text-white font-medium">
                                        Registrar primer pago
                                    </Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
            <Modal
                visible={modalComprobanteVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalComprobanteVisible(false)}
            >
                <View className="flex-1 bg-black bg-opacity-80 justify-center items-center">
                    <View className="bg-white rounded-2xl p-4 m-4 max-w-sm w-full">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-semibold text-gray-800">
                                Comprobante de Pago
                            </Text>
                            <Pressable
                                onPress={() => setModalComprobanteVisible(false)}
                                className="p-2"
                            >
                                <MaterialIcons name="close" size={24} color="#6B7280" />
                            </Pressable>
                        </View>
                        {comprobanteSeleccionado ? (
                            <View>
                                <Image
                                    source={{ uri: comprobanteSeleccionado }}
                                    className="h-96 rounded-xl"
                                    resizeMode="contain"
                                />
                            </View>
                        ) : (
                            <View className="items-center py-8">
                                <MaterialIcons
                                    name="image-not-supported"
                                    size={64}
                                    color="#9CA3AF"
                                />
                                <Text className="text-gray-500 mt-4">
                                    No se pudo cargar el comprobante
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    )
}
