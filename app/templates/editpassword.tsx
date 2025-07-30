import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, Image, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import CustomHeader from '@/components/CustomHeader';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, images, SIZES } from '@/constants';
import { Feather } from '@expo/vector-icons';
import Button from '@/components/Button';

const EditPassword = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [oldPassword, setOldPassword] = useState("")
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [focusOldPwd, setFocusOldPwd] = useState(false);
    const [focusPwd, setFocusPwd] = useState(false);
    const [focusConfirm, setFocusConfirm] = useState(false);
    const [secureOldPwd, setSecureOldPwd] = useState(true);
    const [securePwd, setSecurePwd] = useState(true);
    const [secureConfirm, setSecureConfirm] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <StatusBar style="dark" />
                <CustomHeader
                    title="Edit PIN"
                    onBack={() => navigation.goBack()}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Change your password</Text>
                    <Text style={styles.subtitle}>Change your password to make you easy open this account</Text>

                    {/* Password Input */}
                    <View
                        style={[
                            styles.inputContainer,
                            { borderColor: focusOldPwd ? COLORS.primary : '#ccc' },
                        ]}>
                        <Feather name="key" size={20} color={COLORS.neutralBlack} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Old Password"
                            secureTextEntry={secureOldPwd}
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            onFocus={() => setFocusOldPwd(true)}
                            onBlur={() => setFocusOldPwd(false)}
                        />
                        <TouchableOpacity onPress={() => setSecureOldPwd(!secureOldPwd)}>
                            <Feather
                                name={secureOldPwd ? 'eye-off' : 'eye'}
                                size={20}
                                color={COLORS.neutralBlack}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Password Input */}
                    <View
                        style={[
                            styles.inputContainer,
                            { borderColor: focusPwd ? COLORS.primary : '#ccc' },
                        ]}>
                        <Feather name="key" size={20} color={COLORS.neutralBlack} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="New Password"
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
                    <View
                        style={[
                            styles.inputContainer,
                            { borderColor: focusConfirm ? COLORS.primary : '#ccc' },
                        ]}
                    >
                        <Feather name="key" size={20} color={COLORS.neutralBlack} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Retype New Password"
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
                </ScrollView>
                <Button
                    filled
                    title="Confirmation"
                    onPress={() => setModalVisible(true)}
                />
            </View>

            {/* Success Modal */}
            <Modal transparent visible={modalVisible} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.successIconContainer}>
                            <Image source={images.success} resizeMode='contain' style={styles.successImage} />
                        </View>
                        <Text style={styles.modalTitle}>Your password has been successfully changed</Text>
                        <Text style={styles.modalSubtitle}>The passwors has been change</Text>
                        <TouchableOpacity style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('(tabs)')
                            }}
                            activeOpacity={0.7}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16
    },
    title: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.shadesBlack,
        marginBottom: 8,
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
        paddingHorizontal: 28,
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
})

export default EditPassword