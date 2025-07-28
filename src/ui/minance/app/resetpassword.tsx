import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Pressable, Image, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, icons, images, SIZES } from '@/constants';

const ResetPassword: React.FC = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [securePwd, setSecurePwd] = useState(true);
    const [secureConfirm, setSecureConfirm] = useState(true);
    const [focusPwd, setFocusPwd] = useState(false);
    const [focusConfirm, setFocusConfirm] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                {/* Back Button */}
                <Pressable style={styles.back} onPress={() => navigation.goBack()}>
                    <Image source={icons.arrowBack} resizeMode='contain' style={styles.arrowIcon} />
                </Pressable>

                {/* Header */}
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>Make sure you enter a secure and strong password.</Text>

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
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.primaryButton} activeOpacity={0.7}>
                    <Text style={styles.primaryButtonText}>Reset</Text>
                </TouchableOpacity>

                {/* Footer */}
                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>Remember Password?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('login')}>
                        <Text style={styles.footerLink}> Sign in</Text>
                    </TouchableOpacity>
                </View>

                {/* Success Modal */}
                <Modal transparent visible={modalVisible} animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.successIconContainer}>
                                <Image source={images.success} resizeMode='contain' style={styles.successImage} />
                            </View>
                            <Text style={styles.modalTitle}>Password Success</Text>
                            <Text style={styles.modalSubtitle}>your password as already login to Minance</Text>
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
        color: "black",
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
    }
});

export default ResetPassword;
