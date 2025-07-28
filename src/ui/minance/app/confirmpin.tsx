import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Image, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { COLORS, images, SIZES } from '../constants';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NavigationProp } from '@react-navigation/native';

const STEP_COUNT = 4;
const ACTIVE_STEP = 2; // first two steps active

const pinLength = 6
const pinContainerSize = SIZES.width / 2
const pinMaxSize = pinContainerSize / pinLength
const pinSpacing = 10
const pinSize = pinMaxSize - pinSpacing * 2

const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del']
const dialPadSize = SIZES.width * 0.16
const dialPadTextSize = dialPadSize * 0.4
const _spacing = 20

function DialPad({
    onPress,
}: {
    onPress: (item: (typeof dialPad)[number]) => void
}) {
    return (
        <FlatList
            numColumns={3}
            data={dialPad}
            style={{ flexGrow: 0, backgroundColor: "transparent" }}
            keyExtractor={(_, index) => index.toString()}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: _spacing }}
            contentContainerStyle={{ gap: _spacing }}
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity
                        disabled={item === ''}
                        onPress={() => {
                            onPress(item)
                        }}>
                        <View
                            style={{
                                width: dialPadSize,
                                height: dialPadSize,
                                borderRadius: dialPadSize / 2,
                                backgroundColor: item === '' ? 'transparent' : '#F5F5F5',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            {item === 'del' ? (
                                <Ionicons
                                    name="backspace-outline"
                                    size={dialPadTextSize}
                                    color="black"
                                />
                            ) : (
                                <Text
                                    style={{
                                        fontSize: dialPadTextSize,
                                        fontFamily: 'regular',
                                        color: 'black',
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

const ConfirmPIN = () => {
    const [code, setCode] = useState<number[]>([]);
    const navigation = useNavigation<NavigationProp<any>>();
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <SafeAreaView style={styles.area}>
            <StatusBar style="dark" />
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                {Array.from({ length: STEP_COUNT }).map((_, idx) => (
                    <View
                        key={idx}
                        style={[
                            styles.progressStep,
                            idx < ACTIVE_STEP ? styles.stepActive : styles.stepInactive,
                        ]}
                    />
                ))}
            </View>
            <View style={styles.viewContainer}>
                {/* Header */}
                <Text style={styles.title}>Re-enter the PIN</Text>
                <Text style={styles.subtitle}>The PIN consists of 6 numbers which you will use
                    to open applications and transactions and protect your data.</Text>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    gap: pinSpacing * 2,
                    marginBottom: _spacing * 2,
                    height: pinSize * 2,
                    alignItems: "flex-end"
                }}>
                {[...Array(pinLength).keys()].map((key) => {
                    const isSelected = !!code[key];

                    return (
                        <View
                            key={key}
                            style={{
                                width: pinSize,
                                height: pinSize,
                                borderRadius: pinSize,
                                borderColor: isSelected ? COLORS.primary : COLORS.neutralBlack,
                                borderWidth: 1,
                                backgroundColor: isSelected ? COLORS.primary : COLORS.white,
                            }}
                        />
                    )
                })}
            </View>
            <DialPad
                onPress={(item) => {
                    if (item === 'del') {
                        setCode((prevCode) => prevCode.slice(0, prevCode.length - 1));
                    } else if (typeof item === 'number') {
                        setCode((prevCode) => {
                            const newCode = [...prevCode, item];
                            if (newCode.length === pinLength) {
                                setModalVisible(true)
                            }
                            return newCode;
                        });
                    }
                }}
            />
            <View style={styles.bottomContainer}>
                <Text style={styles.bottomTitle}>By continuing, you agree to Loana’s </Text>
                <Text style={styles.bottomSubtitle}>Terms of Use & Privacy Policy</Text>
            </View>

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
                                navigation.navigate('accountverificationsetup')
                            }}
                            activeOpacity={0.7}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const stepWidth = (SIZES.width - 80) / STEP_COUNT;

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        paddingVertical: 16
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 18,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
        marginTop: 16
    },
    progressStep: {
        width: stepWidth,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 5,
    },
    stepActive: {
        backgroundColor: '#0761FD'
    },
    stepInactive: {
        backgroundColor: '#E5E5E5'
    },
    title: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.shadesBlack,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.neutralBlack,
        fontFamily: "regular"
    },
    viewContainer: {
        marginHorizontal: 16,
        marginBottom: 32
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
    },
    bottomContainer: {
        marginVertical: 48
    }
})

export default ConfirmPIN