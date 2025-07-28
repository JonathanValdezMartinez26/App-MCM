import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import React from 'react';
import CustomHeader from '@/components/CustomHeader';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, icons } from '@/constants';
import { Ionicons } from '@expo/vector-icons';

const TopupScreen = () => {
    const navigation = useNavigation<NavigationProp<any>>();

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <CustomHeader
                    title="Topup"
                    onBack={() => navigation.goBack()}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginVertical: 12 }}>
                        <Text style={styles.headerTitle}>How would like to topup ?</Text>
                        <Text style={styles.headerSubtitle}>Choose your account topup</Text>
                    </View>
                    <Text style={styles.subtitle}>Bank Transfer</Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("topupamount")}
                        style={styles.cardRow}>
                        <View style={styles.cardLeft}>
                            <Image source={icons.mastercard2} resizeMode='contain' style={styles.cardImage} />
                            <Text style={styles.cardText}>Mastercard</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.shadesBlack} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("topupamount")}
                        style={styles.cardRow}>
                        <View style={styles.cardLeft}>
                            <Image source={icons.alfabank} resizeMode='contain' style={styles.cardImage} />
                            <Text style={styles.cardText}>Alfa Bank</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.shadesBlack} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("topupamount")}
                        style={styles.cardRow}>
                        <View style={styles.cardLeft}>
                            <Image source={icons.paypal2} resizeMode='contain' style={styles.cardImage} />
                            <Text style={styles.cardText}>Paypal</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.shadesBlack} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("topupamount")}
                        style={styles.cardRow}>
                        <View style={styles.cardLeft}>
                            <Image source={icons.sberbank} resizeMode='contain' style={styles.cardImage} />
                            <Text style={styles.cardText}>Sberbank</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.shadesBlack} />
                    </TouchableOpacity>

                    <Text style={styles.subtitle}>Credit Card</Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("addnewcard")}
                        style={styles.cardRow}>
                        <View style={styles.cardLeft}>
                            <View style={styles.addBtn}>
                                <Image source={icons.plus2} resizeMode='contain' style={styles.addBtnIcon} />
                            </View>
                            <Text style={styles.cardText}>Add New Card Bank</Text>
                        </View>
                    </TouchableOpacity>

                </ScrollView>
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
    headerTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.shadesBlack,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: "regular",
        marginTop: 8,
        lineHeight: 20,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "semiBold",
        color: COLORS.shadesBlack,
        marginVertical: 16
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        backgroundColor: "#F5F5F5",
        borderRadius: 32,
        marginBottom: 6,
        height: 52
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cardText: {
        fontSize: 14,
        color: COLORS.shadesBlack,
        marginLeft: 12,
        fontFamily: "semiBold"
    },
    cardImage: {
        height: 40,
        width: 40
    },
    addBtn: {
        height: 40,
        width: 40,
        backgroundColor: COLORS.shadesBlack,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center"
    },
    addBtnIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.white
    }
})

export default TopupScreen