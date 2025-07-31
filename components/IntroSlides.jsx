import { useState } from "react"
import { Animated, View, Text, Pressable } from "react-native"
import { COLORS, images } from "../constants"

const slides = [
    {
        id: 1,
        imagen: images.intro1,
        title: "Consulta",
        description:
            "Revisa toda la información de tu cartera de clientes, registra pagos y mantente al día."
    },
    {
        id: 2,
        imagen: images.intro2,
        title: "Cada visita cuenta",
        description: "Lleva el control y mantén un registro de tus visitas."
    },
    {
        id: 3,
        imagen: images.intro3,
        title: "¿Estás listo para comenzar?",
        description:
            "Ingresa el usuario y contraseña que te proporcionó tu gerente de sucursal o el equipo a soporte operativo"
    }
]

export default function IntroSlides({ onFinish }) {
    const [currentSlide, setCurrentSlide] = useState(0)

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1)
        } else {
            onFinish()
        }
    }

    const isLastSlide = currentSlide === slides.length - 1

    return (
        <View
            className="flex-1 justify-center items-center px-8"
            style={{ backgroundColor: COLORS.primary }}
        >
            {/* Contenido del slide actual */}
            <View className="flex-1 justify-center items-center">
                <View
                    // className="w-32 h-32 rounded-full mb-8 justify-center items-center"
                    className="w-48 h-48 mb-8 justify-center items-center"
                    // style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                    {/* <Text className="text-white text-4xl font-bold">{slides[currentSlide].id}</Text> */}
                    <Animated.Image
                        source={slides[currentSlide].imagen}
                        className="w-32 h-32 rounded-full"
                        resizeMode="contain"
                    />
                </View>

                <Text className="text-white text-3xl font-bold text-center mb-4">
                    {slides[currentSlide].title}
                </Text>

                <Text className="text-white text-base text-center leading-6 opacity-90">
                    {slides[currentSlide].description}
                </Text>
            </View>

            {/* Indicadores de progreso */}
            <View className="flex-row mb-8">
                {slides.map((_, index) => (
                    <View
                        key={index}
                        className="w-2 h-2 rounded-full mx-1"
                        style={{
                            backgroundColor:
                                index === currentSlide ? "#fff" : "rgba(255,255,255,0.3)"
                        }}
                    />
                ))}
            </View>

            {/* Botón */}
            <Pressable
                onPress={nextSlide}
                className="w-full h-12 rounded-full justify-center items-center mb-8"
                style={{ backgroundColor: "#fff" }}
            >
                <Text className="font-semibold text-base" style={{ color: COLORS.primary }}>
                    {isLastSlide ? "Comenzar" : "Siguiente"}
                </Text>
            </Pressable>
        </View>
    )
}
