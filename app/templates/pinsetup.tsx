import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, images, SIZES } from '@/constants';


const STEP_COUNT = 4;
const ACTIVE_STEP = 2; // first two steps active

// Navigation params
export type RootStackParamList = {
  PINSetup: undefined;
};

const PINSetupScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const maskedPIN = '******';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        {Array.from({ length: STEP_COUNT }).map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.progressStep,
              idx < ACTIVE_STEP ? styles.stepActive : styles.stepInactive,
            ]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Shield Illustration */}
        <View style={styles.imageContainer}>
          <Image
            source={images.shield}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Masked PIN Display */}
        <Text style={styles.pinDisplay}>{maskedPIN}</Text>

        {/* Title & Subtitle */}
        <Text style={styles.title}>Create your PIN</Text>
        <Text style={styles.subtitle}>
          Your account has been activated and verified, let’s create your PIN number
        </Text>

        {/* Create PIN Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('createnewpin')}
        >
          <Text style={styles.primaryButtonText}>Create PIN</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const stepWidth = (SIZES.width - 80) / STEP_COUNT;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16
  },
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 16
  },
  progressStep: {
    width: stepWidth,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 5,
  },
  stepActive: {
    backgroundColor: '#0761FD'
  },
  stepInactive: {
    backgroundColor: '#E5E5E5'
  },
  imageContainer: {
    width: SIZES.width * 0.5,
    height: SIZES.width * 0.5,
    marginBottom: 30
  },
  image: {
    width: '100%',
    height: '100%'
  },
  pinDisplay: {
    fontSize: 42,
    letterSpacing: 8,
    marginBottom: 30,
    color: COLORS.shadesBlack
  },
  title: {
    fontSize: 24,
    fontFamily: 'bold',
    color: COLORS.shadesBlack,
    marginBottom: 12,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.neutralBlack,
    fontFamily: "regular",
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20
  },
  primaryButton: {
    backgroundColor: '#0761FD',
    borderRadius: 25,
    height: 48,
    width: SIZES.width - 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    shadowColor: '#0761FD',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "regular"
  },
});

export default PINSetupScreen;
