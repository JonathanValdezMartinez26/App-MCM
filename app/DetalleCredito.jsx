import { useContext, useEffect, useState } from "react"
import { View, Text, Pressable, ScrollView } from "react-native"
import { useLocalSearchParams, router } from "expo-router"
import { Feather, MaterialIcons } from "@expo/vector-icons"
import { creditos } from "../services"
import { COLORS } from "../constants"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import numeral from "numeral"

numeral.zeroFormat(0)
numeral.nullFormat(0)

export default function DetalleCredito() {
    const { noCredito, ciclo } = useLocalSearchParams()
    const [detalle, setDetalle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [maxMovimientos, setMaxMovimientos] = useState(10)
    const maxMov = 10
    const insets = useContext(SafeAreaInsetsContext)

    const volverAClientes = () => {
        router.push("/(tabs)/Cartera")
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
            } catch (error) {
                console.error("Error inesperado al obtener detalle del crédito:", error)
            } finally {
                setLoading(false)
            }
        }

        getDetalle()
    }, [noCredito])

    const resumenDetalle = () => {
        if (!detalle) return null

        const creditoInfo = detalle.detalle_credito || {}
        const movimientos = detalle.movimientos || []

        const totalPagado = movimientos.reduce((sum, m) => sum + numeral(m?.monto).value(), 0)
        const pagoPromedio = movimientos.length > 0 ? totalPagado / movimientos.length : 0
        const saldoTotal = numeral(creditoInfo.saldo_total).value()
        let progreso = saldoTotal > 0 ? totalPagado / saldoTotal : 0
        progreso = totalPagado < saldoTotal ? progreso : 1

        return {
            totalPagado,
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
                {/* Header Info - Sección fija */}
                <View className="p-6 border-b border-gray-200 flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-gray-800 mb-2">
                            Crédito {noCredito}
                        </Text>
                        <Text className="text-base text-gray-600">
                            Ciclo {ciclo} • {resumen?.totalMovimientos || 0} movimientos
                        </Text>
                    </View>

                    {/* Icono para ir a registro de pago */}
                    {resumen.progreso < 1 && (
                        <Pressable
                            onPress={() => router.push("/(tabs)/Pago")}
                            className="ml-4 p-3 bg-green-500 rounded-full shadow-lg"
                        >
                            <MaterialIcons name="add-circle" size={28} color="white" />
                        </Pressable>
                    )}
                </View>

                {/* Contenido con scroll */}
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Progreso del Crédito */}
                    {resumen && (
                        <View className="p-6">
                            <Text className="text-lg font-semibold text-gray-800 mb-4">
                                Progreso del Crédito
                            </Text>

                            {/* Cards de estadísticas */}
                            <View className="flex-row flex-wrap justify-between">
                                <View className="w-[33%] p-4 rounded-xl mb-3 justify-center items-center">
                                    <MaterialIcons
                                        name="account-balance"
                                        size={24}
                                        color="#dc2626"
                                    />
                                    <Text className="text-xs text-gray-600 mt-1">Otorgado</Text>
                                    <Text className="text-lg font-bold ">
                                        {numeral(resumen.saldoTotal).format("$0,0.00")}
                                    </Text>
                                </View>

                                <View className="w-[33%] p-4 rounded-xl mb-3 justify-center items-center">
                                    <MaterialIcons name="schedule" size={24} color="#ea580c" />
                                    <Text className="text-xs text-gray-600 mt-1">Pago Semanal</Text>
                                    <Text className="text-lg font-bold ">
                                        {numeral(resumen.pagosSemana).format("$0,0.00")}
                                    </Text>
                                </View>

                                <View className="w-[33%] p-4 rounded-xl mb-3 justify-center items-center">
                                    <MaterialIcons name="payments" size={24} color="#16a34a" />
                                    <Text className="text-xs text-gray-600 mt-1">Total Pagado</Text>
                                    <Text className="text-lg font-bold ">
                                        {numeral(resumen.totalPagado).format("$0,0.00")}
                                    </Text>
                                </View>
                            </View>

                            <View className="bg-blue-50 rounded-2xl p-4 mb-4">
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-sm text-gray-600">Progreso de pago</Text>
                                    <Text className="text-lg font-bold text-blue-600">
                                        {numeral(resumen.progreso).format("0.0%")}
                                    </Text>
                                </View>

                                {/* Barra de progreso visual */}
                                <View className="bg-blue-200 h-3 rounded-full overflow-hidden">
                                    <View
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${Math.min(resumen.progreso * 100, 100)}%`,
                                            backgroundColor: COLORS.primary
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Resumen de Movimientos Recientes */}

                    <View className="p-6 border-t border-gray-200">
                        {detalle?.movimientos && detalle.movimientos.length > 0 ? (
                            <>
                                <Text className="text-lg font-semibold text-gray-800 mb-4">
                                    Últimos {maxMovimientos} movimientos
                                </Text>
                                {/* Encabezado de la tabla */}
                                <View className="bg-gray-100 rounded-t-xl p-4 flex-row">
                                    <Text className="flex-1 text-sm font-bold text-gray-700 text-center">
                                        Fecha
                                    </Text>
                                    <Text className="flex-1 text-sm font-bold text-gray-700 text-center">
                                        Tipo
                                    </Text>
                                    <Text className="flex-1 text-sm font-bold text-gray-700 text-center">
                                        Monto
                                    </Text>
                                </View>

                                {/* Filas de datos */}
                                <View className="bg-white border border-gray-100 rounded-b-xl">
                                    {detalle.movimientos
                                        .slice(0, maxMovimientos)
                                        .map((mov, index) => (
                                            <View
                                                key={index}
                                                className={`flex-row p-4 ${
                                                    index !==
                                                    detalle.movimientos.slice(0, maxMovimientos)
                                                        .length -
                                                        1
                                                        ? "border-b border-gray-100"
                                                        : ""
                                                }`}
                                            >
                                                <View className="flex-1 items-center">
                                                    <Text className="text-sm text-gray-800 text-center">
                                                        {mov.fecha_captura || "Sin fecha"}
                                                    </Text>
                                                </View>
                                                <View className="flex-1 items-center">
                                                    <View className="bg-blue-100 px-2 py-1 rounded-lg">
                                                        <Text className="text-xs font-medium text-blue-800">
                                                            {mov.tipo || "N/A"}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View className="flex-1 items-center">
                                                    <Text className="text-sm font-bold text-green-600">
                                                        {numeral(mov?.monto).format("$0,0.00")}
                                                    </Text>
                                                </View>
                                            </View>
                                        ))}
                                </View>
                            </>
                        ) : (
                            /* Estado vacío cuando no hay movimientos */
                            <View className="bg-gray-50 rounded-xl p-8 items-center">
                                <MaterialIcons name="inbox" size={48} color="#9CA3AF" />
                                <Text className="text-lg font-medium text-gray-500 mt-3 mb-1">
                                    Sin movimientos
                                </Text>
                                <Text className="text-sm text-gray-400 text-center">
                                    No se han registrado pagos para este crédito
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}
