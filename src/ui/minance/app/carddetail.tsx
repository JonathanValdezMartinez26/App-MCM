import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, images, SIZES } from '@/constants';
import CustomHeader from '@/components/CustomHeader';
import Button from '@/components/Button';

const CardDetailScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [focusFullName, setFocusFullName] = useState(false);
    const [focusEmail, setFocusEmail] = useState(false);
    const [focusCard, setFocusCard] = useState(false);
    const [saved, setSaved] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <SafeAreaView style={styles.area}>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                <CustomHeader title="Detail Card" onBack={() => navigation.goBack()} />

                <View style={styles.content}>
                    <Text style={styles.headerTitle}>Detail Card</Text>
                    <Text style={styles.headerSubtitle}>
                        Optimize Your Experience by Adding Your Card and enjoy all your features
                    </Text>

                    <View style={styles.inputsWrapper}>
                        <View style={[styles.inputContainer, { borderColor: focusFullName ? COLORS.primary : '#ccc' }]}
                            onTouchStart={() => setFocusFullName(true)}>
                            <Feather name="user" size={20} color={COLORS.neutralBlack} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Your Full Name"
                                value={fullName}
                                onChangeText={setFullName}
                                onFocus={() => setFocusFullName(true)}
                                onBlur={() => setFocusFullName(false)}
                            />
                        </View>

                        <View style={[styles.inputContainer, { borderColor: focusEmail ? COLORS.primary : '#ccc' }]}
                            onTouchStart={() => setFocusEmail(true)}>
                            <Feather name="mail" size={20} color={COLORS.neutralBlack} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Your email"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                                onFocus={() => setFocusEmail(true)}
                                onBlur={() => setFocusEmail(false)}
                            />
                        </View>

                        <View style={[styles.inputContainer, { borderColor: focusCard ? COLORS.primary : '#ccc' }]}
                            onTouchStart={() => setFocusCard(true)}>
                            <Feather name="credit-card" size={20} color={COLORS.neutralBlack} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Your Card Number"
                                keyboardType="number-pad"
                                value={cardNumber}
                                onChangeText={setCardNumber}
                                onFocus={() => setFocusCard(true)}
                                onBlur={() => setFocusCard(false)}
                            />
                            <Image
                                source={images.mastercard}
                                style={styles.mcIcon}
                            />
                        </View>

                    </View>

                    <Pressable style={styles.rememberContainer} onPress={() => setSaved(!saved)}>
                        <View style={[styles.checkbox, saved && styles.checkboxActive]}>
                            {saved && <Ionicons name="checkmark" size={12} color="#fff" />}
                        </View>
                        <Text style={styles.rememberText}>Save card for future</Text>
                    </Pressable>

                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <Text style={styles.termsText}>
                    By selecting the button below, you confirm that you have read and accept Terms & conditions
                </Text>
                <Button filled title="Save" style={{ marginVertical: 12 }} onPress={() => { setModalVisible(true) }} />
                <Button
                    title="Delete Card"
                    textColor={COLORS.red}
                    style={{ borderColor: COLORS.red }}
                    onPress={() => {/* delete logic */ }}
                />
            </View>

            {/* Success Modal */}
            <Modal transparent visible={modalVisible} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.successIconContainer}>
                            <Image source={images.success} resizeMode='contain' style={styles.successImage} />
                        </View>
                        <Text style={styles.modalTitle}>Changes have been saved</Text>
                        <Text style={styles.modalSubtitle}>PIN has been created</Text>
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
    );
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    scrollContent: {
        padding: 16,
    },
    content: {
        paddingTop: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.shadesBlack,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
        lineHeight: 20,
    },
    inputsWrapper: {
        marginTop: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 16,
        height: 50,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: COLORS.shadesBlack,
        fontFamily: "regular"
    },
    mcIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        marginLeft: 8,
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    checkbox: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: COLORS.grayscale400,
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: COLORS.primary,
    },
    rememberText: {
        fontSize: 14,
        color: '#333',
    },
    bottomContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
    },
    termsText: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
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
    arrowIcon: {
        height: 16,
        width: 16,
        tintColor: COLORS.shadesBlack
    },
    successImage: {
        height: 100,
        width: 100
    }
});

export default CardDetailScreen;