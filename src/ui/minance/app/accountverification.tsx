import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { COLORS, icons, images, SIZES } from '@/constants';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';

const STEP_COUNT = 4;
const ACTIVE_STEP = 2; // first two steps active

const AccountVerification = () => {
    const navigation = useNavigation<NavigationProp<any>>();

    return (
        <SafeAreaView style={styles.area}>
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

            <View style={styles.viewContainer}>
                {/* Header */}
                <Text style={styles.title}>Scane ID documant to verify your fidentity</Text>
                <Text style={styles.subtitle}>Take your id for verification to make you easy for the Syber Scurity.</Text>
            </View>

            <View style={styles.scanImageContainer}>
                <Image
                    source={images.scan}
                    resizeMode='contain'
                    style={styles.scanImage}
                />
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("accountverificationscan")}
                    style={styles.scanBtn}>
                    <Image
                        source={icons.scan}
                        resizeMode='contain'
                        style={styles.scanIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.scanTitle}>Scan</Text>
            </View>
        </SafeAreaView>
    )
};

const stepWidth = (SIZES.width - 80) / STEP_COUNT;

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        paddingVertical: 16 
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 18,
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
    title: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.shadesBlack,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.neutralBlack,
        fontFamily: "regular"
    },
    viewContainer: {
        marginHorizontal: 16
    },
    scanImage: {
        width: SIZES.width - 84,
        height: SIZES.width - 84,
    },
    scanImageContainer: {
        justifyContent: "center",
        marginVertical: 64
    },
    bottomContainer: {
        position: "absolute",
        bottom: 48,
        alignItems: "center"
    },
    scanBtn: {
        height: 48,
        width: 48,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.primary,
        borderRadius: 999,
        marginBottom: 12
    },
    scanIcon: {
        height: 20,
        width: 20,
        tintColor: COLORS.white
    },
    scanTitle: {
        fontSize: 14,
        fontFamily: "regular",
        color: COLORS.neutralBlack
    }
})

export default AccountVerification