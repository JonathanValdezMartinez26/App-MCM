import {
    View,
    Text,
    StyleSheet,
    ListRenderItem,
    FlatList,
    TouchableOpacity,
    SafeAreaView
} from "react-native"
import React from "react"
import { COLORS } from "@/constants"
import CustomHeader from "@/components/CustomHeader"
import { useNavigation } from "expo-router"
import { NavigationProp } from "@react-navigation/native"
import { Ionicons, MaterialCommunityIcons, AntDesign } from "@expo/vector-icons"

// Define your navigation param list (adjust as needed)
type RootStackParamList = {
    mycard: undefined
    transfer: undefined
    receive: undefined
    topup: undefined
}

interface FeatureItem {
    id: string
    title: string
    subtitle: string
    iconLib: "Ionicons" | "MaterialCommunityIcons" | "AntDesign"
    iconName: string
    route: keyof RootStackParamList
}

const features: FeatureItem[] = [
    {
        id: "1",
        title: "Add New Card Bank",
        subtitle: "New Card for user, unlimited card",
        iconLib: "Ionicons",
        iconName: "add",
        route: "mycard"
    },
    {
        id: "2",
        title: "Transfer Money",
        subtitle: "Transfer to all Bank in This world",
        iconLib: "MaterialCommunityIcons",
        iconName: "arrow-top-right",
        route: "transfer"
    },
    {
        id: "3",
        title: "Receive Money",
        subtitle: "Transfer to all Bank in This world",
        iconLib: "MaterialCommunityIcons",
        iconName: "arrow-bottom-left",
        route: "receive"
    },
    {
        id: "4",
        title: "Top Up",
        subtitle: "Top up money",
        iconLib: "AntDesign",
        iconName: "swap",
        route: "topup"
    }
]

const MoreFeatures = () => {
    const navigation = useNavigation<NavigationProp<any>>()

    const renderItem: ListRenderItem<FeatureItem> = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate(item.route)}
        >
            <View style={styles.iconWrapper}>
                {item.iconLib === "Ionicons" && (
                    <Ionicons name={item.iconName as any} size={24} color="white" />
                )}
                {item.iconLib === "MaterialCommunityIcons" && (
                    <MaterialCommunityIcons name={item.iconName as any} size={24} color="white" />
                )}
                {item.iconLib === "AntDesign" && (
                    <AntDesign name={item.iconName as any} size={24} color="white" />
                )}
            </View>
            <View style={styles.textWrapper}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <CustomHeader title="More Features" onBack={() => navigation.goBack()} />
                {/* Features List */}
                <FlatList
                    data={features}
                    keyExtractor={(item: any) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
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
    listContent: {
        paddingTop: 16
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9F9F9",
        borderRadius: 999,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 8
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#1E1E1E",
        alignItems: "center",
        justifyContent: "center"
    },
    textWrapper: {
        marginLeft: 12,
        flex: 1
    },
    itemTitle: {
        fontSize: 16,
        fontFamily: "semiBold",
        color: "#09070F"
    },
    itemSubtitle: {
        fontSize: 12,
        color: "#8C8C8C",
        marginTop: 4,
        fontFamily: "regular"
    }
})

export default MoreFeatures
