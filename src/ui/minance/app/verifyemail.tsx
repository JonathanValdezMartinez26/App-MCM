import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, images, SIZES } from '@/constants';
import CustomHeader from '@/components/CustomHeader';
import { OtpInput } from "react-native-otp-entry";
import Button from '@/components/Button';

// Define your navigation params
export type RootStackParamList = {
  VerifyEmail: undefined;
};


const VerifyEmailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={styles.stepActive} />
          <View style={styles.stepInactive} />
          <View style={styles.stepInactive} />
          <View style={styles.stepInactive} />
        </View>

        {/* Back Button */}
        <CustomHeader title="" onBack={() => navigation.goBack()} />

        {/* Header */}
        <Text style={styles.title}>Verify your e-mail</Text>
        <Text style={styles.subtitle}>Check your email for the code</Text>
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>hello@mangcoding.com</Text>
        </View>

        {/* Code Input Circles */}
        <View style={styles.codeContainer}>
          <OtpInput
            numberOfDigits={4}
            onTextChange={(text) => console.log(text)}
            focusColor={COLORS.primary}
            focusStickBlinkingDuration={500}
            onFilled={(text) => {
              // Please implement code verification here
              if (text.length == 4) {
                setModalVisible(true);
              }
            }}
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: COLORS.white,
                height: 58,
                width: 58,
                borderWidth: 1,
                borderColor: COLORS.neutralBlack,
                borderRadius: 9999
              },
              pinCodeTextStyle: {
                color: COLORS.black,
              }
            }}
          />
        </View>
        <TouchableOpacity>
          <Text style={styles.resendText}>Resend code</Text>
        </TouchableOpacity>

        <Button
          filled
          title="Confirmation"
          style={{ 
            width: SIZES.width - 32,
            marginVertical: 64
          }}
          onPress={()=>setModalVisible(true)}
        /> 

        {/* Success Modal */}
        <Modal transparent visible={modalVisible} animationType="slide">
          <TouchableWithoutFeedback onPress={()=>setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.successIconContainer}>
                <Image source={images.success} resizeMode='contain' style={styles.successImage} />
              </View>
              <Text style={styles.modalTitle}>Your Verification has Success</Text>
              <Text style={styles.modalSubtitle}>your email as already login to Minance</Text>
              <TouchableOpacity style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('pinsetup')
                }}
                activeOpacity={0.7}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
          </TouchableWithoutFeedback>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
};

const circleSize = 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 16
  },
  content: {
    padding: 20,
    justifyContent: 'space-between',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  stepActive: {
    flex: 1,
    height: 4,
    backgroundColor: '#0761FD',
    borderRadius: 2,
    marginHorizontal: 2,
  },
  stepInactive: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    marginHorizontal: 2,
  },
  back: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontFamily: 'bold',
    color: COLORS.shadesBlack,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: "regular"
  },
  emailContainer: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 30,
  },
  emailText: {
    fontSize: 14,
    color: '#333',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: (SIZES.width - circleSize * 4 - 60) / 4,
    marginBottom: 10,
  },
  resendText: {
    color: '#0761FD',
    textAlign: 'center',
    marginBottom: 30,
  },
  padContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#0761FD',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmDisabled: {
    backgroundColor: '#ccc',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SIZES.width - 60,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 42,
    alignItems: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'bold',
    color: COLORS.shadesBlack,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 16
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    width: SIZES.width - 112,
    height: 48,
    alignItems: "center",
    justifyContent: "center"
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  arrowIcon: {
    height: 16,
    width: 16,
    tintColor: COLORS.shadesBlack
  },
  successImage: {
    height: 100,
    width: 100
  }
});

export default VerifyEmailScreen;
