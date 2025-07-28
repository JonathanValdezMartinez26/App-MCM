import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share, SafeAreaView } from 'react-native';
import React from 'react';
import CustomHeader from '@/components/CustomHeader';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, icons } from '@/constants';
import QRCode from 'react-native-qrcode-svg';

const ReceiveMoneyQrCode = () => {
    const navigation = useNavigation<NavigationProp<any>>();

    const onShare = async () => {
            try {
                await Share.share({
                    message: `Payment of `,
                });
            } catch (error) {
                console.error('Share error:', error);
            }
    };

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <CustomHeader title="Receive" onBack={() => navigation.goBack()} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginVertical: 16 }}>
                        <Text style={styles.headerTitle}>Payment with QR</Text>
                        <Text style={styles.headerSubtitle}>
                            You can get paid by showing the QR code or you can create by entering the amount
                        </Text>
                    </View>
                    <View style={styles.qrCodeContainer}>
                        <QRCode
                            value="@alexandermichael"
                            size={220}
                        />
                    </View>
                    <View style={styles.viewContainer}>
                        <View style={styles.viewIcon}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("receivemoneychooserecipient")}
                                style={styles.qrIconContainer}>
                                <Image
                                    source={icons.qr2}
                                    resizeMode='contain'
                                    style={styles.qrIcon}
                                />
                            </TouchableOpacity>
                            <Text style={styles.qrText}>Receive</Text>
                        </View>
                        <View style={styles.viewIcon}>
                            <TouchableOpacity 
                             onPress={onShare}
                             style={[styles.qrIconContainer, { borderColor: COLORS.neutralBlack }]}>
                                <Image
                                    source={icons.shareOutline}
                                    resizeMode='contain'
                                    style={[styles.qrIcon, {
                                        tintColor: COLORS.neutralBlack
                                    }]}
                                />
                            </TouchableOpacity>
                            <Text style={styles.qrText}>share</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
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
    headerTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.shadesBlack,
        textAlign: "center"
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: "regular",
        marginTop: 8,
        lineHeight: 20,
        textAlign: "center"
    },
    qrCodeContainer: {
        height: 240,
        width: 240,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 64,
        marginBottom: 12,
        alignSelf: "center"
    },
    qrIconContainer: {
        height: 48,
        width: 48,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8
    },
    qrIcon: {
        height: 20,
        width: 20,
        tintColor: COLORS.primary
    },
    qrText: {
        fontSize: 12,
        fontFamily: "regular",
        color: COLORS.shadesBlack
    },
    viewIcon: {
        alignItems: 'center',
        marginHorizontal: 12
    },
    viewContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginVertical: 48
    }
})

export default ReceiveMoneyQrCode