import { View, Text, StyleSheet, Image, Pressable, TextInput, Modal, FlatList, TouchableOpacity, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import CustomHeader from '@/components/CustomHeader';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, icons, images, SIZES } from '@/constants';
import Button from '@/components/Button';
import { Ionicons } from '@expo/vector-icons';

const pinLength = 6
const pinContainerSize = SIZES.width / 2
const pinMaxSize = pinContainerSize / pinLength
const pinSpacing = 10
const pinSize = pinMaxSize - pinSpacing * 2

const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del']
const dialPadSize = SIZES.width * 0.18
const dialPadTextSize = dialPadSize * 0.3
const _spacing = 10

function DialPad({
    onPress,
}: {
    onPress: (item: (typeof dialPad)[number]) => void
}) {
    return (
        <FlatList
            numColumns={3}
            data={dialPad}
            style={{ flexGrow: 1 }}
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
                                    }}>
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

const SendMoney = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [amount, setAmount] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [code, setCode] = useState<number[]>([]);

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <CustomHeader
                    title="Send Money"
                    onBack={() => navigation.goBack()}
                />
                <View style={styles.viewContainer}>
                    <Image
                        source={images.avatar}
                        resizeMode="contain"
                        style={styles.avatar}
                    />
                    <Text style={styles.userName}>Ninatonia siance</Text>
                    <Text style={styles.userEmail}>Ninatoniasiance3@gmail.com</Text>

                    <View style={styles.cardBalance}>
                        <View>
                            <Text style={styles.balanceText}>My Balance</Text>
                            <Text style={styles.balanceNum}>$88,000</Text>
                        </View>
                        <Image
                            source={icons.creditCardOutline2}
                            resizeMode='contain'
                            style={styles.topupIcon}
                        />
                    </View>

                    <Pressable style={styles.cardItem} onPress={() => {/* handle card tap */ }}>
                        <Image
                            source={images.mastercard}
                            style={styles.cardIcon}
                        />
                        <View style={styles.cardText}>
                            <Text style={styles.cardHolder}>mangcoding</Text>
                            <Text style={styles.cardNumber}>**** **** **** *676</Text>
                        </View>
                    </Pressable>

                    {/* Amount Input */}
                    <View style={styles.amountContainer}>
                        <View style={styles.viewSign}>
                            <Text style={styles.usdSign}>$</Text>
                            <TextInput
                                style={styles.amountInput}
                                value={amount}
                                onChangeText={setAmount}
                                placeholder="0"
                                keyboardType="numeric"
                                placeholderTextColor="#ccc"
                            />
                        </View>
                        <View style={styles.separateLine} />
                        <Text style={styles.amountLabel}>Enter an amount</Text>
                    </View>

                    <Button
                        title="Confirmation"
                        filled
                        style={{
                            width: SIZES.width - 32,
                            marginTop: 48
                        }}
                        onPress={() => setModalVisible(true)}
                    />

                    {/* Success Modal */}
                    <Modal transparent visible={modalVisible} animationType="slide">
                        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.title}>Enter your PIN</Text>

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
                                                        setTimeout(() => {
                                                            setModalVisible(false);
                                                            navigation.navigate('sendmoneysuccess')
                                                        }, 2000)

                                                    }
                                                    return newCode;
                                                });
                                            }
                                        }}
                                    />

                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16
    },
    viewContainer: {
        alignItems: 'center'
    },
    avatar: {
        height: 112,
        width: 112,
        borderRadius: 999
    },
    userName: {
        fontFamily: "bold",
        fontSize: 14,
        color: COLORS.shadesBlack,
        marginVertical: 12
    },
    userEmail: {
        fontSize: 12,
        fontFamily: "regular",
        color: COLORS.neutralBlack
    },
    cardBalance: {
        height: 82,
        width: SIZES.width - 32,
        borderRadius: 16,
        backgroundColor: "#212121",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        alignItems: 'center',
        marginVertical: 12
    },
    balanceText: {
        fontSize: 14,
        fontFamily: "regular",
        color: COLORS.white,
        marginBottom: 10
    },
    balanceNum: {
        fontSize: 14,
        fontFamily: "bold",
        color: COLORS.white
    },
    topupIcon: {
        height: 32,
        width: 32,
        tintColor: COLORS.white
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        borderRadius: 999,
        padding: 16,
        width: SIZES.width - 32
    },
    cardIcon: {
        width: 40,
        height: 40,
    },
    cardText: {
        marginLeft: 12,
    },
    cardHolder: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.shadesBlack,
    },
    cardNumber: {
        fontSize: 14,
        fontFamily: "regular",
        color: COLORS.neutralBlack,
        marginTop: 4,
    },
    amountContainer: { alignItems: 'center', marginTop: 30 },
    amountInput: {
        fontSize: 36,
        fontWeight: '700',
        textAlign: 'center',
        borderColor: '#ccc',
    },
    amountLabel: { fontSize: 14, color: '#8e8e93', marginTop: 4 },
    separateLine: {
        width: SIZES.width - 32,
        height: .2,
        backgroundColor: COLORS.neutralBlack,
        marginVertical: 12
    },
    usdSign: {
        fontSize: 36,
        fontWeight: '700',
    },
    viewSign: {
        flexDirection: "row",
        alignItems: "center"
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
    title: {
        fontSize: 24,
        fontFamily: "bold",
        color: COLORS.shadesBlack,
        marginBottom: 16
    }
})

export default SendMoney