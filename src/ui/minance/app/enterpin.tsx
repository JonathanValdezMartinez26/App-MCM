import { View, Text, ScrollView, Pressable, Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { COLORS, icons, SIZES } from '@/constants';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const pinLength = 6
const pinContainerSize = SIZES.width / 2
const pinMaxSize = pinContainerSize / pinLength
const pinSpacing = 10
const pinSize = pinMaxSize - pinSpacing * 2

const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del']
const dialPadSize = SIZES.width * 0.16
const dialPadTextSize = dialPadSize * 0.4
const _spacing = 20

function DialPad({
    onPress,
}: {
    onPress: (item: (typeof dialPad)[number]) => void
}) {
    return (
        <FlatList
            numColumns={3}
            data={dialPad}
            style={{ flexGrow: 1 }}
            keyExtractor={(_, index) => index.toString()}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: _spacing }}
            contentContainerStyle={{ gap: _spacing }}
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity
                        disabled={item === ''}
                        onPress={() => {
                            onPress(item)
                        }}
                    >
                        <View
                            style={{
                                width: dialPadSize,
                                height: dialPadSize,
                                borderRadius: dialPadSize / 2,
                                backgroundColor: item === '' ? 'transparent' : '#F5F5F5',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            {item === 'del' ? (
                                <Ionicons
                                    name="backspace-outline"
                                    size={dialPadTextSize}
                                    color="black"
                                />
                            ) : (
                                <Text
                                    style={{
                                        fontSize: dialPadTextSize,
                                        fontFamily: 'regular',
                                        color: 'black',
                                    }}
                                >
                                    {item}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                )
            }}
        />
    )
}


const EnterPINScreen = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [code, setCode] = useState<number[]>([]);

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <StatusBar style="dark" />
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <Pressable style={styles.back} onPress={() => navigation.goBack()}>
                        <Image source={icons.arrowBack} resizeMode='contain' style={styles.arrowIcon} />
                    </Pressable>

                    <Text style={styles.title}>Enter PIN</Text>
                    <View style={styles.emailContainer}>
                        <Text style={styles.subtitle}>hello@mangcoding.com</Text>
                    </View>
                    <View style={{ alignItems: 'center', marginVertical: 32 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: pinSpacing * 2,
                                marginBottom: _spacing * 2,
                                height: pinSize * 2,
                                alignItems: "flex-end"
                            }}
                        >
                            {[...Array(pinLength).keys()].map((key) => {
                                const isSelected = !!code[key];

                                return (
                                    <View
                                        key={key}
                                        style={{
                                            width: pinSize,
                                            height: pinSize,
                                            borderRadius: pinSize,
                                            borderColor: isSelected ? COLORS.primary : COLORS.neutralBlack,
                                            borderWidth: 1,
                                            backgroundColor: isSelected ? COLORS.primary : COLORS.white,
                                        }}
                                    />
                                )
                            })}
                        </View>
                        <DialPad
                            onPress={(item) => {
                                if (item === 'del') {
                                    setCode((prevCode) => prevCode.slice(0, prevCode.length - 1));
                                } else if (typeof item === 'number') {
                                    setCode((prevCode) => {
                                        const newCode = [...prevCode, item];
                                        if (newCode.length === pinLength) {
                                            navigation.navigate("(tabs)");
                                        }
                                        return newCode;
                                    });
                                }
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => navigation.navigate("forgetpinphonenumber")}
                            style={styles.pinBtn}>
                            <Text style={styles.subtitle}>Forgot PIN</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 16
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
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 14,
        color: '#8C8C8C',
        fontFamily: "regular",
        textAlign: "center",
    },
    arrowIcon: {
        height: 16,
        width: 16,
        tintColor: COLORS.shadesBlack
    },
    emailContainer: {
        alignSelf: 'center',      // ← shrink-wrap and center
        borderWidth: 0.4,
        borderColor: COLORS.neutralBlack,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    pinBtn: {
        alignSelf: 'center',      // ← shrink-wrap and center
        borderWidth: 0.4,
        borderColor: COLORS.neutralBlack,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginTop: 24
    }
})

export default EnterPINScreen