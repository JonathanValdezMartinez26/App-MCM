import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, icons, images, SIZES } from '@/constants';
import { OtpInput } from 'react-native-otp-entry';


const ForgetPasswordEnterNewPin = () => {
    const navigation = useNavigation<NavigationProp<any>>()
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                {/* Back */}
                <Pressable style={styles.back} onPress={() => navigation.goBack()}>
                    <Image source={icons.arrowBack} style={styles.arrowIcon} resizeMode="contain" />
                </Pressable>

                {/* Title */}
                <Text style={styles.title}>New PIN</Text>
                <Text style={styles.subtitle}>
                    number linked to the account and we'll send you the code
                </Text>

                {/* Email pill */}
                <View style={styles.emailContainer}>
                    <Text style={styles.emailText}>hello@mangcoding.com</Text>
                </View>

                {/* Code Input Circles */}
                <View style={styles.codeContainer}>
                    <OtpInput
                        numberOfDigits={4}
                        onTextChange={(text) => console.log(text)}
                        focusColor={COLORS.primary}
                        focusStickBlinkingDuration={500}
                        onFilled={(text) => {
                            // Please implement code verification here
                            if (text.length == 4) {
                                setModalVisible(true)
                            }
                        }}
                        theme={{
                            pinCodeContainerStyle: {
                                backgroundColor: COLORS.white,
                                height: 58,
                                width: 58,
                                borderWidth: 1,
                                borderColor: COLORS.greyscale300,
                                borderRadius: 9999
                            },
                            pinCodeTextStyle: {
                                color: COLORS.black,
                            }
                        }}
                    />
                </View>

                {/* Forget PIN */}
                <TouchableOpacity
                    style={styles.pinBtn}
                    onPress={() => navigation.navigate('forgetpinphonenumber')}
                >
                    <Text style={styles.subtitle}>Forget PIN</Text>
                </TouchableOpacity>

                {/* Success Modal */}
                <Modal transparent visible={modalVisible} animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.successIconContainer}>
                                <Image source={images.success} resizeMode='contain' style={styles.successImage} />
                            </View>
                            <Text style={styles.modalTitle}>Your PIN has already</Text>
                            <Text style={styles.modalSubtitle}>PIN has been created</Text>
                            <TouchableOpacity style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible(false);
                                    navigation.navigate('login')
                                }}
                                activeOpacity={0.7}>
                                <Text style={styles.modalButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </ScrollView>
        </SafeAreaView>
    )
}

const circleSize = 60;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 16
    },
    content: {
        padding: 20,
        flexGrow: 1
    },
    back: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    arrowIcon: {
        width: 16,
        height: 16,
        tintColor: COLORS.shadesBlack
    },
    title: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.shadesBlack,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#8C8C8C',
        textAlign: 'center',
        marginTop: 4,
    },
    emailContainer: {
        alignSelf: 'center',
        marginTop: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 0.4,
        borderColor: COLORS.neutralBlack,
    },
    emailText: {
        fontSize: 14,
        color: COLORS.shadesBlack,
        fontFamily: 'regular',
    },

    codeText: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.shadesBlack,
    },
    pinBtn: {
        alignSelf: 'center',
        marginTop: 32,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 0.4,
        borderColor: COLORS.neutralBlack,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: SIZES.width - 60,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 42,
        alignItems: 'center',
    },
    successIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#28a745',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.shadesBlack,
        textAlign: 'center',
        marginBottom: 12,
        marginTop: 16
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
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
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    successImage: {
        height: 100,
        width: 100
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: (SIZES.width - circleSize * 4 - 60) / 4,
        marginBottom: 10,
        marginVertical: 32
    },
})

export default ForgetPasswordEnterNewPin