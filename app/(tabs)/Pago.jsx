import { useContext, useState, useEffect } from "react"
import { View, Text, TextInput, Pressable, ScrollView, Animated, Image } from "react-native"
import { useLocalSearchParams, router } from "expo-router"
import { Feather, MaterialIcons } from "@expo/vector-icons"
import { COLORS } from "../../constants"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import numeral from "numeral"
import { useCustomAlert } from "../../hooks/useCustomAlert"
import { useCartera } from "../../context/CarteraContext"
import { pagosPendientes, catalogos } from "../../services"
import CustomAlert from "../../components/CustomAlert"
import * as ImagePicker from "expo-image-picker"

export default function Pago() {
    const params = useLocalSearchParams()
    const { noCreditoDetalle, cicloDetalle, pagoSemanalDetalle, timestamp } = params
    const insets = useContext(SafeAreaInsetsContext)
    const { alertRef, showError, showSuccess, showInfo } = useCustomAlert()
    const { validarCredito, obtenerInfoCredito } = useCartera()

    // Estado para controlar si los parámetros son válidos (vienen con timestamp reciente)
    const [parametrosValidos, setParametrosValidos] = useState(false)

    // Estados para los campos del formulario
    const [credito, setCredito] = useState("")
    const [ciclo, setCiclo] = useState("")
    const [monto, setMonto] = useState("")
    const [tipoPago, setTipoPago] = useState("")
    const [fotoComprobante, setFotoComprobante] = useState(null)

    // Estados para validación de crédito
    const [creditoValido, setCreditoValido] = useState(null)
    const [infoCredito, setInfoCredito] = useState(null)

    // Estados para tipos de pago y la interfaz
    const [tiposPago, setTiposPago] = useState([])
    const [showTipoSelect, setShowTipoSelect] = useState(false)
    const [montoFormateado, setMontoFormateado] = useState("")
    const [focusedField, setFocusedField] = useState("")

    const scaleAnim = useState(new Animated.Value(1))[0]
    const shakeAnim = useState(new Animated.Value(0))[0]

    const vieneDeDetalle = parametrosValidos && Boolean(noCreditoDetalle && cicloDetalle)

    // Efecto para validar parámetros al cargar el componente
    useEffect(() => {
        if (timestamp && noCreditoDetalle && cicloDetalle) {
            const timestampRecibido = parseInt(timestamp)
            const tiempoActual = Date.now()
            const diferenciaTiempo = tiempoActual - timestampRecibido

            // Solo considerar válidos los parámetros si tienen menos de 5 minutos de antigüedad
            if (diferenciaTiempo < 5 * 60 * 1000) {
                // 5 minutos en millisegundos
                setParametrosValidos(true)
                setCredito(noCreditoDetalle)
                setCiclo(cicloDetalle)
                setMonto(pagoSemanalDetalle || "")
                setTipoPago(pagoSemanalDetalle ? "P" : "") // P es el código por defecto para PAGO
            } else {
                // Parámetros antiguos, limpiar la navegación
                setParametrosValidos(false)
                router.replace("/(tabs)/Pago")
            }
        } else {
            // No hay parámetros o están incompletos
            setParametrosValidos(false)
        }
    }, [timestamp, noCreditoDetalle, cicloDetalle, pagoSemanalDetalle])

    // Efecto para validar el número de crédito cuando cambia
    useEffect(() => {
        if (credito.length === 6) {
            const resultado = validarCredito(credito)
            setCreditoValido(resultado.valido)

            if (resultado.valido) {
                setInfoCredito(resultado.cliente)
                // Auto-llenar el ciclo si el crédito es válido y no viene de DetalleCredito
                if (!vieneDeDetalle && resultado.cliente.ciclo) {
                    setCiclo(resultado.cliente.ciclo.toString())
                }
            } else {
                setInfoCredito(null)
                // Mostrar error si el crédito no es válido
                showError("Crédito no válido", resultado.mensaje, [
                    { text: "OK", style: "default" }
                ])
            }
        } else if (credito.length > 0) {
            setCreditoValido(null)
            setInfoCredito(null)
        }
    }, [credito, validarCredito, vieneDeDetalle])

    // Cargar tipos de pago desde catálogos
    useEffect(() => {
        const cargarTiposPago = async () => {
            try {
                const tipos = await catalogos.getTiposPagoLocal()
                setTiposPago(tipos)
            } catch (error) {
                console.error("Error al cargar tipos de pago:", error)
                // Fallback a tipos por defecto
                setTiposPago([
                    { codigo: "P", descripcion: "PAGO" },
                    { codigo: "M", descripcion: "MULTA" }
                ])
            }
        }

        cargarTiposPago()
    }, [])

    useEffect(() => {
        if (monto) {
            const numero = parseFloat(monto.replace(/[^0-9.]/g, ""))
            if (!isNaN(numero)) {
                setMontoFormateado(numeral(numero).format("$0,0.00"))
            } else {
                setMontoFormateado("")
            }
        } else {
            setMontoFormateado("")
        }
    }, [monto])

    const animarError = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true })
        ]).start()
    }

    const limpiarFormulario = () => {
        // Siempre limpiar todos los campos
        setCredito("")
        setCiclo("")
        setMonto("")
        setTipoPago("")
        setFotoComprobante(null)
        setMontoFormateado("")
        setFocusedField("")
        setParametrosValidos(false)
        setCreditoValido(null)
        setInfoCredito(null)
    }

    const validarDatos = () => {
        if (!credito.trim()) {
            showError("Error", "El número de crédito es requerido", [
                { text: "OK", style: "default" }
            ])
            animarError()
            return false
        }

        if (credito.length !== 6) {
            showError("Error", "El número de crédito debe tener 6 dígitos", [
                { text: "OK", style: "default" }
            ])
            animarError()
            return false
        }

        if (creditoValido !== true) {
            showError(
                "Error",
                "El número de crédito no es válido o no se encuentra en su cartera",
                [{ text: "OK", style: "default" }]
            )
            animarError()
            return false
        }

        if (!ciclo.trim()) {
            showError("Error", "El ciclo es requerido", [{ text: "OK", style: "default" }])
            animarError()
            return false
        }
        if (!tipoPago) {
            showError("Error", "Debe seleccionar un tipo de pago", [
                { text: "OK", style: "default" }
            ])
            animarError()
            return false
        }
        if (!monto.trim() || isNaN(parseFloat(monto)) || parseFloat(monto) <= 0) {
            showError("Error", "El monto debe ser un número válido mayor a 0", [
                { text: "OK", style: "default" }
            ])
            animarError()
            return false
        }

        if (!fotoComprobante) {
            showError("Error", "Debe capturar una foto del comprobante firmado", [
                { text: "OK", style: "default" }
            ])
            animarError()
            return false
        }

        return true
    }

    const procesarPago = async () => {
        if (!validarDatos()) return

        // Animación de feedback visual
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
        ]).start()

        const tipoSeleccionado = tiposPago.find((t) => t.codigo === tipoPago)
        const confirmacionMensaje = `¿Confirma que desea registrar un ${tipoSeleccionado?.descripcion.toLowerCase()} de ${montoFormateado} para el crédito ${credito}?`

        // Mostrar confirmación antes de procesar
        showInfo("Confirmar Registro", confirmacionMensaje, [
            {
                text: "Cancelar",
                style: "cancel",
                onPress: () => {
                    // No hacer nada, solo cerrar el modal
                }
            },
            {
                text: "Confirmar",
                style: "default",
                onPress: async () => {
                    try {
                        // Guardar el pago en storage como pendiente
                        const pagoData = {
                            credito,
                            ciclo,
                            monto,
                            tipoPago: tipoPago, // código del tipo
                            tipoEtiqueta: tipoSeleccionado?.descripcion || tipoPago, // etiqueta para mostrar
                            nombreCliente: infoCredito?.nombre || params.nombre || "",
                            fotoComprobante: fotoComprobante?.uri || null
                        }

                        const resultado = await pagosPendientes.guardar(pagoData)

                        if (resultado.success) {
                            const mensaje = `${tipoSeleccionado?.descripcion} de ${montoFormateado} guardado como pendiente para el crédito ${credito}`

                            showSuccess("¡Pago Guardado!", mensaje, [
                                {
                                    text: "OK",
                                    style: "default",
                                    onPress: () => {
                                        limpiarFormulario()
                                        router.replace("/(tabs)/Cartera")
                                    }
                                }
                            ])
                        } else {
                            showError("Error", "No se pudo guardar el pago. Inténtelo de nuevo.", [
                                { text: "OK", style: "default" }
                            ])
                        }
                    } catch (error) {
                        console.error("Error al procesar pago:", error)
                        showError("Error", "Ocurrió un error inesperado al guardar el pago.", [
                            { text: "OK", style: "default" }
                        ])
                    }
                }
            }
        ])
    }

    const formatearMonto = (valor) => {
        const numero = valor.replace(/[^0-9.]/g, "")
        return numero
    }

    const capturarFoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync()

            if (status !== "granted") {
                showError(
                    "Permisos Requeridos",
                    "Se necesitan permisos de cámara para capturar el comprobante",
                    [{ text: "OK", style: "default" }]
                )
                return
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ["images"]
            })

            if (!result.canceled) {
                setFotoComprobante(result.assets[0])
                showSuccess("¡Foto Capturada!", "El comprobante ha sido capturado correctamente", [
                    { text: "OK", style: "default" }
                ])
            }
        } catch (error) {
            console.error("Error al capturar foto:", error)
            showError("Error", "No se pudo capturar la foto. Inténtelo de nuevo.", [
                { text: "OK", style: "default" }
            ])
        }
    }

    return (
        <View
            className="flex-1"
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                backgroundColor: COLORS.primary
            }}
        >
            {/* Header */}
            <View className="flex-row items-center p-4">
                <Text className="flex-1 text-white text-lg font-semibold">Registro de Pago</Text>
            </View>

            {/* Content */}
            <View className="bg-white flex-1 rounded-t-3xl">
                {/* Header de información mejorado */}
                <View className="px-6 py-5 border-b border-gray-200">
                    <View className="flex-row items-center">
                        <View className="bg-green-100 p-3 rounded-full mr-4">
                            <MaterialIcons name="payment" size={24} color="#16a34a" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-gray-800">Nuevo Pago</Text>
                            <Text className="text-base text-gray-600">
                                {vieneDeDetalle
                                    ? "Confirme los datos del pago"
                                    : "Complete la información del pago"}
                            </Text>
                        </View>
                    </View>
                </View>
                {/* Formulario moderno */}
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <Animated.View
                        className="p-6"
                        style={{ transform: [{ translateX: shakeAnim }] }}
                    >
                        {/* Información del crédito */}
                        <View className="mb-6">
                            <View className="flex-row">
                                <View className="flex-1 mr-3">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">
                                        Número de Crédito
                                    </Text>
                                    <View
                                        className={`border-2 rounded-2xl p-4 ${
                                            vieneDeDetalle
                                                ? "bg-gray-50 border-gray-200"
                                                : creditoValido === true
                                                ? "border-green-400 bg-green-50"
                                                : creditoValido === false
                                                ? "border-red-400 bg-red-50"
                                                : focusedField === "credito"
                                                ? "border-blue-400 bg-blue-50"
                                                : "border-gray-300 bg-white"
                                        }`}
                                    >
                                        <View className="flex-row items-center">
                                            <TextInput
                                                value={credito}
                                                onChangeText={setCredito}
                                                placeholder="Ej: 123456"
                                                editable={!vieneDeDetalle}
                                                onFocus={() => setFocusedField("credito")}
                                                onBlur={() => setFocusedField("")}
                                                className="flex-1 text-2xl font-bold text-gray-800"
                                                keyboardType="numeric"
                                                maxLength={6}
                                            />
                                            {credito.length === 6 && creditoValido !== null && (
                                                <MaterialIcons
                                                    name={creditoValido ? "check-circle" : "error"}
                                                    size={20}
                                                    color={creditoValido ? "#16a34a" : "#ef4444"}
                                                />
                                            )}
                                        </View>
                                    </View>
                                </View>

                                <View className="w-24">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">
                                        Ciclo
                                    </Text>
                                    <View
                                        className={`border-2 rounded-2xl p-4 ${
                                            vieneDeDetalle
                                                ? "bg-gray-50 border-gray-200"
                                                : focusedField === "ciclo"
                                                ? "border-blue-400 bg-blue-50"
                                                : "border-gray-300 bg-white"
                                        }`}
                                    >
                                        <TextInput
                                            value={ciclo}
                                            onChangeText={setCiclo}
                                            editable={false}
                                            className="flex-1 text-2xl font-bold text-gray-800"
                                            keyboardType="numeric"
                                            maxLength={2}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Mostrar información del cliente si el crédito es válido */}
                            {creditoValido && infoCredito && (
                                <View className="mt-2 p-3 bg-green-50 rounded-xl border border-green-200">
                                    <Text className="text-sm font-medium text-green-800">
                                        ✓ {infoCredito.nombre}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Selector de tipo de pago como dropdown */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Tipo de Movimiento
                            </Text>

                            <Pressable
                                onPress={() => setShowTipoSelect(!showTipoSelect)}
                                className={`border-2 rounded-2xl p-4 flex-row justify-between items-center ${
                                    focusedField === "tipo"
                                        ? "border-blue-400 bg-blue-50"
                                        : "border-gray-300 bg-white"
                                }`}
                            >
                                <View className="flex-row items-center flex-1">
                                    {tipoPago ? (
                                        <>
                                            <MaterialIcons
                                                name="check"
                                                size={20}
                                                color="#16a34a"
                                                style={{ marginRight: 8 }}
                                            />
                                            <Text className="text-base font-medium text-gray-800">
                                                {tiposPago.find((t) => t.codigo === tipoPago)
                                                    ?.descripcion || tipoPago}
                                            </Text>
                                        </>
                                    ) : (
                                        <Text className="text-base text-gray-400">
                                            Seleccione el tipo de movimiento
                                        </Text>
                                    )}
                                </View>
                                <MaterialIcons
                                    name={
                                        showTipoSelect ? "keyboard-arrow-up" : "keyboard-arrow-down"
                                    }
                                    size={24}
                                    color="#6B7280"
                                />
                            </Pressable>

                            {/* Dropdown de opciones */}
                            {showTipoSelect && (
                                <View className="mt-2 border-2 border-gray-200 rounded-2xl bg-white shadow-sm">
                                    {tiposPago.map((tipo, index) => (
                                        <Pressable
                                            key={tipo.codigo}
                                            onPress={() => {
                                                setTipoPago(tipo.codigo)
                                                setShowTipoSelect(false)
                                                setFocusedField("")
                                            }}
                                            className={`p-4 flex-row items-center justify-between ${
                                                index < tiposPago.length - 1
                                                    ? "border-b border-gray-100"
                                                    : ""
                                            }`}
                                        >
                                            <Text className="text-base font-medium text-gray-800 flex-1">
                                                {tipo.descripcion}
                                            </Text>
                                            {tipoPago === tipo.codigo && (
                                                <MaterialIcons
                                                    name="check"
                                                    size={20}
                                                    color="#16a34a"
                                                />
                                            )}
                                        </Pressable>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View className="mb-6 flex-row">
                            <View className="flex-1 mr-3">
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Monto del Pago
                                </Text>

                                <View
                                    className={`border-2 rounded-2xl p-6 ${
                                        focusedField === "monto"
                                            ? "border-green-400 bg-green-50"
                                            : "border-gray-300 bg-white"
                                    }`}
                                >
                                    <View className="flex-row items-center">
                                        <Text className="text-2xl font-bold text-gray-600 mr-2">
                                            $
                                        </Text>
                                        <TextInput
                                            value={monto}
                                            onChangeText={(text) => {
                                                const cleaned = formatearMonto(text)
                                                setMonto(cleaned)
                                            }}
                                            placeholder="0.00"
                                            onFocus={() => setFocusedField("monto")}
                                            onBlur={() => setFocusedField("")}
                                            className="flex-1 text-2xl font-bold text-gray-800"
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row justify-center items-end">
                                <View className="items-center">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">
                                        Comprobante
                                    </Text>
                                    <Pressable
                                        onPress={capturarFoto}
                                        className={`rounded-2xl w-24 h-[95] justify-center items-center ${
                                            fotoComprobante ? "bg-green-500" : "bg-blue-500"
                                        }`}
                                    >
                                        {fotoComprobante ? (
                                            <View className="items-center">
                                                <MaterialIcons
                                                    name="check-circle"
                                                    size={30}
                                                    color="white"
                                                />
                                                <Text className="text-white text-xs mt-1 text-center">
                                                    Capturado
                                                </Text>
                                            </View>
                                        ) : (
                                            <View className="items-center">
                                                <Feather name="camera" size={30} color="white" />
                                            </View>
                                        )}
                                    </Pressable>
                                </View>
                            </View>
                        </View>

                        {/* Vista previa de la foto del comprobante */}
                        {fotoComprobante && (
                            <View>
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Vista Previa de la Tarjeta de Pagos
                                </Text>
                                <View className="border-2 border-green-200 rounded-2xl p-4 bg-green-50">
                                    <Image
                                        source={{ uri: fotoComprobante.uri }}
                                        className="w-full h-48 rounded-xl"
                                        resizeMode="cover"
                                    />
                                    <View className="mt-3 flex-row items-center justify-between">
                                        <View className="flex-row items-center">
                                            <MaterialIcons
                                                name="verified"
                                                size={20}
                                                color="#16a34a"
                                            />
                                            <Text className="text-green-700 font-medium ml-2">
                                                Comprobante capturado
                                            </Text>
                                        </View>
                                        <Pressable
                                            onPress={capturarFoto}
                                            className="bg-blue-500 px-3 py-1 rounded-lg"
                                        >
                                            <Text className="text-white text-sm">Cambiar</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        )}
                    </Animated.View>
                </ScrollView>

                {/* Botones de acción modernos */}
                <View
                    className={`flex-row px-6 pb-8 pt-2 border-t border-gray-200 ${
                        vieneDeDetalle ? "justify-between" : "justify-between"
                    }`}
                >
                    {vieneDeDetalle ? (
                        <View className="mb-4">
                            <Pressable
                                onPress={() => {
                                    limpiarFormulario()
                                    router.push({
                                        pathname: "/DetalleCredito",
                                        params: {
                                            noCredito: noCreditoDetalle,
                                            ciclo: cicloDetalle,
                                            nombre: params.nombre || infoCredito?.nombre || ""
                                        }
                                    })
                                }}
                                className="bg-red-600 rounded-2xl p-4"
                            >
                                <View className="flex-row items-center justify-center">
                                    <MaterialIcons name="close" size={20} color="#fff" />
                                    <Text className="text-white font-semibold ml-2">Cancelar</Text>
                                </View>
                            </Pressable>
                        </View>
                    ) : (
                        <View className="mb-4">
                            <Pressable
                                onPress={limpiarFormulario}
                                className="bg-gray-100 rounded-2xl p-4"
                            >
                                <View className="flex-row items-center justify-center">
                                    <MaterialIcons name="refresh" size={20} color="#6B7280" />
                                    <Text className="text-gray-600 font-semibold ml-2">
                                        Limpiar
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                    )}

                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }} className="mb-4">
                        <Pressable
                            onPress={procesarPago}
                            className="bg-green-500 rounded-2xl p-4 shadow-lg"
                        >
                            <View className="flex-row items-center justify-center">
                                <MaterialIcons name="save" size={20} color="white" />
                                <Text className="text-white font-semibold ml-2">
                                    Registrar Pago
                                </Text>
                            </View>
                        </Pressable>
                    </Animated.View>
                </View>
            </View>

            <CustomAlert ref={alertRef} />
        </View>
    )
}
