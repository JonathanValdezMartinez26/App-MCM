import { Tabs } from "expo-router"
import { View, Text, Platform } from "react-native"
import { Feather, AntDesign } from "@expo/vector-icons"
import { COLORS, FONTS, SIZES } from "../../constants"

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: Platform.OS !== "ios",
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
                                    width: SIZES.width / 5
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
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: SIZES.width / 7,
                                    height: SIZES.width / 7,
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
                                    width: SIZES.width / 5
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
