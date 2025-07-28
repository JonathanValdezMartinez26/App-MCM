import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/constants';
import { transactions } from '@/data';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';

const CHART_HEIGHT = 120;
const CHART_WIDTH = SIZES.width - 40;

// Label sets
const weeklyLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthlyLabels = ['Wk1', 'Wk2', 'Wk3', 'Wk4'];
const yearlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Data sets
const weeklyData = [1200, 800, 1000, 900, 1100, 1500, 1300];
const prevWeeklyData = [1000, 900, 1100, 800, 1200, 1400, 1000];
const monthlyData = [4000, 4500, 4200, 4800];
const prevMonthlyData = [3800, 4300, 4000, 4600];
const yearlyData = [8000, 9000, 8500, 9500, 10000, 11000, 10500, 11500, 12000, 12500, 13000, 13500];
const prevYearlyData = [7500, 8500, 8000, 9000, 9500, 10000, 9900, 11000, 11500, 12000, 12500, 13000];

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: string;
  icon: any;
}

function calcSum(arr: number[]) {
  return arr.reduce((sum, v) => sum + v, 0);
}

export default function SpendingScreen() {
  const [period, setPeriod] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Weekly');
  const navigation = useNavigation<NavigationProp<any>>();

  // Select current and previous data based on period
  const [currentData, prevData, labels] =
    period === 'Weekly'
      ? [weeklyData, prevWeeklyData, weeklyLabels]
      : period === 'Monthly'
        ? [monthlyData, prevMonthlyData, monthlyLabels]
        : [yearlyData, prevYearlyData, yearlyLabels];

  const maxValue = Math.max(...currentData);
  const currentSum = calcSum(currentData);
  const prevSum = calcSum(prevData);
  const diff = currentSum - prevSum;
  const diffPercent = prevSum > 0 ? Math.round((diff / prevSum) * 100) : 0;
  const isPositive = diff >= 0;
  const summaryText =
    `You spent ${Math.abs(diffPercent)}% ${isPositive ? 'more' : 'less'} than ${period === 'Weekly'
      ? 'last week'
      : period === 'Monthly'
        ? 'last month'
        : 'last year'
    }`;

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.txnRow}>
      <Image source={item.icon} style={styles.txnIcon} />
      <View style={styles.txnDetails}>
        <Text style={styles.txnTitle}>{item.title}</Text>
        <Text style={styles.txnDate}>{item.date}</Text>
      </View>
      <Text style={[
        styles.txnAmount,
        item.amount.startsWith('+') ? styles.positive : styles.negative
      ]}>
        {item.amount}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.monthText}>January 2024</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </View>

        {/* Period Toggle */}
        <View style={styles.toggleContainer}>
          {(['Weekly', 'Monthly', 'Yearly'] as const).map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.toggleButton,
                period === item && styles.toggleButtonActive,
              ]}
              onPress={() => setPeriod(item)}
            >
              <Text
                style={
                  period === item
                    ? styles.toggleTextActive
                    : styles.toggleTextInactive
                }
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.amountText}>${currentSum.toLocaleString()}</Text>
          <Text style={styles.subText}>{summaryText}</Text>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          {currentData.map((value, index) => {
            const height = (value / maxValue) * CHART_HEIGHT;
            const isActive = period === 'Weekly' && index === 5; // highlight Friday only in Weekly
            return (
              <View key={index} style={styles.barItem}>
                <View style={[styles.bar, { height }, isActive && styles.barActive]} />
                <Text style={styles.barLabel}>{labels[index]}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.bottomContainer}>
          {/* Transactions List */}
          <View style={styles.txnHeader}>
            <Text style={styles.txnHeaderTitle}>Transaction</Text>
            <TouchableOpacity onPress={()=>navigation.navigate("transaction")}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={renderTransaction}
            contentContainerStyle={styles.txnList}
            showsVerticalScrollIndicator={false}
          />
        </View>

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
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  monthText: {
    fontSize: 18,
    fontFamily: 'bold',
    marginRight: 6,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: "space-between",
    width: SIZES.width - 32
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 4,
    backgroundColor: '#fff',
    width: (SIZES.width - 64) / 3,
    alignItems: "center"
  },
  toggleButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  toggleTextActive: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'bold',
  },
  toggleTextInactive: {
    color: '#8e8e93',
    fontSize: 14,
    fontFamily: "regular"
  },
  summaryContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  amountText: {
    fontSize: 32,
    fontFamily: 'bold',
    color: COLORS.greyscale900
  },
  subText: {
    fontSize: 14,
    fontFamily: "regular",
    color: '#8e8e93',
    marginTop: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: CHART_HEIGHT + 20,
    marginTop: 30,
    width: CHART_WIDTH,
    alignSelf: 'center',
  },
  barItem: {
    alignItems: 'center',
  },
  bar: {
    width: 20,
    backgroundColor: '#e0e0e5',
    borderRadius: 4,
  },
  barActive: {
    backgroundColor: '#407BFF',
  },
  barLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#8e8e93',
    fontFamily: "regular"
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  txTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  txInfo: {
    flex: 1,
    marginLeft: 12,
  },
  txName: {
    fontSize: 16,
    fontWeight: '500',
  },
  txTime: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 2,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e0e0e5',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 2,
  },
  fabContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#407BFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  txnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 12,
  },
  txnHeaderTitle: {
    fontSize: 18,
    color: '#1E293B',
    fontWeight: '600'
  },
  viewAll: {
    fontSize: 14,
    color: COLORS.shadesBlack,
    fontFamily: "regular"
  },
  txnDateLabel: {
    marginHorizontal: 20,
    fontSize: 12,
    color: '#94A3B8',
    marginVertical: 12
  },
  txnList: {
    paddingBottom: 80
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12
  },
  txnIcon: {
    width: 40,
    height: 40,
    borderRadius: 8
  },
  txnDetails: {
    flex: 1,
    marginLeft: 12
  },
  txnTitle: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500'
  },
  txnDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  txnAmount: {
    fontSize: 16,
    fontWeight: '600'
  },
  positive: { color: '#10B981' },
  negative: { color: '#EF4444' },
  scanBtn: {
    position: 'absolute',
    bottom: 45,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3366FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  tabActive: {
    color: '#3366FF'
  },
  placeholder: {
    width: SIZES.width / 5
  },
  bellView: {
    width: 8,
    height: 8,
    borderRadius: 9999,
    backgroundColor: "red",
    position: "absolute",
    top: 6,
    right: 10,
    zIndex: 999
  },
  eyeBtn: {
    marginLeft: 4
  },
  actionItemView: {
    height: 54,
    width: 54,
    borderColor: "#E3E3E3",
    borderWidth: 1,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center"
  },
  bottomContainer: {
    backgroundColor: COLORS.white,
    flex: 1,
    paddingTop: 12
  }
});