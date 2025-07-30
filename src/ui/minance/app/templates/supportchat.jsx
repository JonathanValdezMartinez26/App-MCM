import {
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Text,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    SafeAreaView
} from "react-native"
import { useState, useEffect } from "react"
import { COLORS, FONTS, SIZES, images } from "../../constants"
import { StatusBar } from "expo-status-bar"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { GiftedChat, Bubble } from "react-native-gifted-chat"
import * as Speech from "expo-speech"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import Button from "@/components/Button"

const YOUR_OPENAI_KEY = ""

export default function Chat() {
    const navigation = useNavigation()
    const [inputMessage, setInputMessage] = useState("")
    const [outputMessage, setOutputMessage] = useState("Results to be shown here.")
    const [messages, setMessages] = useState([])
    const [isEnabled, setIsEnabled] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        const fetchVoiceToSpeechStatus = async () => {
            try {
                const value = await AsyncStorage.getItem("voiceToSpeechEnabled")
                console.log("Voice chat status:", value)
                setIsEnabled(value === "true")
            } catch (error) {
                console.log("Error retrieving Voice to Speech status:", error)
            }
        }

        fetchVoiceToSpeechStatus()
    }, [])

    const handleInputText = (text) => {
        setInputMessage(text)
    }

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
                <TouchableOpacity style={styles.backBtn} onPress={() => setModalVisible(true)}>
                    <Ionicons name="chevron-back" size={24} color="#1E1E1E" />
                </TouchableOpacity>
            </View>
            <Text style={styles.headerTitle}>Chat With Support</Text>
            <TouchableOpacity>
                <Text>{"   "}</Text>
            </TouchableOpacity>
        </View>
    )

    const renderMessage = (props) => {
        // 1. pull `key` out of props
        const { key, ...bubbleProps } = props

        // 2. pass it explicitly to the top-level element
        if (bubbleProps.currentMessage.user._id === 1) {
            return (
                <View
                    key={key} // ← key goes here
                    style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}
                >
                    <Bubble
                        {...bubbleProps} // ← everything else here
                        wrapperStyle={{
                            right: {
                                backgroundColor: COLORS.primary,
                                marginRight: 12,
                                marginVertical: 12
                            }
                        }}
                        textStyle={{ right: { color: COLORS.white } }}
                    />
                </View>
            )
        } else {
            return (
                <View
                    key={key}
                    style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start" }}
                >
                    <Image
                        source={images.avatar}
                        style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 8 }}
                    />
                    <Bubble
                        {...bubbleProps}
                        wrapperStyle={{
                            left: {
                                backgroundColor: COLORS.secondaryWhite,
                                marginLeft: 12
                            }
                        }}
                        textStyle={{ left: { color: COLORS.greyscale900 } }}
                    />
                </View>
            )
        }
    }

    const submitHandler = () => {
        // console.log(inputMessage);
        if (inputMessage.toLowerCase().startsWith("generate image")) {
            generateImages()
        } else {
            generateText()
        }
    }

    const SYSTEM_PROMPT =
        "You are the support assistant for Minance, a banking application. Your role is to help users with their banking questions."

    const generateText = async () => {
        if (!inputMessage.trim()) return

        // immediately show the user’s own message in the UI
        const userMsg = {
            _id: Math.random().toString(),
            text: inputMessage,
            createdAt: new Date(),
            user: { _id: 1 }
        }
        setMessages((prev) => GiftedChat.append(prev, [userMsg]))
        setInputMessage("")

        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // inject your real key here—do NOT commit it to git
                    Authorization: `Bearer ${YOUR_OPENAI_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: inputMessage }
                    ]
                })
            })

            // early‐out on HTTP errors
            if (!res.ok) {
                const errorBody = await res.json()
                console.error("OpenAI error", res.status, errorBody)
                return
            }

            const json = await res.json()
            const replyText = json.choices[0].message.content.trim()

            // append the assistant’s reply
            const botMsg = {
                _id: Math.random().toString(),
                text: replyText,
                createdAt: new Date(),
                user: { _id: 2, name: "Minance" }
            }
            setMessages((prev) => GiftedChat.append(prev, [botMsg]))

            // optional text‐to‐speech
            if (isEnabled) {
                Speech.speak(replyText)
            }
        } catch (err) {
            console.error("Network or parsing error", err)
        }
    }

    const generateImages = () => {
        const message = {
            _id: Math.random().toString(36).substring(7),
            text: inputMessage,
            createdAt: new Date(),
            user: { _id: 1 }
        }
        setMessages((previousMessage) => GiftedChat.append(previousMessage, [message]))

        fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${YOUR_OPENAI_KEY}`
            },
            body: JSON.stringify({
                prompt: inputMessage,
                n: 1,
                size: "1024x1024"
            })
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log(data.data[0].url);
                setInputMessage("")
                setOutputMessage(data.data[0].url)
                data.data.forEach((item) => {
                    const message = {
                        _id: Math.random().toString(36).substring(7),
                        text: "Image",
                        createdAt: new Date(),
                        user: { _id: 2, name: "Brain Minance" },
                        image: item.url
                    }
                    setMessages((previousMessage) => GiftedChat.append(previousMessage, [message]))
                })
            })
    }

    // Define a custom input toolbar component that renders nothing
    const CustomInputToolbar = (props) => (
        <View style={{ height: 0 }} /> // or simply return null
    )

    const renderModal = () => {
        return (
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={[styles.modalContainer]}>
                        <View
                            style={[
                                styles.modalSubContainer,
                                {
                                    backgroundColor: COLORS.secondaryWhite
                                }
                            ]}
                        >
                            <Image
                                source={images.success}
                                resizeMode="contain"
                                style={styles.logoIcon}
                            />
                            <Text style={styles.modalTitle}>End Session</Text>
                            <Text style={styles.modalSubtitle}>
                                Are you sure you want to end session the chat with Minance?
                            </Text>

                            <Button
                                title="Yes, End Session"
                                filled
                                onPress={() => {
                                    setModalVisible(false)
                                    navigation.goBack()
                                }}
                                style={{
                                    width: "100%",
                                    marginTop: 12
                                }}
                            />
                            <Button
                                title="Cancel"
                                onPress={() => {
                                    setModalVisible(false)
                                }}
                                textColor={COLORS.primary}
                                style={{
                                    width: "100%",
                                    marginTop: 12,
                                    backgroundColor: COLORS.tansparentPrimary,
                                    borderColor: COLORS.tansparentPrimary
                                }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: COLORS.white,
                paddingVertical: 16
            }}
        >
            <StatusBar hidden={true} />
            {renderHeader()}

            <StatusBar style="auto" />
            <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={{ ...FONTS.body3, color: COLORS.white }}>{outputMessage}</Text>
                <GiftedChat
                    messages={messages}
                    renderInputToolbar={(props) => <CustomInputToolbar {...props} />}
                    user={{ _id: 1 }}
                    minInputToolbarHeight={0}
                    renderMessage={renderMessage}
                />
            </View>

            <View
                style={{
                    flexDirection: "row",
                    backgroundColor: COLORS.white,
                    paddingVertical: 8,
                    marginBottom: 16
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        marginLeft: 10,
                        backgroundColor: "#F2F2F2",
                        paddingVertical: 8,
                        marginHorizontal: 12,
                        borderRadius: 12
                    }}
                >
                    <TextInput
                        style={{
                            color: COLORS.greyscale900,
                            flex: 1,
                            paddingHorizontal: 10
                        }}
                        value={inputMessage}
                        onChangeText={handleInputText}
                        placeholderTextColor={COLORS.grayscale700}
                        placeholder="Enter your question"
                    />

                    <TouchableOpacity onPress={submitHandler}>
                        <View
                            style={{
                                // backgroundColor: COLORS.blue,
                                padding: 6,
                                borderRadius: 8,
                                marginHorizontal: 12
                            }}
                        >
                            <FontAwesome name="send-o" size={24} color={COLORS.primary} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {renderModal()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        width: SIZES.width - 32,
        justifyContent: "space-between",
        marginBottom: 16,
        paddingLeft: 16,
        alignItems: "center"
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black
    },
    headerTitle: {
        fontSize: 14,
        fontFamily: "semiBold",
        color: COLORS.shadesBlack,
        marginLeft: 16
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: "bold",
        color: COLORS.shadesBlack,
        textAlign: "center",
        marginVertical: 12
    },
    modalSubtitle: {
        fontSize: 14,
        fontFamily: "regular",
        color: COLORS.neutralBlack,
        textAlign: "center",
        marginVertical: 12,
        marginHorizontal: 16
    },
    modalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalSubContainer: {
        height: 522,
        width: SIZES.width * 0.86,
        backgroundColor: COLORS.white,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        padding: 16
    },
    backgroundIllustration: {
        height: 150,
        width: 150,
        marginVertical: 22,
        alignItems: "center",
        justifyContent: "center",
        zIndex: -999
    },
    modalIllustration: {
        height: 150,
        width: 150
    },
    modalInput: {
        width: "100%",
        height: 52,
        backgroundColor: COLORS.tansparentPrimary,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderColor: COLORS.primary,
        borderWidth: 1,
        marginVertical: 12
    },
    editPencilIcon: {
        width: 42,
        height: 42,
        tintColor: COLORS.white,
        zIndex: 99999,
        position: "absolute",
        top: 54,
        left: 60
    },
    logoIcon: {
        height: 160,
        width: 200,
        marginBottom: 22,
        alignSelf: "center"
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        justifyContent: "center"
    }
})
