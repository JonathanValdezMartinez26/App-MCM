import { Link, Stack } from "expo-router"
import { Text, View, StyleSheet } from "react-native"

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />
            <View style={styles.container}>
                <Text>Oops!, no deberías estar aquí.</Text>
                <Link href="/(tabs)/Cartera" style={styles.link}>
                    <Text>Volver al inicio</Text>
                </Link>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20
    },
    link: {
        marginTop: 15,
        paddingVertical: 15
    }
})
