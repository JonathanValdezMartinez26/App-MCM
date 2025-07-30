import { View, Text, StyleSheet, Pressable, Image, SafeAreaView } from 'react-native';
import React from 'react';
import CustomHeader from '@/components/CustomHeader';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, images } from '@/constants';
import Button from '@/components/Button';

const MyCard = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        <CustomHeader
          title="My Card"
          onBack={() => navigation.goBack()}
        />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.headerTitle}>Card</Text>
          <Text style={styles.headerSubtitle}>
            Optimize Your Experience by Adding Your Card and enjoy all your features
          </Text>

          <Pressable style={styles.cardItem} onPress={() => navigation.navigate("carddetail")}>
            <Image
              source={images.mastercard}
              style={styles.cardIcon}
            />
            <View style={styles.cardText}>
              <Text style={styles.cardHolder}>mangcoding</Text>
              <Text style={styles.cardNumber}>**** **** **** *676</Text>
            </View>
          </Pressable>
        </View>

        <Button
          title="Add New Card"
          filled
          onPress={() => navigation.navigate("addnewcard")}
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
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 999,
    padding: 16,
    marginTop: 24,
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
})

export default MyCard