import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Modal,
    Image,
    SafeAreaView
} from "react-native"
import React, { useState } from "react"
import { COLORS, images, SIZES } from "../../constants"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "expo-router"
import { StatusBar } from "expo-status-bar"
import CustomHeader from "@/components/CustomHeader"
import { NavigationProp } from "@react-navigation/native"

const { width } = Dimensions.get("window")
const STEP_COUNT = 4

const pinLength = 6
const pinContainerSize = SIZES.width / 2
const pinMaxSize = pinContainerSize / pinLength
const pinSpacing = 10
const pinSize = pinMaxSize - pinSpacing * 2

const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "del"]
const dialPadSize = SIZES.width * 0.2
const dialPadTextSize = dialPadSize * 0.4
const _spacing = 20

function DialPad({ onPress }: { onPress: (item: (typeof dialPad)[number]) => void }) {
    return (
        <FlatList
            numColumns={3}
            data={dialPad}
            style={{ flexGrow: 1 }}
            keyExtractor={(_, index) => index.toString()}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: _spacing }}
            contentContainerStyle={{ gap: _spacing }}
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity
                        disabled={item === ""}
                        onPress={() => {
                            onPress(item)
                        }}
                    >
                        <View
                            style={{
                                width: dialPadSize,
                                height: dialPadSize,
                                borderRadius: dialPadSize / 2,
                                backgroundColor: item === "" ? "transparent" : "#F5F5F5",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            {item === "del" ? (
                                <Ionicons
                                    name="backspace-outline"
                                    size={dialPadTextSize}
                                    color="black"
                                />
                            ) : (
                                <Text
                                    style={{
                                        fontSize: dialPadTextSize,
                                        fontFamily: "regular",
                                        color: "black"
                                    }}
                                >
                                    {item}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                )
            }}
        />
    )
}

const EditPinConfirmPIN = () => {
    const [code, setCode] = useState<number[]>([])
    const navigation = useNavigation<NavigationProp<any>>()
    const [modalVisible, setModalVisible] = useState(false)

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <StatusBar style="dark" />
                <CustomHeader title="Edit PIN" onBack={() => navigation.goBack()} />
                <View style={styles.contentContainer}>
                    <View style={styles.viewContainer}>
                        {/* Header */}
                        <Text style={styles.title}>Confirmation a PIN</Text>
                        <Text style={styles.subtitle}>
                            The PIN consists of 6 numbers which you will use to open applications
                            and transactions and protect your data.
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: pinSpacing * 2,
                            marginBottom: _spacing * 2,
                            height: pinSize * 2,
                            alignItems: "flex-end"
                        }}
                    >
                        {[...Array(pinLength).keys()].map((key) => {
                            const isSelected = !!code[key]

                            return (
                                <View
                                    key={key}
                                    style={{
                                        width: pinSize,
                                        height: pinSize,
                                        borderRadius: pinSize,
                                        borderColor: isSelected
                                            ? COLORS.primary
                                            : COLORS.neutralBlack,
                                        borderWidth: 1,
                                        backgroundColor: isSelected ? COLORS.primary : COLORS.white
                                    }}
                                />
                            )
                        })}
                    </View>
                    <DialPad
                        onPress={(item) => {
                            if (item === "del") {
                                setCode((prevCode) => prevCode.slice(0, prevCode.length - 1))
                            } else if (typeof item === "number") {
                                setCode((prevCode) => {
                                    const newCode = [...prevCode, item]
                                    if (newCode.length === pinLength) {
                                        setModalVisible(true)
                                    }
                                    return newCode
                                })
                            }
                        }}
                    />
                </View>
            </View>

            {/* Success Modal */}
            <Modal transparent visible={modalVisible} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.successIconContainer}>
                            <Image
                                source={images.success}
                                resizeMode="contain"
                                style={styles.successImage}
                            />
                        </View>
                        <Text style={styles.modalTitle}>
                            Your PIN has been successfully changed
                        </Text>
                        <Text style={styles.modalSubtitle}>The PIN has been change</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false)
                                navigation.navigate("(tabs)")
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const stepWidth = (width - 80) / STEP_COUNT

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16
    },
    formTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 18
    },
    progressContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 40
    },
    progressStep: {
        width: stepWidth,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 5
    },
    stepActive: {
        backgroundColor: "#0761FD"
    },
    stepInactive: {
        backgroundColor: "#E5E5E5"
    },
    title: {
        fontSize: 24,
        fontFamily: "bold",
        color: COLORS.shadesBlack,
        marginBottom: 12
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.neutralBlack,
        fontFamily: "regular"
    },
    viewContainer: {
        marginHorizontal: 16,
        marginBottom: 24
    },
    bottomTitle: {
        fontSize: 14,
        color: COLORS.neutralBlack,
        fontFamily: "regular"
    },
    bottomSubtitle: {
        fontSize: 14,
        color: COLORS.shadesBlack,
        fontFamily: "medium",
        textAlign: "center"
    },
    contentContainer: {
        alignItems: "center"
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalContent: {
        width: SIZES.width - 60,
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 42,
        alignItems: "center"
    },
    successIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#28a745",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: "bold",
        color: COLORS.shadesBlack,
        textAlign: "center",
        marginBottom: 12,
        marginTop: 16
    },
    modalSubtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 20
    },
    modalButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 25,
        width: SIZES.width - 112,
        height: 48,
        alignItems: "center",
        justifyContent: "center"
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500"
    },
    successImage: {
        height: 100,
        width: 100
    }
})

export default EditPinConfirmPIN
