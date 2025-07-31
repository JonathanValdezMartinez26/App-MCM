import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { View, Text, Modal, Pressable, Animated } from "react-native"
import { Feather } from "@expo/vector-icons"
import { COLORS } from "../constants"

const messageTypes = {
    success: {
        icon: "check-circle",
        color: "#10B981", // green-500
        backgroundColor: "#ECFDF5", // green-50
        borderColor: "#A7F3D0" // green-200
    },
    error: {
        icon: "x-circle",
        color: "#EF4444", // red-500
        backgroundColor: "#FEF2F2", // red-50
        borderColor: "#FECACA" // red-200
    },
    warning: {
        icon: "alert-triangle",
        color: "#F59E0B", // yellow-500
        backgroundColor: "#FFFBEB", // yellow-50
        borderColor: "#FED7AA" // yellow-200
    },
    info: {
        icon: "info",
        color: "#3B82F6", // blue-500
        backgroundColor: "#EFF6FF", // blue-50
        borderColor: "#BFDBFE" // blue-200
    },
    simple: {
        icon: "message-circle",
        color: COLORS.primary,
        backgroundColor: "#F8FAFC", // gray-50
        borderColor: "#E2E8F0" // gray-200
    }
}

export default forwardRef(function CustomAlert(props, ref) {
    const [visible, setVisible] = useState(false)
    const [config, setConfig] = useState({
        type: "simple",
        title: "",
        message: "",
        buttons: []
    })
    const [fadeAnim] = useState(new Animated.Value(0))
    const [scaleAnim] = useState(new Animated.Value(0.8))

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true
                })
            ]).start()
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 150,
                    useNativeDriver: true
                })
            ]).start()
        }
    }, [visible])

    const showAlert = (type = "simple", title, message, buttons = []) => {
        const defaultButtons =
            buttons.length > 0
                ? buttons
                : [
                      {
                          text: "OK",
                          onPress: () => hideAlert(),
                          style: "default"
                      }
                  ]

        setConfig({
            type,
            title,
            message,
            buttons: defaultButtons
        })
        setVisible(true)
    }

    const hideAlert = () => {
        setVisible(false)
    }

    // Exponer las funciones a través de la ref
    useImperativeHandle(ref, () => ({
        showAlert,
        hideAlert
    }))

    const currentType = messageTypes[config.type] || messageTypes.simple

    const getButtonStyle = (buttonStyle) => {
        switch (buttonStyle) {
            case "destructive":
                return {
                    backgroundColor: "#EF4444",
                    textColor: "#FFFFFF"
                }
            case "cancel":
                return {
                    backgroundColor: "transparent",
                    textColor: "#6B7280",
                    borderColor: "#D1D5DB"
                }
            default:
                return {
                    backgroundColor: COLORS.primary,
                    textColor: "#FFFFFF"
                }
        }
    }

    // Exponer la función showAlert globalmente
    CustomAlert.show = showAlert

    return (
        <Modal transparent={true} visible={visible} animationType="none" onRequestClose={hideAlert}>
            <Animated.View
                className="flex-1 justify-center items-center px-4"
                style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                    opacity: fadeAnim
                }}
            >
                <Animated.View
                    className="w-full max-w-sm rounded-3xl p-6 shadow-lg"
                    style={{
                        backgroundColor: currentType.backgroundColor,
                        borderWidth: 1,
                        borderColor: currentType.borderColor,
                        transform: [{ scale: scaleAnim }]
                    }}
                >
                    {/* Icono y Título */}
                    <View className="items-center mb-4">
                        <View
                            className="w-16 h-16 rounded-full justify-center items-center mb-3"
                            style={{ backgroundColor: `${currentType.color}20` }}
                        >
                            <Feather name={currentType.icon} size={32} color={currentType.color} />
                        </View>

                        {config.title && (
                            <Text
                                className="text-lg font-bold text-center mb-2"
                                style={{ color: "#1F2937" }}
                            >
                                {config.title}
                            </Text>
                        )}
                    </View>

                    {/* Mensaje */}
                    {config.message && (
                        <Text
                            className="text-base text-center mb-6 leading-6"
                            style={{ color: "#4B5563" }}
                        >
                            {config.message}
                        </Text>
                    )}

                    {/* Botones */}
                    <View className={`${config.buttons.length > 1 ? "flex-row" : ""}`}>
                        {config.buttons.map((button, index) => {
                            const buttonStyle = getButtonStyle(button.style)
                            const isLastButton = index === config.buttons.length - 1
                            const isCancelButton = button.style === "cancel"

                            return (
                                <Pressable
                                    key={index}
                                    onPress={() => {
                                        hideAlert()
                                        button.onPress && button.onPress()
                                    }}
                                    className={`h-12 rounded-xl justify-center items-center ${
                                        config.buttons.length > 1
                                            ? `flex-1 ${!isLastButton ? "mr-3" : ""}`
                                            : "w-full"
                                    }`}
                                    style={{
                                        backgroundColor: buttonStyle.backgroundColor,
                                        borderWidth: isCancelButton ? 1 : 0,
                                        borderColor: buttonStyle.borderColor || "transparent"
                                    }}
                                >
                                    <Text
                                        className="font-semibold text-base"
                                        style={{ color: buttonStyle.textColor }}
                                    >
                                        {button.text}
                                    </Text>
                                </Pressable>
                            )
                        })}
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    )
})

// Función helper para mostrar alertas rápidamente (deprecated)
export const showAlert = (type, title, message, buttons) => {
    console.warn("Use useCustomAlert hook instead of showAlert function")
}
