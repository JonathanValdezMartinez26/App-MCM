import AsyncStorage from "@react-native-async-storage/async-storage"

export async function saveToken(token) {
    await AsyncStorage.setItem("token", token)
}

export async function getToken() {
    return await AsyncStorage.getItem("token")
}

export async function removeToken() {
    await AsyncStorage.removeItem("token")
}

export async function saveUser(userData) {
    await AsyncStorage.setItem("user", JSON.stringify(userData))
}

export async function getUser() {
    const user = await AsyncStorage.getItem("user")
    return user ? JSON.parse(user) : null
}

export async function removeUser() {
    await AsyncStorage.removeItem("user")
}

export async function clearAll() {
    await AsyncStorage.multiRemove(["token", "user", "intro_OK"])
}

export async function setIntroOK() {
    await AsyncStorage.setItem("intro_OK", "true")
}

export async function getIntroStatus() {
    const completed = await AsyncStorage.getItem("intro_OK")
    return completed === "true"
}

export async function setItem(key, value) {
    await AsyncStorage.setItem(key, JSON.stringify(value))
}

export async function getItem(key) {
    const item = await AsyncStorage.getItem(key)
    return item ? JSON.parse(item) : null
}

export default {
    saveToken,
    getToken,
    removeToken,
    saveUser,
    getUser,
    removeUser,
    clearAll,
    setIntroOK,
    getIntroStatus,
    setItem,
    getItem
}
