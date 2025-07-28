import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, SectionList, TouchableOpacity, Image } from 'react-native';
import { COLORS, icons, images } from '@/constants';
import CustomHeader from '@/components/CustomHeader';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';

const FILTERS = ['All', 'Withdraw', 'Transfer', 'Top up'] as const;
type FilterType = typeof FILTERS[number];

type Notification = {
    id: string;
    type: Exclude<FilterType, 'All'>;
    title: string;
    date: string; // e.g., 'April 12, 2026'
    icon: any;
};

const notifications: Notification[] = [
    { id: '1', type: 'Withdraw', title: 'Withdraw success to your Paypal', date: 'April 12, 2026', icon: icons.paypal },
    { id: '2', type: 'Transfer', title: 'Transfer success to Tania', date: 'April 12, 2026', icon: images.avatar },
    { id: '8', type: 'Withdraw', title: 'Withdraw success to your Google Pay', date: 'April 12, 2026', icon: icons.google },
    { id: '3', type: 'Transfer', title: 'Transfer success to John', date: 'April 12, 2026', icon: images.avatar },
    { id: '9', type: 'Withdraw', title: 'Withdraw success to your Youtube Adsense', date: 'April 12, 2026', icon: icons.youtube2 },
    { id: '4', type: 'Top up', title: 'Top up success via Credit Card', date: 'April 12, 2026', icon: icons.topup },
    { id: '5', type: 'Withdraw', title: 'Withdraw success to your Paypal', date: 'April 11, 2026', icon: icons.paypal },
    { id: '6', type: 'Transfer', title: 'Transfer success to Alex', date: 'April 11, 2026', icon: images.avatar },
    { id: '7', type: 'Transfer', title: 'Transfer success to Netflix', date: 'April 11, 2026', icon: icons.netflix },
];

export default function NotificationScreen() {
    const [filter, setFilter] = useState<FilterType>('All');
    const navigation = useNavigation<NavigationProp<any>>();

    // Filter and group notifications by date
    const sections = useMemo(() => {
        const filtered =
            filter === 'All'
                ? notifications
                : notifications.filter((n) => n.type === filter);

        // group by date
        const grouped: { [date: string]: Notification[] } = {};
        filtered.forEach((n) => {
            if (!grouped[n.date]) grouped[n.date] = [];
            grouped[n.date].push(n);
        });

        return Object.entries(grouped).map(([date, data]) => ({ title: date, data }));
    }, [filter]);

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <CustomHeader title="Notifications" onBack={() => navigation.goBack()} />

                {/* Filter toggles */}
                <View style={styles.filterContainer}>
                    {FILTERS.map((f) => {
                        const active = filter === f;
                        return (
                            <TouchableOpacity
                                key={f}
                                style={[
                                    styles.filterButton,
                                    active && styles.filterButtonActive,
                                ]}
                                onPress={() => setFilter(f)}>
                                <Text style={active ? styles.filterTextActive : styles.filterText}>
                                    {f}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Notification list */}
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.sectionHeader}>{title}</Text>
                    )}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <Image source={item.icon} style={styles.itemIcon} />
                            <View style={styles.itemTextContainer}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemDate}>{item.date}</Text>
                            </View>
                        </View>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />
            </View>
        </SafeAreaView>
    );
}

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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    backButton: {
        marginRight: 16
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'bold'
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 8,
        backgroundColor: '#fff',
    },
    filterButtonActive: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    filterText: {
        fontSize: 14,
        color: '#8e8e93',
        fontFamily: "regular"
    },
    filterTextActive: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'bold'
    },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 14,
        color: '#8e8e93',
        backgroundColor: '#f9f9f9',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    itemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12
    },
    itemTextContainer: {
        flex: 1
    },
    itemTitle: {
        fontSize: 14,
        fontFamily: 'semiBold',
        color: COLORS.shadesBlack,
        marginBottom: 8
    },
    itemDate: {
        fontSize: 12,
        color: '#8e8e93',
        marginTop: 2,
        fontFamily: "regular"
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginLeft: 68
    },
});
