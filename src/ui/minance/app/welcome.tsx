import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { COLORS, illustrations, SIZES } from '@/constants';

const STEP_COUNT = 4;
const ACTIVE_STEP = 4; // all steps active

const WelcomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<any>>();

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
            <View style={styles.imageContainer}>
                <Image
                    source={illustrations.account}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.textContainer}>
                <View style={styles.viewTitleContainer}>
                    <Text style={styles.title}>Welcome to</Text>
                    <Text style={[styles.title, { color: COLORS.primary }]}>{" "}Minance</Text>
                </View>
                <Text style={styles.title}>Finance Application</Text>
                <Text style={styles.subtitle}>Click continue to go the Home Page</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('login')}
                >
                    <Text style={[styles.buttonText, styles.primaryText]}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const stepWidth = (SIZES.width - 80) / STEP_COUNT;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: SIZES.width * 0.8,
        height: SIZES.width * 0.8,
    },
    textContainer: {
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: 'bold',
        textAlign: 'center',
        color: COLORS.shadesBlack,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        marginVertical: 16
    },
    buttonContainer: {
        paddingHorizontal: 20,
    },
    button: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
    },
    primaryButton: {
        backgroundColor: '#0761FD',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#0761FD',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    primaryText: {
        color: '#fff',
    },
    secondaryText: {
        color: '#0761FD',
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
    viewTitleContainer: {
        flexDirection: "row",
        alignItems: "center"
    }
});

export default WelcomeScreen;
