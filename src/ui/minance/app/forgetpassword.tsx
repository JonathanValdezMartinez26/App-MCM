import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import CountryPicker, {
    Country,
    CountryCode,
} from 'react-native-country-picker-modal';

import { COLORS, icons, SIZES } from '@/constants';

const ForgetPassword = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    // phone / PIN
    const [phone, setPhone] = useState<string>('')

    // country picker state
    const [countryCode, setCountryCode] = useState<CountryCode>('ID')
    const [callingCode, setCallingCode] = useState<string>('62')
    const [withCountryModal, setWithCountryModal] = useState(false)

    const onSelectCountry = (country: Country) => {
        setCountryCode(country.cca2)
        setCallingCode(country.callingCode[0])
        setWithCountryModal(false)
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                {/* Back */}
                <Pressable style={styles.back} onPress={() => navigation.goBack()}>
                    <Image source={icons.arrowBack} style={styles.arrowIcon} resizeMode="contain" />
                </Pressable>

                {/* Title */}
                <Text style={styles.title}>Enter your Number</Text>
                <Text style={styles.subtitle}>
                    number linked to the account and we'll send you the code
                </Text>

                {/* Email pill */}
                <View style={styles.emailContainer}>
                    <Text style={styles.emailText}>hello@mangcoding.com</Text>
                </View>

                {/* Phone input with dynamic country picker */}
                <View style={styles.phoneContainer}>
                    <Pressable
                        style={styles.countryPicker}
                        onPress={() => setWithCountryModal(true)}>
                        {/* CountryPicker modal */}
                        <CountryPicker
                            withFilter
                            withFlag
                            withCallingCode
                            withEmoji
                            countryCode={countryCode}
                            visible={withCountryModal}
                            onClose={() => setWithCountryModal(false)}
                            onSelect={onSelectCountry}
                        />
                        <Text style={styles.phoneCode}>+{callingCode}</Text>
                        <Ionicons name="chevron-down-outline" size={16} color={COLORS.shadesBlack} />
                    </Pressable>
                    <TextInput
                        placeholder='9999 9999 99 99'
                        style={styles.phoneText}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType='numeric'
                    />
                </View>

                {/* Send Code button */}
                <TouchableOpacity
                    style={[styles.sendBtn, phone.length === 0 && { opacity: 0.5 }]}
                    onPress={() => navigation.navigate('forgetpasswordentercodesent', { phone: `+${callingCode}${phone}` })}
                    disabled={phone.length === 0}>
                    <Text style={styles.sendBtnText}>Send Code</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
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
        marginTop: 10,
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
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 32,
        borderWidth: 0.4,
        borderColor: COLORS.neutralBlack,
    },
    countryPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    flagIcon: {
        width: 24,
        height: 16,
        marginRight: 6
    },
    phoneCode: {
        fontSize: 14,
        color: COLORS.shadesBlack,
        fontFamily: 'regular',
        marginRight: 4,
    },
    phoneText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.shadesBlack,
        fontFamily: 'regular',
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

export default ForgetPassword
