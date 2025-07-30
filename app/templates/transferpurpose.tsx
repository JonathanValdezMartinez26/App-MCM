import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import CustomHeader from '@/components/CustomHeader';
import { COLORS, SIZES } from '@/constants';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/Button';

const CARD_WIDTH = (SIZES.width - 48) / 2;

type Purpose = {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
};

const purposes: Purpose[] = [
    { id: 'personal', title: 'Personal', subtitle: 'Pay your friend or family', icon: 'person-outline' },
    { id: 'payment', title: 'Payment', subtitle: 'Pay your employee', icon: 'card-outline' },
    { id: 'business', title: 'Bussines', subtitle: 'Pay your employee', icon: 'briefcase-outline' },
];

const TransferPurpose = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [selected, setSelected] = useState<string>('personal');

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <CustomHeader
                    title="Transfer"
                    onBack={() => navigation.goBack()}
                />
                <View style={styles.content}>
                    <Text style={styles.headerTitle}>Select a purpose</Text>
                    <Text style={styles.headerSubtitle}>Search or select your recipient to send money</Text>
                    <View style={styles.optionsContainer}>
                        {purposes.map(p => {
                            const active = p.id === selected;
                            return (
                                <TouchableOpacity
                                    key={p.id}
                                    style={[styles.card, active && styles.cardActive]}
                                    onPress={() => setSelected(p.id)}
                                >
                                    <Ionicons
                                        name={p.icon}
                                        size={32}
                                        color={active ? COLORS.white : "#111111"}
                                        style={styles.icon}
                                    />
                                    <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>
                                        {p.title}
                                    </Text>
                                    <Text style={[styles.cardSubtitle, active && styles.cardSubtitleActive]}>
                                        {p.subtitle}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
                <Button
                    filled
                    title="Continue"
                    onPress={() => navigation.navigate("transferamount")}
                />
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
    content: {
        flex: 1,
        paddingTop: 24,
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
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 20
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_WIDTH,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.grayscale400,
    },
    cardActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    icon: {
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.shadesBlack,
        marginBottom: 4,
    },
    cardTitleActive: {
        color: COLORS.white,
    },
    cardSubtitle: {
        fontSize: 12,
        color: COLORS.neutralBlack,
        fontFamily: "regular"
    },
    cardSubtitleActive: {
        color: COLORS.white,
    },
})

export default TransferPurpose