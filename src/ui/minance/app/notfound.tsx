import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import React from 'react';
import { COLORS, illustrations, SIZES } from '@/constants';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';

const NotFoundScreen = () => {
    const navigation = useNavigation<NavigationProp<any>>();

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <Image
                    source={illustrations.rafiki}
                    resizeMode='contain'
                    style={styles.rafiki}
                />
                <View style={{ marginVertical: 32 }}>
                    <Text style={styles.headerTitle}>404</Text>
                    <Text style={styles.headerSubtitle}>
                        We cannot load page your looking for
                    </Text>
                </View>
                <Button
                    filled
                    title='Back To Home'
                    style={{
                        width: SIZES.width - 32
                    }}
                    onPress={() => navigation.navigate("(tabs)")}
                />
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    rafiki: {
        width: 311,
        height: 231
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.shadesBlack,
        textAlign: "center"
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: "regular",
        marginTop: 8,
        lineHeight: 20,
        textAlign: "center"
    },
})

export default NotFoundScreen