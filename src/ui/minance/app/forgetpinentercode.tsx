import React from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, icons, SIZES } from '@/constants';
import { OtpInput } from 'react-native-otp-entry';


const ForgetPasswordEnterCode = () => {
    const navigation = useNavigation<NavigationProp<any>>()

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
                                navigation.navigate('forgetpinenternewpin')
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
                    onPress={() => navigation.navigate('forgetpinenternewpin')}>
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

    codeText: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.shadesBlack,
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

export default ForgetPasswordEnterCode