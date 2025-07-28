import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Pressable, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, icons } from '@/constants';
import CustomHeader from '@/components/CustomHeader';

// Define navigation params
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  // other screens
};

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [remember, setRemember] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <CustomHeader title="" onBack={() => navigation.goBack()} />

        <Text style={styles.title}>Sign in to your Minance account</Text>
        <Text style={styles.subtitle}>
          Make sure you enter the email registered with Minance.
        </Text>

        <View style={[styles.inputContainer, { borderColor: emailFocused ? COLORS.primary : '#ccc' }]}>
          <Feather name="mail" size={20} color={COLORS.neutralBlack} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </View>

        <View style={[styles.inputContainer, { borderColor: passwordFocused ? COLORS.primary : '#ccc' }]}>
          <Feather name="key" size={20} color={COLORS.neutralBlack} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={secureText}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <Feather
              name={secureText ? 'eye-off' : 'eye'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.optionsRow}>
          <Pressable
            style={styles.rememberContainer}
            onPress={() => setRemember(!remember)}
          >
            <View style={[styles.checkbox, remember && styles.checkboxActive]}>
              {remember && (
                <Ionicons name="checkmark" size={12} color={COLORS.white} />
              )}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </Pressable>

          <TouchableOpacity onPress={() => navigation.navigate('forgetpassword')}>
            <Text style={styles.forgotText}>Forgot Password!</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('enterpin')}
          style={styles.primaryButton} activeOpacity={0.7}>
          <Text style={styles.primaryButtonText}>Sign in</Text>
        </TouchableOpacity>

        <View style={styles.separator}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
          <Image source={icons.appleLogo} resizeMode="contain" style={styles.socialIcon} />
          <Text style={styles.socialText}>iCloud</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
          <Image source={icons.google} resizeMode="contain" style={styles.socialIcon} />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>You don’t have account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('signup')}>
          <Text style={styles.footerLink}> Sign up</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  back: {
    marginBottom: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontFamily: 'bold',
    color: COLORS.shadesBlack,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8C8C8C',
    marginBottom: 24,
    fontFamily: "regular"
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.shadesBlack,
    fontFamily: "regular"
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: COLORS.neutralBlack,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  rememberText: {
    fontSize: 14,
    color: COLORS.neutralBlack,
    fontFamily: "regular"
  },
  forgotText: {
    fontSize: 12,
    color: COLORS.primary,
    fontFamily: "regular"
  },
  primaryButton: {
    backgroundColor: '#0761FD',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#666',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
  },
  socialIcon: {
    marginRight: 10,
    height: 20,
    width: 20
  },
  socialText: {
    fontSize: 16,
    color: '#333',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.neutralBlack,
    fontFamily: "regular"
  },
  footerLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: "bold"
  },
  arrowIcon: {
    height: 16,
    width: 16,
    tintColor: COLORS.shadesBlack
  }
});

export default LoginScreen;
