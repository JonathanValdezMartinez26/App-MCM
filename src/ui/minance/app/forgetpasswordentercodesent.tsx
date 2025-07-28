import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';

import { COLORS, icons, SIZES } from '@/constants';
import { OtpInput } from 'react-native-otp-entry';

const CIRCLE_SIZE = SIZES.width * 0.14
const DIAL_SIZE = CIRCLE_SIZE * 1.2
const DIAL_TEXT = DIAL_SIZE * 0.4
const GAP = 12

const ForgetPasswordEnterCodeSent = () => {
    const navigation = useNavigation<NavigationProp<any>>()
    const [code, setCode] = useState<string[]>([]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                {/* Back */}
                <Pressable style={styles.back} onPress={() => navigation.goBack()}>
                    <Image source={icons.arrowBack} style={styles.arrowIcon} resizeMode="contain" />
                </Pressable>

                {/* Title */}
                <Text style={styles.title}>Enter Code</Text>
                <Text style={styles.subtitle}>
                    number linked to the account and we&apos;ll send you the code
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
                                navigation.navigate('resetpassword')
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

                {/* Send Code button */}
                <TouchableOpacity
                    style={styles.sendBtn}
                    onPress={() => navigation.navigate('resetpassword')}>
                    <Text style={styles.sendBtnText}>Verifiy Code</Text>
                </TouchableOpacity>
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
    codeRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: GAP,
        marginTop: 30,
        marginBottom: 16
    },
    codeCircle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    codeText: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.shadesBlack,
    },
    dialButton: {
        flex: 1,
        borderRadius: DIAL_SIZE / 2,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialText: {
        fontSize: DIAL_TEXT,
        fontFamily: 'regular',
        color: 'black',
    },
    pinBtn: {
        alignSelf: 'center',
        marginTop: GAP,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 0.4,
        borderColor: COLORS.neutralBlack,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: (SIZES.width - circleSize * 4 - 60) / 4,
        marginBottom: 10,
        marginVertical: 32
    },
    sendBtn: {
        alignSelf: 'center',
        backgroundColor: COLORS.primary,
        width: SIZES.width - 32,
        borderRadius: 32,
        height: 48,
        alignItems: "center",
        justifyContent: 'center',
        marginVertical: 112
    },
    sendBtnText: {
        fontSize: 16,
        fontFamily: 'bold',
        color: '#fff',
    },
})

export default ForgetPasswordEnterCodeSent