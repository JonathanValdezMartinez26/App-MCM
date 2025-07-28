import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,  Share, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, images, SIZES } from '@/constants';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';

const CARD_WIDTH = SIZES.width - 40;
const NOTCH_WIDTH = 20;
const NOTCH_HEIGHT = 40;

export default function TransferSuccessScreen() {
    const navigation = useNavigation<NavigationProp<any>>();
    const data = {
        from: 'MangCoding',
        to: 'Ninatonia Siance',
        transactionId: '#01242424',
        dateTime: '06 Sep 2024 / 05.05 am',
        nominal: '$12,00',
        fee: '$0',
        total: '$12,00',
    };

    const onShare = async () => {
        try {
            await Share.share({
                message: `Payment of ${data.nominal} to ${data.to} was successful. Transaction ID ${data.transactionId}.`,
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    return (
        <View style={styles.area}>
            <ScrollView showsVerticalScrollIndicator={false}>
                
                {/* Top Blue Section */}
                <View style={styles.topSection}>
                    <View style={styles.headerContainer}>
                        <View style={styles.checkCircle}>
                            <Image
                                source={images.success2}
                                resizeMode="contain"
                                style={styles.successImage}
                            />
                        </View>
                        <Text style={styles.title}>Payment Success!</Text>
                        <Text style={styles.subtitle}>
                            Your transaction has been successful, well done!
                        </Text>
                    </View>
                </View>

                {/* Bottom White Section */}
                <View style={styles.bottomSection}>

                    {/* Details Card */}
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.label}>From</Text>
                            <Text style={styles.value}>{data.from}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>To</Text>
                            <Text style={styles.value}>{data.to}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Transaction ID</Text>
                            <Text style={styles.value}>{data.transactionId}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Date & Time</Text>
                            <Text style={styles.value}>{data.dateTime}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Nominal</Text>
                            <Text style={styles.value}>{data.nominal}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Fee</Text>
                            <Text style={styles.value}>{data.fee}</Text>
                        </View>
                        <View style={[styles.row, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total Payment</Text>
                            <Text style={styles.totalValue}>{data.total}</Text>
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => {
                                navigation.navigate('(tabs)') 
                            }}>
                            <Text style={styles.backText}>Back to Home</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
                            <Ionicons
                                name="share-outline"
                                size={20}
                                color={COLORS.neutralBlack}
                                style={styles.shareIcon}
                            />
                            <Text style={styles.shareText}>Share</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    area: { flex: 1, backgroundColor: COLORS.white },
    topSection: {
        backgroundColor: COLORS.primary,
        paddingTop: 63,
        alignItems: 'center',
        paddingBottom: 78
    },
    headerContainer: { alignItems: 'center' },
    checkCircle: { marginBottom: 16 },
    successImage: {
        width: 126,
        height: 126
    },
    title: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.white,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.white,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    bottomSection: {
        flex: 1,
        backgroundColor: COLORS.white,
        position: 'relative',
        paddingTop: 20,
        alignItems: 'center',
    },
    notchLeft: {
        position: 'absolute',
        top: 0,
        left: (SIZES.width - CARD_WIDTH) / 2 - NOTCH_WIDTH / 2,
        width: NOTCH_WIDTH,
        height: NOTCH_HEIGHT,
        backgroundColor: COLORS.primary,
        borderRadius: NOTCH_WIDTH / 2,
    },
    notchRight: {
        position: 'absolute',
        top: 0,
        right: (SIZES.width - CARD_WIDTH) / 2 - NOTCH_WIDTH / 2,
        width: NOTCH_WIDTH,
        height: NOTCH_HEIGHT,
        backgroundColor: COLORS.primary,
        borderRadius: NOTCH_WIDTH / 2,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginTop: NOTCH_HEIGHT / 2,
        top: -100,
        zIndex: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: -80
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    label: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.shadesBlack,
    },
    value: {
        fontSize: 14,
        fontFamily: 'semiBold',
        color: COLORS.shadesBlack,
    },
    totalRow: {
        borderTopWidth: 1,
        borderColor: '#eee',
        marginTop: 32,
        paddingTop: 12,
    },
    totalLabel: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.shadesBlack,
    },
    totalValue: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.shadesBlack,
    },
    actions: {
        width: CARD_WIDTH,
        marginTop: 30,
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: COLORS.primary,
        width: '100%',
        paddingVertical: 14,
        borderRadius: 28,
        alignItems: 'center',
        marginBottom: 12,
    },
    backText: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: 'semiBold',
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.neutralBlack,
        borderRadius: 28,
        paddingVertical: 12,
        width: '100%',
        justifyContent: 'center',
    },
    shareIcon: { marginRight: 8 },
    shareText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.neutralBlack,
    },
});
