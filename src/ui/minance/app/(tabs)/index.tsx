import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, StatusBar, Image, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, icons, images, SIZES } from '@/constants';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { transactions } from '@/data';

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: string;
  icon: any;
}

const HomeScreen: React.FC = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const navigation = useNavigation<NavigationProp<any>>();
  const toggleBalance = () => setBalanceVisible(v => !v);

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <Image source={images.avatar} style={styles.avatar} />
        <Text style={styles.username}>Mangcoding</Text>
        <Pressable
          onPress={() => navigation.navigate("notifications")}
          style={styles.bellBtn}>
          <View style={styles.bellView} />
          <Ionicons name="notifications-outline" size={22} color="white" />
        </Pressable>
      </View>

      {/* Balance */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceValue}>
            {balanceVisible ? '$100.000' : '•••••••'}
          </Text>
          <Pressable style={styles.eyeBtn} onPress={toggleBalance}>
            <Ionicons
              name={balanceVisible ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="white"
            />
          </Pressable>
        </View>
        <Pressable style={styles.currencySelector}>
          <Image source={icons.usFlag} style={styles.flag} />
          <Text style={styles.currencyText}>US Dollar</Text>
          <Ionicons name="chevron-down" size={18} color="white" />
        </Pressable>
      </View>

      {/* Actions Card */}
      <View style={styles.actionsCard}>
        <TouchableOpacity
          onPress={() => navigation.navigate("receivemoneyqrcode")}
          style={styles.actionBtn}>
          <View style={styles.actionItemView}>
            <MaterialCommunityIcons name="arrow-bottom-left" size={20} color="#111111" />
          </View>
          <Text style={styles.actionLabel}>Receive</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("transfer")}
          style={styles.actionBtn}>
          <View style={styles.actionItemView}>
            <MaterialCommunityIcons name="arrow-top-right" size={20} color="#111111" />
          </View>
          <Text style={styles.actionLabel}>Transfer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("topup")}
          style={styles.actionBtn}>
          <View style={styles.actionItemView}>
            <AntDesign name="swap" size={20} color="#111111" />
          </View>
          <Text style={styles.actionLabel}>Top Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("morefeatures")}
          style={styles.actionBtn}>
          <View style={styles.actionItemView}>
            <Ionicons name="grid-outline" size={20} color="#111111" />
          </View>
          <Text style={styles.actionLabel}>More</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        {/* Transactions List */}
        <View style={styles.txnHeader}>
          <Text style={styles.txnHeaderTitle}>Transaction</Text>
          <TouchableOpacity onPress={()=>navigation.navigate("transaction")}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.txnDateLabel}>April 12, 2024</Text>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={renderTransaction}
          contentContainerStyle={styles.txnList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: COLORS.white,
    borderWidth: 1
  },
  username: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
    fontSize: 16,
    fontFamily: 'bold'
  },
  bellBtn: {
    borderColor: COLORS.white,
    borderRadius: 999,
    borderWidth: 1,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  balanceSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5
  },
  balanceValue: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700'
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  flag: {
    width: 24,
    height: 24,
    marginRight: 8
  },
  currencyText: {
    color: 'white',
    fontSize: 16,
    marginRight: 4
  },
  actionsCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
    marginBottom: -32,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  actionBtn: {
    alignItems: 'center'
  },
  actionLabel: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.shadesBlack,
    fontFamily: "regular"
  },
  txnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginHorizontal: 20
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
    paddingHorizontal: 20,
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
    paddingTop: 28
  }
});
