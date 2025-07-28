import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, images } from '@/constants';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';


export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={styles.area}>
      <ScrollView style={styles.container}>
        {/* Top blue header & avatar */}
        <View style={styles.headerBackground} />

        <View style={styles.avatarContainer}>
          <Image source={images.avatar} style={styles.avatar} />
        </View>

        {/* User info */}
        <View style={styles.infoContainer}>
          <Text style={styles.username}>MangCoding</Text>
          <View style={styles.membershipContainer}>
            <Ionicons name="flash-outline" size={16} color="#FFCD51" />
            <Text style={styles.membershipText}>  Gold Member</Text>
          </View>
        </View>

        {/* Contact details */}
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>+62 8965 5432 1212</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>hello@mangcoding.com</Text>
          </View>
        </View>

        {/* Account Details section */}
        <Text style={styles.sectionTitle}>Account Details</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardLeft}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.shadesBlack} />
              <Text style={styles.cardText}>Notification</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#ccc', true: "#0EBE1F" }}
              thumbColor="#fff"
            />
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("transaction")}
            style={styles.cardRow}>
            <View style={styles.cardLeft}>
              <Ionicons name="time-outline" size={20} color={COLORS.shadesBlack} />
              <Text style={styles.cardText}>Transaction</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.shadesBlack} />
          </TouchableOpacity>
        </View>

        {/* Account Setting section */}
        <Text style={styles.sectionTitle}>Account Setting</Text>
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => navigation.navigate("editprofile")}
            style={styles.cardRow}>
            <View style={styles.cardLeft}>
              <Ionicons name="person-outline" size={20} color={COLORS.shadesBlack} />
              <Text style={styles.cardText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.shadesBlack} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("editpassword")}
            style={styles.cardRow}>
            <View style={styles.cardLeft}>
              <Ionicons name="key-outline" size={20} color={COLORS.shadesBlack} />
              <Text style={styles.cardText}>Edit Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.shadesBlack} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("editpin")}
            style={styles.cardRow}>
            <View style={styles.cardLeft}>
              <Ionicons name="key-outline" size={20} color={COLORS.shadesBlack} />
              <Text style={styles.cardText}>Edit PIN</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.shadesBlack} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardRow}>
            <View style={styles.cardLeft}>
              <Ionicons name="exit-outline" size={20} color={COLORS.error} />
              <Text style={[styles.cardText, { color: COLORS.error }]}>Log out Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  headerBackground: {
    height: 150,
    backgroundColor: COLORS.primary
  },
  avatarContainer: {
    position: 'absolute',
    top: 150 - 50,
    alignSelf: 'center'
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: '#fff'
  },
  infoContainer: {
    marginTop: 70,
    alignItems: 'center'
  },
  username: {
    fontSize: 18,
    fontFamily: 'bold',
    color: COLORS.shadesBlack
  },
  membershipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  membershipText: {
    fontSize: 14,
    color: COLORS.shadesBlack,
    fontFamily: "regular"
  },
  detailContainer: {
    marginTop: 12,
    paddingHorizontal: 16
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.neutralBlack
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: COLORS.shadesBlack
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: COLORS.shadesBlack,
    marginTop: 12,
    marginBottom: 8,
    marginHorizontal: 16
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 6
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 32,
    marginBottom: 6,
    height: 48
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardText: {
    fontSize: 14,
    color: COLORS.shadesBlack,
    marginLeft: 12
  },
});
