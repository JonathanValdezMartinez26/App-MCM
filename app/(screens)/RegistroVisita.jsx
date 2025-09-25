import { useContext, useState, useEffect } from "react"
import { View, Text, TextInput, Pressable, ScrollView, Image, Platform } from "react-native"
import { Feather, MaterialIcons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import { useCustomAlert } from "../../hooks/useCustomAlert"
import { obtenerMotivosVisita, registrarVisita } from "../../services"
import CustomAlert from "../../components/CustomAlert"
import * as ImagePicker from "expo-image-picker"
import * as Location from "expo-location"
import numeral from "numeral"

export default function RegistroVisita() {
    const params = useLocalSearchParams()
    const insets = useContext(SafeAreaInsetsContext)
    const { alertRef, showError, showSuccess, showInfo, showWarning, showWait, hideWait } =
        useCustomAlert()

    // Estado para controlar si los parámetros son válidos
    const [parametrosValidos, setParametrosValidos] = useState(false)

    // Estados para los campos del formulario
    const [credito, setCredito] = useState("")
    const [ciclo, setCiclo] = useState("")
    const [nombre, setNombre] = useState("")
    const [motivo, setMotivo] = useState("")
    const [fotoComprobante, setFotoComprobante] = useState(null)
    const [comentarios, setComentarios] = useState("")

    // Estados para motivos de visita y la interfaz
    const [motivosVisita, setMotivosVisita] = useState([])
    const [showMotivoSelect, setShowMotivoSelect] = useState(false)
    const [focusedField, setFocusedField] = useState("")

    // Efecto para cargar datos desde los parámetros
    useEffect(() => {
        if (params.credito && params.ciclo && params.timestamp) {
            setParametrosValidos(true)
            setCredito(params.credito)
            setCiclo(params.ciclo)
            setNombre(params.nombre || "")
        } else {
            showError("Error", "Faltan datos para registrar la visita.", [
                { text: "OK", onPress: () => router.back() }
            ])
        }
    }, [params])

    // Cargar motivos de visita desde catálogos
    useEffect(() => {
        const cargarMotivosVisita = async () => {
            try {
                const motivosData = await obtenerMotivosVisita()
                setMotivosVisita(motivosData)
            } catch (error) {
                console.error("Error al cargar motivos de visita:", error)
                showError("Error", "No se pudieron cargar los motivos de visita", [
                    { text: "OK", style: "default" }
                ])
            }
        }

        cargarMotivosVisita()
    }, [])

    const limpiarFormulario = () => {
        setMotivo("")
        setComentarios("")
        setFotoComprobante(null)
        setFocusedField("")
    }

    const validarDatos = () => {
        if (!credito.trim()) {
            showError("Error", "El número de crédito es requerido", [
                { text: "OK", style: "default" }
            ])
            return false
        }

        if (!ciclo.trim()) {
            showError("Error", "El ciclo es requerido", [{ text: "OK", style: "default" }])
            return false
        }

        if (!motivo) {
            showError("Error", "Debe seleccionar un motivo de visita", [
                { text: "OK", style: "default" }
            ])
            return false
        }

        if (!fotoComprobante) {
            showError("Error", "Debe capturar una foto como comprobante", [
                { text: "OK", style: "default" }
            ])
            return false
        }

        return true
    }

    const procesarVisita = async () => {
        if (!validarDatos()) return

        const motivoSeleccionado = motivosVisita.find((m) => m.idmotivo === motivo)
        const confirmacionMensaje = `¿Confirma que desea registrar una visita por motivo: "${motivoSeleccionado?.descripcion}" para el crédito ${credito}?`

        // Mostrar confirmación antes de procesar
        showInfo("Confirmar Registro", confirmacionMensaje, [
            {
                text: "Cancelar",
                style: "cancel"
            },
            {
                text: "Confirmar",
                style: "default",
                onPress: async () => {
                    try {
                        showWait("Registrando Visita", "Procesando la información...")

                        // Obtener ubicación GPS
                        const ubicacion = await obtenerUbicacion()

                        // Convertir imagen a base64
                        const fotoBase64 = await convertirImagenABase64(fotoComprobante.uri)

                        // Preparar datos para envío
                        const datosVisita = {
                            fecha: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
                            cdgns: credito,
                            ciclo: ciclo,
                            idmotivo: motivo,
                            detalle: comentarios || "",
                            latitud: ubicacion?.latitude || 0,
                            longitud: ubicacion?.longitude || 0,
                            foto: fotoBase64
                        }

                        // Enviar al servidor
                        const resultado = await registrarVisita(datosVisita)

                        hideWait()

                        if (resultado.success) {
                            showSuccess(
                                "Éxito",
                                resultado.mensaje || "Visita registrada correctamente",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => {
                                            router.back()
                                        }
                                    }
                                ]
                            )
                        } else {
                            showError(
                                "Error",
                                resultado.error || "No se pudo registrar la visita",
                                [{ text: "OK", style: "default" }]
                            )
                        }
                    } catch (error) {
                        hideWait()
                        console.error("Error al procesar visita:", error)
                        showError("Error", "Ocurrió un error inesperado al registrar la visita", [
                            { text: "OK", style: "default" }
                        ])
                    }
                }
            }
        ])
    }

    const capturarFoto = async () => {
        try {
            const permisosCamara = await ImagePicker.requestCameraPermissionsAsync()
            if (permisosCamara.status !== "granted") {
                showError("Permisos", "Se necesitan permisos de cámara para capturar la foto", [
                    { text: "OK", style: "default" }
                ])
                return
            }

            const resultado = await ImagePicker.launchCameraAsync({
                mediaTypes: ["images"]
            })

            if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
                setFotoComprobante(resultado.assets[0])
            }
        } catch (error) {
            console.error("Error al capturar foto:", error)
            showError("Error", "No se pudo capturar la foto", [{ text: "OK", style: "default" }])
        }
    }

    const obtenerUbicacion = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") {
                console.warn("Permisos de ubicación no concedidos")
                return null
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
                timeout: 10000
            })

            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }
        } catch (error) {
            console.error("Error al obtener ubicación:", error)
            return null
        }
    }

    const convertirImagenABase64 = async (uri) => {
        try {
            const response = await fetch(uri)
            const blob = await response.blob()
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => {
                    const base64 = reader.result.split(",")[1] // Remover el prefijo data:image...
                    resolve(base64)
                }
                reader.onerror = reject
                reader.readAsDataURL(blob)
            })
        } catch (error) {
            console.error("Error al convertir imagen:", error)
            return ""
        }
    }

    if (!parametrosValidos) {
        return (
            <View className="flex-1 bg-primary justify-center items-center">
                <Text className="text-white text-lg">Validando datos...</Text>
            </View>
        )
    }

    return (
        <View
            className="flex-1 bg-primary"
            style={{
                paddingTop: insets.top
            }}
        >
            <View className="flex-row items-center p-4">
                <Pressable onPress={() => router.back()} className="mr-3">
                    <Feather name="arrow-left" size={24} color="white" />
                </Pressable>
                <Text className="flex-1 text-white text-lg font-semibold">Registro de Visita</Text>
            </View>
            <View className="bg-white flex-1 rounded-t-3xl">
                <View className="px-6 py-5 border-b border-gray-200">
                    <View className="flex-row items-center">
                        <View className="bg-red-100 p-3 rounded-full mr-4">
                            <MaterialIcons name="location-on" size={24} color="#ef4444" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-gray-800">
                                Registro de Visita sin Pago
                            </Text>
                            <Text className="text-base text-gray-600">
                                Complete la información de la visita
                            </Text>
                        </View>
                    </View>
                </View>
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="p-6">
                        {/* Información del cliente */}
                        <View className="mb-6 bg-gray-50 rounded-xl p-4">
                            <Text className="text-lg font-semibold text-gray-800 mb-2">
                                Cliente
                            </Text>
                            <Text className="text-base text-gray-700 font-medium">{nombre}</Text>
                            <Text className="text-sm text-gray-600">
                                Crédito {credito} • Ciclo {ciclo}
                            </Text>
                        </View>

                        {/* Motivo de visita */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Motivo del impago
                            </Text>
                            <Pressable
                                onPress={() => setShowMotivoSelect(!showMotivoSelect)}
                                className={`border-2 rounded-2xl p-4 flex-row justify-between items-center ${
                                    focusedField === "motivo"
                                        ? "border-red-400 bg-red-50"
                                        : "border-gray-300 bg-white"
                                }`}
                            >
                                <View className="flex-row items-center flex-1">
                                    {motivo ? (
                                        <>
                                            <MaterialIcons
                                                name="check"
                                                size={20}
                                                color="#ef4444"
                                                className="mr-2"
                                            />
                                            <Text className="text-base font-medium text-gray-800">
                                                {motivosVisita.find((m) => m.idmotivo === motivo)
                                                    ?.descripcion || motivo}
                                            </Text>
                                        </>
                                    ) : (
                                        <Text className="text-base text-gray-400">
                                            Seleccione el motivo de la visita
                                        </Text>
                                    )}
                                </View>
                                <MaterialIcons
                                    name={
                                        showMotivoSelect
                                            ? "keyboard-arrow-up"
                                            : "keyboard-arrow-down"
                                    }
                                    size={24}
                                    color="#6B7280"
                                />
                            </Pressable>
                            {showMotivoSelect && (
                                <View className="mt-2 border-2 border-gray-200 rounded-2xl bg-white shadow-sm">
                                    {motivosVisita.map((motivoItem, index) => (
                                        <Pressable
                                            key={motivoItem.idmotivo}
                                            onPress={() => {
                                                setMotivo(motivoItem.idmotivo)
                                                setShowMotivoSelect(false)
                                                setFocusedField("")
                                            }}
                                            className={`p-4 flex-row items-center justify-between ${
                                                index < motivosVisita.length - 1
                                                    ? "border-b border-gray-100"
                                                    : ""
                                            }`}
                                        >
                                            <Text className="text-base font-medium text-gray-800 flex-1">
                                                {motivoItem.descripcion}
                                            </Text>
                                            {motivo === motivoItem.idmotivo && (
                                                <MaterialIcons
                                                    name="check"
                                                    size={20}
                                                    color="#ef4444"
                                                />
                                            )}
                                        </Pressable>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Foto comprobante */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Comprobante Fotográfico
                            </Text>
                            <Pressable
                                onPress={capturarFoto}
                                className={`border-2 rounded-2xl p-6 items-center justify-center ${
                                    fotoComprobante
                                        ? "border-green-400 bg-green-50"
                                        : "border-gray-300 bg-white"
                                } h-32`}
                            >
                                {fotoComprobante ? (
                                    <View className="items-center">
                                        <MaterialIcons
                                            name="check-circle"
                                            size={40}
                                            color="#16a34a"
                                        />
                                        <Text className="text-green-700 font-medium mt-2">
                                            Foto capturada
                                        </Text>
                                        <Text className="text-green-600 text-sm">
                                            Toque para cambiar
                                        </Text>
                                    </View>
                                ) : (
                                    <View className="items-center">
                                        <Feather name="camera" size={40} color="#6B7280" />
                                        <Text className="text-gray-600 font-medium mt-2">
                                            Capturar foto
                                        </Text>
                                    </View>
                                )}
                            </Pressable>
                        </View>

                        {/* Campo de comentarios */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Comentarios
                            </Text>
                            <TextInput
                                value={comentarios}
                                onChangeText={setComentarios}
                                className={`border-2 rounded-2xl p-4 h-36 ${
                                    focusedField === "comentarios"
                                        ? "border-red-400 bg-red-50"
                                        : "border-gray-300 bg-white"
                                }`}
                                multiline
                                numberOfLines={4}
                                placeholder="Ingrese detalles adicionales sobre la visita..."
                                onFocus={() => setFocusedField("comentarios")}
                                onBlur={() => setFocusedField("")}
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Vista previa de la foto */}
                        {fotoComprobante && (
                            <View className="mb-6">
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Vista Previa
                                </Text>
                                <View className="border-2 border-red-200 rounded-2xl p-4 bg-red-50">
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
                                                color="#ef4444"
                                            />
                                            <Text className="text-red-700 font-medium ml-2">
                                                Comprobante capturado
                                            </Text>
                                        </View>
                                        <Pressable
                                            onPress={capturarFoto}
                                            className="bg-red-500 px-3 py-1 rounded-lg"
                                        >
                                            <Text className="text-white text-sm">Cambiar</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>
                <View className="flex-row px-6 pt-2 border-t border-gray-200 justify-between">
                    <View className="mb-4">
                        <Pressable
                            onPress={limpiarFormulario}
                            className="bg-gray-100 rounded-2xl p-4"
                        >
                            <View className="flex-row items-center justify-center">
                                <MaterialIcons name="refresh" size={20} color="#6B7280" />
                                <Text className="text-gray-600 font-semibold ml-2">Limpiar</Text>
                            </View>
                        </Pressable>
                    </View>

                    <View className="mb-4">
                        <Pressable
                            onPress={procesarVisita}
                            className="bg-red-500 rounded-2xl p-4 shadow-lg"
                        >
                            <View className="flex-row items-center justify-center">
                                <MaterialIcons name="save" size={20} color="white" />
                                <Text className="text-white font-semibold ml-2">
                                    Registrar Visita
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                </View>
            </View>
            <CustomAlert ref={alertRef} />
        </View>
    )
}
