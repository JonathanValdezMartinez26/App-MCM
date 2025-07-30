import { View, Text, StyleSheet, TextInput, TouchableOpacity, SectionList, Image, SafeAreaView } from 'react-native';
import React, { useMemo, useState } from 'react';
import CustomHeader from '@/components/CustomHeader';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, icons, images } from '@/constants';
import { Ionicons } from '@expo/vector-icons';

const FILTERS = ['All', 'Withdraw', 'Transfer', 'Topup'] as const;
type FilterType = typeof FILTERS[number];

type Transaction = {
    id: string;
    type: FilterType;
    title: string;
    dateLabel: string;
    dateTime: string;
    icon: any;
    amount: string;
};

const allTransactions: Transaction[] = [
    { id: '1', type: 'Withdraw', title: 'YouTube Pro', dateLabel: 'October 15, 2024', dateTime: 'Oct 15, 11:00 AM', icon: icons.youtube, amount: '-$80' },
    { id: '2', type: 'Withdraw', title: 'Netflix', dateLabel: 'October 15, 2024', dateTime: 'Oct 15, 11:00 AM', icon: icons.netflix, amount: '-$60' },
    { id: '3', type: 'Withdraw', title: 'Slack', dateLabel: 'October 15, 2024', dateTime: 'Oct 15, 11:00 AM', icon: icons.slack, amount: '-$90' },
    { id: '4', type: 'Transfer', title: 'Sintia', dateLabel: 'October 15, 2024', dateTime: 'Oct 15, 11:00 AM', icon: images.user1, amount: '+$250' },

    { id: '5', type: 'Withdraw', title: 'YouTube Pro', dateLabel: 'Mei 12, 2024', dateTime: 'Mei 12, 11:00 AM', icon: icons.youtube, amount: '-$80' },
    { id: '6', type: 'Withdraw', title: 'Netflix', dateLabel: 'Mei 12, 2024', dateTime: 'Mei 12, 11:00 AM', icon: icons.netflix, amount: '-$60' },
    { id: '7', type: 'Withdraw', title: 'Slack', dateLabel: 'Mei 12, 2024', dateTime: 'Mei 12, 11:00 AM', icon: icons.slack, amount: '-$90' },
    { id: '8', type: 'Topup', title: 'Google Pay', dateLabel: 'Mei 12, 2024', dateTime: 'Mei 12, 11:00 AM', icon: icons.google, amount: '+$320' },
];

const Transaction = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<FilterType>('All');

    const filtered = useMemo(() => {
        return allTransactions.filter(txn => {
            const matchesFilter = filter === 'All' || txn.type === filter;
            const lower = searchTerm.toLowerCase();
            const matchesSearch =
                txn.title.toLowerCase().includes(lower) ||
                txn.dateLabel.toLowerCase().includes(lower) ||
                txn.amount.includes(searchTerm);
            return matchesFilter && matchesSearch;
        });
    }, [searchTerm, filter]);

    const sections = useMemo(() => {
        const groups: Record<string, Transaction[]> = {};
        filtered.forEach(txn => {
            if (!groups[txn.dateLabel]) groups[txn.dateLabel] = [];
            groups[txn.dateLabel].push(txn);
        });
        return Object.entries(groups).map(([title, data]) => ({ title, data }));
    }, [filtered]);

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <CustomHeader
                    title="Transaction"
                    onBack={() => navigation.goBack()}
                />
                <View>
                    {/* Search */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search-outline" size={20} color={COLORS.shadesBlack} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search"
                            placeholderTextColor={COLORS.shadesBlack}
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                        />
                    </View>

                    {/* Filters */}
                    <View style={styles.filterContainer}>
                        {FILTERS.map(f => {
                            const active = f === filter;
                            return (
                                <TouchableOpacity
                                    key={f}
                                    style={[styles.filterButton, active && styles.filterButtonActive]}
                                    onPress={() => setFilter(f)}
                                >
                                    <Text style={active ? styles.filterTextActive : styles.filterText}>
                                        {f}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Transactions List */}
                    <SectionList
                        sections={sections}
                        keyExtractor={item => item.id}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={styles.sectionHeader}>{title}</Text>
                        )}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <View style={styles.row}>
                                <Image source={item.icon} style={styles.icon} />
                                <View style={styles.info}>
                                    <Text style={styles.titleText}>{item.title}</Text>
                                    <Text style={styles.timeText}>{item.dateTime}</Text>
                                </View>
                                <Text style={[styles.amountText, item.amount.startsWith('-') ? styles.negative : styles.positive]}>
                                    {item.amount}
                                </Text>
                            </View>
                        )}
                        // turn off sticky headers so each date scrolls away normally
                        stickySectionHeadersEnabled={false}

                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        ListEmptyComponent={() => (
                            <Text style={styles.emptyText}>No transactions found</Text>
                        )}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 24,
        borderColor: "#E3E3E3",
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        height: 52,
        marginBottom: 6,
        marginTop: 16
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: COLORS.shadesBlack
    },
    filterContainer: {
        flexDirection: 'row',
        marginTop: 12,
        marginHorizontal: 16
    },
    filterButton: {
        flex: 1,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#BDBDBD",
        borderRadius: 20,
        marginRight: 8,
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: COLORS.shadesBlack,
        borderColor: COLORS.shadesBlack
    },
    filterText: {
        fontSize: 14,
        color: "#BDBDBD",
        fontFamily: "regular"
    },
    filterTextActive: {
        fontSize: 14,
        color: COLORS.white
    },
    sectionHeader: {
        marginTop: 16,
        marginHorizontal: 16,
        fontSize: 14,
        color: COLORS.neutralBlack
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: COLORS.white
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12
    },
    info: {
        flex: 1
    },
    titleText: {
        fontSize: 14,
        fontFamily: 'semiBold',
        color: COLORS.shadesBlack,
        marginBottom: 6
    },
    timeText: {
        fontSize: 12,
        color: COLORS.shadesBlack,
        marginTop: 2
    },
    amountText: {
        fontSize: 16,
        fontFamily: 'bold'
    },
    negative: {
        color: COLORS.error
    },
    positive: {
        color: COLORS.success
    },
    separator: {
        height: 0,
        backgroundColor: COLORS.neutralBlack,
        marginLeft: 68
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: COLORS.shadesBlack
    },
})

export default Transaction