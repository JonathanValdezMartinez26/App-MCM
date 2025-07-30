import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Image,
    Pressable,
    TouchableOpacity,
    SafeAreaView
} from "react-native"
import React, { useState } from "react"
import CustomHeader from "@/components/CustomHeader"
import { useNavigation } from "expo-router"
import { NavigationProp } from "@react-navigation/native"
import { COLORS, icons } from "@/constants"
import { Ionicons } from "@expo/vector-icons"

const AVATAR_SIZE = 48

const ReceiveMoneyChooseReceipient = () => {
    const navigation = useNavigation<NavigationProp<any>>()
    const [search, setSearch] = useState("")

    const filtered = recipients.filter(
        (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.account.includes(search)
    )

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <CustomHeader title="Receive" onBack={() => navigation.goBack()} />
                <View style={styles.content}>
                    <Text style={styles.headerTitle}>Choose recipient</Text>
                    <Text style={styles.headerSubtitle}>
                        Search or select your recipient to send money
                    </Text>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Ionicons
                            name="search-outline"
                            size={20}
                            color={COLORS.shadesBlack}
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search"
                            placeholderTextColor={COLORS.shadesBlack}
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>

                    {/* Recent Transactions Section */}
                    <Text style={styles.sectionHeader}>Latest transaction</Text>
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <Pressable
                                style={styles.row}
                                onPress={() => {
                                    /* select recipient */
                                }}
                            >
                                <Image source={item.avatar} style={styles.avatar} />
                                <View style={styles.info}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.account}>{item.account}</Text>
                                </View>
                            </Pressable>
                        )}
                        scrollEnabled={false}
                    />
                </View>

                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("receivepurpose")}
                        style={styles.scanBtn}
                    >
                        <Image source={icons.qr2} resizeMode="contain" style={styles.scanIcon} />
                    </TouchableOpacity>
                    <Text style={styles.scanTitle}>Barcode</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

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
        paddingTop: 24
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: "bold",
        color: COLORS.shadesBlack
    },
    headerSubtitle: {
        fontSize: 14,
        color: "#6B7280",
        fontFamily: "regular",
        marginTop: 8,
        lineHeight: 20
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderRadius: 24,
        borderColor: "#E3E3E3",
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        height: 52,
        marginBottom: 24,
        marginTop: 16
    },
    searchIcon: {
        marginRight: 8
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.greyscale900
    },
    sectionHeader: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginBottom: 12
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12
    },
    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        marginRight: 12
    },
    info: {
        flex: 1
    },
    name: {
        fontSize: 14,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginBottom: 4
    },
    account: {
        fontSize: 12,
        color: "#8C8C8C",
        marginTop: 2
    },
    bottomContainer: {
        position: "absolute",
        bottom: 18,
        alignItems: "center",
        width: "100%",
        alignSelf: "center"
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

export default ReceiveMoneyChooseReceipient
