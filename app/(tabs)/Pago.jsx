import { useContext, useEffect, useState } from "react"
import { View, Text, TextInput, Pressable, ScrollView, Alert, Modal, Animated } from "react-native"
import { useLocalSearchParams, router } from "expo-router"
import { Feather, MaterialIcons } from "@expo/vector-icons"
import { COLORS } from "@/constants"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import numeral from "numeral"

export default function RegistroPago() {
    const { noCredito: creditoParam, ciclo: cicloParam } = useLocalSearchParams()
    const insets = useContext(SafeAreaInsetsContext)

    // Estados para los campos del formulario
    const [credito, setCredito] = useState(creditoParam || "")
    const [ciclo, setCiclo] = useState(cicloParam || "")
    const [monto, setMonto] = useState("")
    const [tipoPago, setTipoPago] = useState("")

    // Estados para la interfaz
    const [showTipoSelect, setShowTipoSelect] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    const [modalType, setModalType] = useState("success") // success, error

    // Animaciones
    const scaleAnim = useState(new Animated.Value(1))[0]

    const vieneDeDetalle = Boolean(creditoParam && cicloParam)

    // Tipos de pago (temporal, después se consultará de la base)
    const tiposPago = [
        { value: "pago", label: "Pago" },
        { value: "multa", label: "Multa" }
    ]

    const limpiarFormulario = () => {
        if (!vieneDeDetalle) {
            setCredito("")
            setCiclo("")
        }
        setMonto("")
        setTipoPago("")
    }

    const validarDatos = () => {
        if (!credito.trim()) {
            mostrarModal("Error: El número de crédito es requerido", "error")
            return false
        }
        if (!ciclo.trim()) {
            mostrarModal("Error: El ciclo es requerido", "error")
            return false
        }
        if (!tipoPago) {
            mostrarModal("Error: Debe seleccionar un tipo de pago", "error")
            return false
        }
        if (!monto.trim() || isNaN(parseFloat(monto)) || parseFloat(monto) <= 0) {
            mostrarModal("Error: El monto debe ser un número válido mayor a 0", "error")
            return false
        }
        return true
    }

    const mostrarModal = (mensaje, tipo) => {
        setModalMessage(mensaje)
        setModalType(tipo)
        setModalVisible(true)

        // Animación del botón
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
        ]).start()
    }

    const procesarPago = () => {
        if (!validarDatos()) return

        const tipoSeleccionado = tiposPago.find((t) => t.value === tipoPago)?.label || tipoPago
        mostrarModal(`${tipoSeleccionado} registrado exitosamente`, "success")
    }

    const cerrarModal = () => {
        setModalVisible(false)
        if (modalType === "success") {
            limpiarFormulario()
            router.push("/(tabs)/Clientes")
        }
    }

    const formatearMonto = (valor) => {
        const numero = valor.replace(/[^0-9.]/g, "")
        if (numero) {
            const formatted = numeral(parseFloat(numero)).format("0,0.00")
            return formatted
        }
        return numero
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
                <Pressable onPress={() => router.push("/(tabs)/Clientes")} className="mr-4">
                    <Feather name="arrow-left" size={24} color="white" />
                </Pressable>
                <Text className="flex-1 text-white text-lg font-semibold">Registro de Pago</Text>
            </View>

            {/* Content */}
            <ScrollView className="bg-white flex-1 rounded-t-3xl">
                {/* Header de información */}
                <View className="p-6 border-b border-gray-200">
                    <Text className="text-2xl font-bold text-gray-800 mb-2">Nuevo Movimiento</Text>
                    <Text className="text-base text-gray-600">
                        {vieneDeDetalle
                            ? `Registrando para crédito ${credito}, ciclo ${ciclo}`
                            : "Complete todos los campos para registrar el pago"}
                    </Text>
                </View>
                {/* Formulario */}
                <View className="p-6 space-y-6">
                    <View className="flex-row justify-between space-x-3">
                        <View className="flex-1 mr-2">
                            <Text className="text-gray-700 mb-2">Número de Crédito</Text>
                            <View
                                className={`border rounded-xl p-4 ${
                                    vieneDeDetalle ? "bg-gray-100" : "bg-white border-gray-300"
                                }`}
                            >
                                <TextInput
                                    value={credito}
                                    onChangeText={setCredito}
                                    placeholder="123456"
                                    editable={!vieneDeDetalle}
                                    className="text-base text-gray-800"
                                    keyboardType="numeric"
                                    maxLength={6}
                                />
                            </View>
                        </View>

                        <View className="w-20 ml-2">
                            <Text className="text-gray-700 mb-2">Ciclo</Text>
                            <View
                                className={`border rounded-xl p-4 ${
                                    vieneDeDetalle ? "bg-gray-100" : "bg-white border-gray-300"
                                }`}
                            >
                                <TextInput
                                    value={ciclo}
                                    onChangeText={setCiclo}
                                    placeholder="12"
                                    editable={!vieneDeDetalle}
                                    className="text-base text-gray-800 text-center"
                                    keyboardType="numeric"
                                    maxLength={2}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Selector Tipo de Pago */}
                    <View>
                        <Text className="text-sm font-semibold text-gray-700 mb-2">
                            Tipo de Pago
                        </Text>
                        <Pressable
                            onPress={() => setShowTipoSelect(!showTipoSelect)}
                            className="border border-gray-300 rounded-xl p-4 bg-white flex-row justify-between items-center"
                        >
                            <Text
                                className={`text-base ${
                                    tipoPago ? "text-gray-800" : "text-gray-400"
                                }`}
                            >
                                {tipoPago
                                    ? tiposPago.find((t) => t.value === tipoPago)?.label
                                    : "Seleccione tipo de pago"}
                            </Text>
                            <Feather
                                name={showTipoSelect ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="#6B7280"
                            />
                        </Pressable>

                        {/* Dropdown de opciones */}
                        {showTipoSelect && (
                            <View className="mt-1 border border-gray-200 rounded-xl bg-white shadow-sm">
                                {tiposPago.map((tipo) => (
                                    <Pressable
                                        key={tipo.value}
                                        onPress={() => {
                                            setTipoPago(tipo.value)
                                            setShowTipoSelect(false)
                                        }}
                                        className="p-4 border-b border-gray-100 last:border-b-0"
                                    >
                                        <Text className="text-base text-gray-800">
                                            {tipo.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Campo Monto */}
                    <View>
                        <Text className="text-sm font-semibold text-gray-700 mb-2">Monto</Text>
                        <View className="border border-gray-300 rounded-xl p-4 bg-white">
                            <TextInput
                                value={monto}
                                onChangeText={(text) => {
                                    const cleaned = text.replace(/[^0-9.]/g, "")
                                    setMonto(cleaned)
                                }}
                                placeholder="0.00"
                                className="text-base text-gray-800"
                                keyboardType="decimal-pad"
                            />
                        </View>
                    </View>
                </View>
                {/* Botones de acción */}
                <View className="p-6 space-y-3">
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Pressable
                            onPress={procesarPago}
                            className="bg-green-500 flex-row rounded-full h-12 w-80 self-center justify-center items-center mb-5"
                        >
                            <MaterialIcons name="save" size={24} color="white" />
                            <Text className="text-white font-bold text-lg ml-2">
                                Registrar Pago
                            </Text>
                        </Pressable>
                    </Animated.View>
                    dav{" "}
                </View>
                a
                <Pressable
                    onPress={limpiarFormulario}
                    className="bg-gray-100 flex-row rounded-full h-12 w-80 self-center justify-center items-center mb-5"
                >
                    <MaterialIcons name="refresh" size={24} color="#6B7280" />
                    <Text className="text-gray-600 font-semibold text-base ml-2">
                        Limpiar Formulario
                    </Text>
                </Pressable>
            </ScrollView>

            {/* Modal de confirmación/error */}
            <Modal
                transparent
                visible={modalVisible}
                animationType="fade"
                onRequestClose={cerrarModal}
            >
                <View className="flex-1 bg-black/50 justify-center items-center p-6">
                    <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
                        <View className="items-center mb-4">
                            <View
                                className={`w-16 h-16 rounded-full items-center justify-center mb-3 ${
                                    modalType === "success" ? "bg-green-100" : "bg-red-100"
                                }`}
                            >
                                <MaterialIcons
                                    name={modalType === "success" ? "check-circle" : "error"}
                                    size={32}
                                    color={modalType === "success" ? "#16a34a" : "#dc2626"}
                                />
                            </View>
                            <Text
                                className={`text-lg font-bold text-center ${
                                    modalType === "success" ? "text-green-700" : "text-red-700"
                                }`}
                            >
                                {modalType === "success" ? "¡Éxito!" : "Error"}
                            </Text>
                        </View>

                        <Text className="text-gray-700 text-center mb-6">{modalMessage}</Text>

                        <Pressable
                            onPress={cerrarModal}
                            className={`p-3 rounded-xl ${
                                modalType === "success" ? "bg-green-500" : "bg-red-500"
                            }`}
                        >
                            <Text className="text-white text-center font-semibold">OK</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
