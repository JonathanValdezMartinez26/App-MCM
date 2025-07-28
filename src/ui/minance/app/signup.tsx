import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, icons } from '@/constants';
import CustomHeader from '@/components/CustomHeader';

// Navigation params
export type RootStackParamList = {
    SignUp: undefined;
    Login: undefined;
    // ...other screens
};

const SignUpScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [securePwd, setSecurePwd] = useState(true);
    const [secureConfirm, setSecureConfirm] = useState(true);
    const [focusEmail, setFocusEmail] = useState(false);
    const [focusPwd, setFocusPwd] = useState(false);
    const [focusConfirm, setFocusConfirm] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                {/* Progress Bar */}
                <View style={styles.progressBar}>
                    <View style={styles.stepActive} />
                    <View style={styles.stepInactive} />
                    <View style={styles.stepInactive} />
                    <View style={styles.stepInactive} />
                </View>

                {/* Back Button */}
                <CustomHeader title="" onBack={() => navigation.goBack()} />

                {/* Header */}
                <Text style={styles.title}>Sign up account</Text>
                <Text style={styles.subtitle}>Make sure you enter the email registered with Minance.</Text>

                {/* Email Input */}
                <View style={[styles.inputContainer, { borderColor: focusEmail ? COLORS.primary : '#ccc' }]}>
                    <Feather name="mail" size={20} color={COLORS.neutralBlack} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setFocusEmail(true)}
                        onBlur={() => setFocusEmail(false)}
                    />
                </View>

                {/* Password Input */}
                <View style={[styles.inputContainer, { borderColor: focusPwd ? COLORS.primary : '#ccc' }]}>
                    <Feather name="key" size={20} color={COLORS.neutralBlack} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={securePwd}
                        value={password}
                        onChangeText={setPassword}
                        onFocus={() => setFocusPwd(true)}
                        onBlur={() => setFocusPwd(false)}
                    />
                    <TouchableOpacity onPress={() => setSecurePwd(!securePwd)}>
                        <Feather
                            name={securePwd ? 'eye-off' : 'eye'}
                            size={20}
                            color={COLORS.neutralBlack}
                        />
                    </TouchableOpacity>
                </View>

                {/* Confirm Password Input */}
                <View style={[styles.inputContainer, { borderColor: focusConfirm ? COLORS.primary : '#ccc' }]}>
                    <Feather name="key" size={20} color={COLORS.neutralBlack} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Retype password"
                        secureTextEntry={secureConfirm}
                        value={confirm}
                        onChangeText={setConfirm}
                        onFocus={() => setFocusConfirm(true)}
                        onBlur={() => setFocusConfirm(false)}
                    />
                    <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
                        <Feather
                            name={secureConfirm ? 'eye-off' : 'eye'}
                            size={20}
                            color={COLORS.neutralBlack}
                        />
                    </TouchableOpacity>
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity onPress={() => navigation.navigate('verifyemail')} style={styles.primaryButton} activeOpacity={0.7}>
                    <Text style={styles.primaryButtonText}>Sign up</Text>
                </TouchableOpacity>

                {/* Separator */}
                <View style={styles.separator}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>Or</Text>
                    <View style={styles.line} />
                </View>

                {/* Social Buttons */}
                <TouchableOpacity style={styles.socialButton} activeOpacity={0.7} onPress={() => navigation.navigate('verifyemail')}>
                    <Image source={icons.appleLogo} resizeMode="contain" style={styles.socialIcon} />
                    <Text style={styles.socialText}>iCloud</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} activeOpacity={0.7} onPress={() => navigation.navigate('verifyemail')}>
                    <Image source={icons.google} resizeMode="contain" style={styles.socialIcon} />
                    <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>

                {/* Footer */}
                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>You have account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('login')}>
                        <Text style={styles.footerLink}> Sign in</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 16
    },
    content: {
        padding: 20
    },
    progressBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    stepActive: {
        flex: 1,
        height: 4,
        backgroundColor: '#0761FD',
        borderRadius: 2,
        marginHorizontal: 2
    },
    stepInactive: {
        flex: 1,
        height: 4,
        backgroundColor: '#E5E5E5',
        borderRadius: 2,
        marginHorizontal: 2
    },
    back: {
        marginBottom: 20,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#f0f0f0'
    },
    title: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.shadesBlack,
        marginBottom: 8
    },
    subtitle: {
        fontSize: 14,
        color: '#8C8C8C',
        marginBottom: 24,
        fontFamily: "regular"
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 15,
        height: 50
    },
    icon: {
        marginRight: 8
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: COLORS.shadesBlack,
        fontFamily: "regular"
    },
    primaryButton: {
        backgroundColor: '#0761FD',
        borderRadius: 25,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500'
    },
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc'
    },
    orText: {
        marginHorizontal: 10,
        fontSize: 14,
        color: '#666'
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 15,
    },
    socialIcon: {
        marginRight: 10,
        height: 20,
        width: 20
    },
    socialText: {
        fontSize: 16,
        color: '#333'
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    footerText: {
        fontSize: 14,
        color: '#666',
        fontFamily: "regular"
    },
    footerLink: {
        fontSize: 14,
        color: '#0761FD',
        fontFamily: "bold"
    },
    arrowIcon: {
        height: 16,
        width: 16,
        tintColor: COLORS.shadesBlack
    }
});

export default SignUpScreen;
