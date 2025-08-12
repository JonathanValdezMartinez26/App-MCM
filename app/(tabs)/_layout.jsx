import { Tabs, router } from "expo-router"
import { View, Text, Platform } from "react-native"
import { Feather, AntDesign, SimpleLineIcons } from "@expo/vector-icons"
import { useEffect } from "react"
import { COLORS, FONTS, SIZES } from "../../constants"
import { useSession } from "../../context/SessionContext"

export default function TabLayout() {
    const { token, isLoading } = useSession()

    useEffect(() => {
        if (!isLoading && !token) router.replace("/")
    }, [token, isLoading])

    if (!token) return null

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                // tabBarHideOnKeyboard: Platform.OS !== "ios",
                tabBarStyle: {
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    left: 0,
                    elevation: 0,
                    height: Platform.OS === "ios" ? 90 : 60,
                    backgroundColor: COLORS.white
                }
            }}
        >
            <Tabs.Screen
                name="Cartera"
                options={{
                    title: "",
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View
                                style={{
                                    alignItems: "center",
                                    paddingTop: 10,
                                    width: SIZES.width / 3
                                }}
                            >
                                <AntDesign
                                    name="wallet"
                                    size={24}
                                    color={focused ? COLORS.primary : COLORS.gray3}
                                />
                                <Text
                                    style={{
                                        ...FONTS.body4,
                                        color: focused ? COLORS.primary : COLORS.gray3
                                    }}
                                >
                                    Cartera
                                </Text>
                            </View>
                        )
                    }
                }}
            />
            <Tabs.Screen
                name="Pago"
                options={{
                    title: "",
                    tabBarIcon: () => {
                        return (
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: SIZES.width / 6,
                                    height: SIZES.width / 6,
                                    borderRadius: 999,
                                    backgroundColor: COLORS.primary,
                                    marginBottom: 32
                                }}
                            >
                                <Feather name="dollar-sign" size={30} color={COLORS.white} />
                            </View>
                        )
                    }
                }}
            />
            <Tabs.Screen
                name="Perfil"
                options={{
                    title: "",
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View
                                style={{
                                    alignItems: "center",
                                    paddingTop: 10,
                                    width: SIZES.width / 3
                                }}
                            >
                                <Feather
                                    name="user"
                                    size={24}
                                    color={focused ? COLORS.primary : COLORS.gray3}
                                />
                                <Text
                                    style={{
                                        ...FONTS.body4,
                                        color: focused ? COLORS.primary : COLORS.gray3
                                    }}
                                >
                                    Perfil
                                </Text>
                            </View>
                        )
                    }
                }}
            />
        </Tabs>
    )
}
