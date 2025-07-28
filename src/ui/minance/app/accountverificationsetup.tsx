import { View, Text, Dimensions, ScrollView, Image, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { COLORS, images, SIZES } from '@/constants';
import { Feather, Ionicons } from '@expo/vector-icons';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const STEP_COUNT = 4;
const ACTIVE_STEP = 2; // first two steps active

const AccountVerificationSetup = () => {
    const navigation = useNavigation<NavigationProp<any>>();

    const StepItem = ({ icon, label, checked }: { icon: any; label: string; checked: boolean }) => {
        return (
            <View style={styles.stepItem}>
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={20} color="white" />
                </View>
                <Text style={styles.stepLabel}>{label}</Text>
                <View style={styles.checkContainer}>
                    {checked ? (
                        <Feather name="check" size={18} color={COLORS.white} />
                    ) : (
                        <View style={styles.uncheckedCircle} />
                    )}
                </View>
            </View>
        )
    }

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

                {/* Title & Subtitle */}
                <Text style={styles.title}>Setting up your account</Text>
                <Text style={styles.subtitle}>
                    We are analyzing your data to verify
                </Text>

                {/* Steps */}
                <View style={styles.stepList}>
                    <StepItem icon="person-outline" label="Setting up your account" checked />
                    <StepItem icon="star-outline" label="Checking up document ID" checked={false} />
                    <StepItem icon="camera-outline" label="Verification Photo" checked={false} />
                </View>
                <Button
                    title="Next"
                    filled
                    onPress={() => navigation.navigate('accountverification')}
                    style={{
                        width: SIZES.width - 32,
                        marginVertical: 16
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    )
};

const stepWidth = (width - 80) / STEP_COUNT;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 16
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
        width: width * 0.5,
        height: width * 0.5,
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
    stepList: {
        marginHorizontal: 20,
        gap: 16,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: SIZES.width - 32
    },
    iconContainer: {
        backgroundColor: '#000',
        borderRadius: 999,
        marginRight: 14,
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center"
    },
    stepLabel: {
        flex: 1,
        fontSize: 16,
        color: '#111',
    },
    checkContainer: {
        backgroundColor: '#0761FD',
        borderRadius: 20,
        padding: 6,
    },
    uncheckedCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
})

export default AccountVerificationSetup