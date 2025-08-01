import { useContext, useEffect, useState } from "react"
import { View, Text, Pressable, ScrollView } from "react-native"
import { useLocalSearchParams, router, useFocusEffect } from "expo-router"
import { Feather, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons"
import { creditos, pagosPendientes } from "../../services"
import { COLORS } from "../../constants"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import numeral from "numeral"
import { useCallback } from "react"

numeral.zeroFormat(0)
numeral.nullFormat(0)

export default function DetalleCredito() {
    const {
        noCredito,
        ciclo,
        nombre,
        diaPago,
        saldoTotal,
        cantEntregada,
        tipoCartera,
        fechaInicio,
        diasMora,
        moraTotal,
        fechaCalc
    } = useLocalSearchParams()
    const [detalle, setDetalle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [maxMovimientos, setMaxMovimientos] = useState(10)
    const [pagosPendientesCredito, setPagosPendientesCredito] = useState([])
    const maxMov = 10
    const insets = useContext(SafeAreaInsetsContext)

    const volverAClientes = () => {
        router.back()
    }

    useEffect(() => {
        const getDetalle = async () => {
            try {
                setLoading(true)
                const response = await creditos.getDetalleCredito(noCredito, ciclo)
                if (response.success) {
                    setDetalle(response.data)
                    setMaxMovimientos(Math.min(response.data.movimientos.length, maxMov))
                } else {
                    console.error("Error al obtener detalle del crédito:", response.error)
                }

                // Obtener pagos pendientes para este crédito
                const pagosPendientes_ = await pagosPendientes.obtenerPorCredito(noCredito)
                setPagosPendientesCredito(pagosPendientes_)
            } catch (error) {
                console.error("Error inesperado al obtener detalle del crédito:", error)
            } finally {
                setLoading(false)
            }
        }

        getDetalle()
    }, [noCredito])

    // Refrescar pagos pendientes cuando la pantalla recibe el foco
    useFocusEffect(
        useCallback(() => {
            const cargarPagosPendientes = async () => {
                const pagosPendientes_ = await pagosPendientes.obtenerPorCredito(noCredito)
                setPagosPendientesCredito(pagosPendientes_)
            }
            cargarPagosPendientes()
        }, [noCredito])
    )

    const resumenDetalle = () => {
        if (!detalle) return null

        const creditoInfo = detalle.detalle_credito || {}
        const movimientos = detalle.movimientos || []

        // Incluir pagos pendientes en el cálculo del total pagado
        const totalPagado = movimientos.reduce((sum, m) => sum + numeral(m?.monto).value(), 0)
        const totalPendiente = pagosPendientesCredito.reduce((sum, p) => sum + p.monto, 0)
        const totalPagadoConPendientes = totalPagado + totalPendiente

        const pagoPromedio = movimientos.length > 0 ? totalPagado / movimientos.length : 0
        const saldoTotal = numeral(creditoInfo.saldo_total).value()
        const progreso =
            saldoTotal > 0 ? totalPagadoConPendientes / (totalPagadoConPendientes + saldoTotal) : 0

        return {
            totalPagado,
            totalPendiente,
            totalPagadoConPendientes,
            pagoPromedio,
            saldoTotal,
            progreso,
            pagosSemana: numeral(creditoInfo.pago_semanal).value(),
            totalMovimientos: movimientos.length
        }
    }

    const resumen = resumenDetalle()

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
            {/* Header */}
            <View className="flex-row items-center p-4">
                <Pressable onPress={volverAClientes} className="mr-4">
                    <Feather name="arrow-left" size={24} color="white" />
                </Pressable>
                <Text className="flex-1 text-white text-lg font-semibold">Detalle del Crédito</Text>
            </View>

            {/* Content Container */}
            <View className="bg-white flex-1 rounded-t-3xl">
                {/* Header Info - Información del cliente y crédito */}
                <View className="p-6 border-b border-gray-200">
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-gray-800 mb-1">
                                {nombre || `Cliente ${noCredito}`}
                            </Text>
                            <Text className="text-base text-gray-600 mb-2">
                                Crédito {noCredito} • Ciclo {ciclo}
                            </Text>

                            {/* Status del crédito */}
                            <View className="flex-row items-center mb-2">
                                <View
                                    className={`px-3 py-1 rounded-full mr-3 ${
                                        tipoCartera === "VIGENTE"
                                            ? "bg-green-100"
                                            : tipoCartera === "VENCIDA"
                                            ? "bg-red-100"
                                            : "bg-yellow-100"
                                    }`}
                                >
                                    <Text
                                        className={`text-sm font-medium ${
                                            tipoCartera === "VIGENTE"
                                                ? "text-green-700"
                                                : tipoCartera === "VENCIDA"
                                                ? "text-red-700"
                                                : "text-yellow-700"
                                        }`}
                                    >
                                        {tipoCartera || "Sin estado"}
                                    </Text>
                                </View>

                                {diasMora && parseInt(diasMora) > 0 && (
                                    <View className="bg-red-100 px-3 py-1 rounded-full">
                                        <Text className="text-sm font-medium text-red-700">
                                            {diasMora} días en mora
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Icono para ir a registro de pago */}
                        {resumen && resumen.progreso < 1 && (
                            <Pressable
                                onPress={() =>
                                    router.push({
                                        pathname: "/(tabs)/Pago",
                                        params: {
                                            noCreditoDetalle: noCredito,
                                            cicloDetalle: ciclo,
                                            pagoSemanalDetalle: resumen.pagosSemana,
                                            timestamp: Date.now().toString()
                                        }
                                    })
                                }
                                className="ml-4 p-3 bg-green-500 rounded-full shadow-lg"
                            >
                                <MaterialCommunityIcons
                                    name="cash-register"
                                    size={28}
                                    color="white"
                                />
                            </Pressable>
                        )}
                    </View>

                    {/* Información financiera rápida */}
                    <View className="bg-gray-50 rounded-xl p-4">
                        <View className="flex-row justify-between items-center">
                            <View className="items-center flex-1">
                                <Text className="text-xs text-gray-600 mb-1">Saldo Total</Text>
                                <Text className="text-lg font-bold text-gray-800">
                                    {numeral(saldoTotal || 0).format("$0,0.00")}
                                </Text>
                            </View>

                            {moraTotal && parseFloat(moraTotal) > 0 && (
                                <View className="items-center flex-1">
                                    <Text className="text-xs text-gray-600 mb-1">Mora Total</Text>
                                    <Text className="text-lg font-bold text-red-600">
                                        {numeral(moraTotal).format("$0,0.00")}
                                    </Text>
                                </View>
                            )}

                            <View className="items-center flex-1">
                                <Text className="text-xs text-gray-600 mb-1">Día de pago</Text>
                                <Text className="text-sm font-medium text-gray-700">{diaPago}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Contenido con scroll */}
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Progreso del Crédito */}
                    {resumen && (
                        <View className="p-6">
                            <Text className="text-lg font-semibold text-gray-800 mb-4">
                                Análisis del Crédito
                            </Text>

                            {/* Cards de estadísticas mejoradas */}
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
                                        {numeral(cantEntregada).format("$0,0.00")}
                                    </Text>
                                </View>

                                <View className="w-[48%] bg-green-50 p-4 rounded-xl mb-3">
                                    <View className="flex-row items-center mb-2">
                                        <MaterialIcons name="payments" size={20} color="#16a34a" />
                                        <Text className="text-sm font-medium text-green-700 ml-2">
                                            Total Pagado
                                        </Text>
                                    </View>
                                    <Text className="text-xl font-bold text-green-800">
                                        {numeral(resumen.totalPagadoConPendientes).format(
                                            "$0,0.00"
                                        )}
                                    </Text>
                                    {resumen.totalPendiente > 0 && (
                                        <Text className="text-xs text-green-600 mt-1">
                                            Incluye{" "}
                                            {numeral(resumen.totalPendiente).format("$0,0.00")}{" "}
                                            pendiente
                                        </Text>
                                    )}
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

                            {/* Barra de progreso mejorada */}
                            <View className="bg-gray-50 rounded-2xl p-4">
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-sm font-medium text-gray-700">
                                        Progreso de Pago
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
                                            backgroundColor:
                                                resumen.progreso >= 1 ? "#16a34a" : COLORS.primary
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Historial de Movimientos */}
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

                                {/* Lista de movimientos con mejor diseño */}
                                <View className="space-y-3">
                                    {/* Mostrar pagos pendientes primero */}
                                    {pagosPendientesCredito.map((pago, index) => (
                                        <View
                                            key={`pendiente-${index}`}
                                            className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4 shadow-md"
                                        >
                                            <View className="flex-row justify-between items-center">
                                                <View className="flex-row flex-1">
                                                    <View className="flex-row items-center mb-2">
                                                        <View className="bg-yellow-100 p-2 rounded-full mr-3">
                                                            <MaterialIcons
                                                                name="schedule"
                                                                size={16}
                                                                color="#f59e0b"
                                                            />
                                                        </View>
                                                    </View>

                                                    <View className="items-start">
                                                        <Text className="text-sm font-medium text-gray-800">
                                                            Pago{" "}
                                                            {new Date(
                                                                pago.fechaCaptura
                                                            ).toLocaleDateString()}
                                                        </Text>
                                                        <Text className="text-xs text-gray-500">
                                                            {new Date(
                                                                pago.fechaCaptura
                                                            ).toLocaleTimeString()}
                                                        </Text>
                                                        <View className="bg-yellow-100 px-2 py-1 rounded-md mr-2">
                                                            <Text className="text-xs font-medium text-yellow-700">
                                                                {pago.tipoPago === "pago"
                                                                    ? "Pago Regular"
                                                                    : "Multa"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>

                                                <View className="items-end">
                                                    <Text className="text-lg font-bold text-yellow-600">
                                                        {numeral(pago.monto).format("$0,0.00")}
                                                    </Text>
                                                    <Text className="text-xs text-yellow-600">
                                                        Pendiente de entrega
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}

                                    {/* Mostrar movimientos procesados */}
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
                                                            Procesado en caja
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                </View>

                                {/* Mostrar más movimientos si los hay */}
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
                            /* Estado vacío mejorado */
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
                                    onPress={() =>
                                        router.push({
                                            pathname: "/(tabs)/Pago",
                                            params: {
                                                noCreditoDetalle: creditoInfo.no_credito,
                                                cicloDetalle: creditoInfo.ciclo,
                                                nombre: creditoInfo.nombre,
                                                pagoSemanalDetalle: creditoInfo.pago_semanal,
                                                timestamp: Date.now().toString()
                                            }
                                        })
                                    }
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
        </View>
    )
}
