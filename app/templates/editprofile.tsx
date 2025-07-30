import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Pressable, Modal, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import CustomHeader from '@/components/CustomHeader';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, images, SIZES } from '@/constants';
import { Feather, Ionicons } from '@expo/vector-icons';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import Button from '@/components/Button';
import { launchImagePicker } from '@/utils/ImagePickerHelper';

const EditProfile = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [focusEmail, setFocusEmail] = useState(false);
    const [focusUserName, setFocusUserName] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [image, setImage] = useState(images.user1);
    const [modalVisible, setModalVisible] = useState(false);

    // country picker state
    const [countryCode, setCountryCode] = useState<CountryCode>('ID')
    const [callingCode, setCallingCode] = useState<string>('62')
    const [withCountryModal, setWithCountryModal] = useState(false)

    const onSelectCountry = (country: Country) => {
        setCountryCode(country.cca2)
        setCallingCode(country.callingCode[0])
        setWithCountryModal(false)
    }

    const pickImage = async () => {
        try {
            const tempUri = await launchImagePicker()

            if (!tempUri) return

            // set the image
            setImage({ uri: tempUri })
        } catch (error) { }
    };

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <CustomHeader
                    title="Edit Profle"
                    onBack={() => navigation.goBack()}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={image}
                            resizeMode='cover'
                            style={styles.userImage}
                        />
                        <View style={styles.userInfoContainer}>
                            <Text style={styles.userTitle}>Profile Photo</Text>
                            <Text style={styles.userSubtitle}>Recomendasi resolusi 500 x 500</Text>
                            <TouchableOpacity onPress={pickImage} style={styles.changeBtn}>
                                <Text style={styles.changeBtnText}>Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Username Input */}
                        <View
                            style={[
                                styles.inputContainer,
                                { borderColor: focusUserName ? COLORS.primary : '#ccc' },
                            ]}>
                            <Feather name="user" size={20} color={COLORS.neutralBlack} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Your username"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={userName}
                                onChangeText={setUserName}
                                onFocus={() => setFocusUserName(true)}
                                onBlur={() => setFocusUserName(false)}
                            />
                        </View>
                        {/* Email Input */}
                        <View
                            style={[
                                styles.inputContainer,
                                { borderColor: focusEmail ? COLORS.primary : '#ccc' },
                            ]}>
                            <Feather name="mail" size={20} color={COLORS.neutralBlack} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Your email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                                onFocus={() => setFocusEmail(true)}
                                onBlur={() => setFocusEmail(false)}
                            />
                        </View>

                        {/* Phone input with dynamic country picker */}
                        <View style={styles.phoneContainer}>
                            <Pressable
                                style={styles.countryPicker}
                                onPress={() => setWithCountryModal(true)}>
                                {/* CountryPicker modal */}
                                <CountryPicker
                                    withFilter
                                    withFlag
                                    withCallingCode
                                    withEmoji
                                    countryCode={countryCode}
                                    visible={withCountryModal}
                                    onClose={() => setWithCountryModal(false)}
                                    onSelect={onSelectCountry}
                                />
                                <Text style={styles.phoneCode}>+{callingCode}</Text>
                                <Ionicons name="chevron-down-outline" size={16} color={COLORS.shadesBlack} />
                            </Pressable>
                            <TextInput
                                style={styles.phoneText}
                                placeholder='12345 5678 9871'
                                keyboardType="numeric"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                            />
                        </View>
                    </View>
                </ScrollView>
                <Button
                    title="Save Profile"
                    filled
                    onPress={() => setModalVisible(true)}
                />
            </View>

            {/* Success Modal */}
            <Modal transparent visible={modalVisible} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.successIconContainer}>
                            <Image source={images.success} resizeMode='contain' style={styles.successImage} />
                        </View>
                        <Text style={styles.modalTitle}>Your Profile has already to be Done</Text>
                        <Text style={styles.modalSubtitle}>Profile has been change</Text>
                        <TouchableOpacity style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('(tabs)')
                            }}
                            activeOpacity={0.7}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
};

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
    profileImageContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    userImage: {
        height: 84,
        width: 84,
        borderRadius: 999
    },
    userTitle: {
        fontSize: 14,
        fontFamily: "bold",
        color: COLORS.shadesBlack,
        marginBottom: 4
    },
    userSubtitle: {
        fontSize: 12,
        fontFamily: "regular",
        color: COLORS.neutralBlack,
        marginVertical: 4
    },
    changeBtn: {
        width: 68,
        height: 32,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#D1D1D1",
        alignItems: "center",
        justifyContent: "center"
    },
    changeBtnText: {
        fontSize: 12,
        fontFamily: "regular",
        color: COLORS.shadesBlack
    },
    userInfoContainer: {
        marginLeft: 32
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 15,
        height: 50
    },
    icon: {
        marginRight: 8
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: COLORS.shadesBlack,
        fontFamily: "regular"
    },
    formContainer: {
        marginVertical: 24
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 32,
        borderWidth: 0.4,
        borderColor: COLORS.neutralBlack,
    },
    countryPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    flagIcon: {
        width: 24,
        height: 16,
        marginRight: 6
    },
    phoneCode: {
        fontSize: 14,
        color: COLORS.shadesBlack,
        fontFamily: 'regular',
        marginRight: 4,
    },
    phoneText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.shadesBlack,
        fontFamily: 'regular',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: SIZES.width - 60,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 42,
        alignItems: 'center',
    },
    successIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#28a745',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.shadesBlack,
        textAlign: 'center',
        marginBottom: 12,
        marginTop: 16
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 25,
        width: SIZES.width - 112,
        height: 48,
        alignItems: "center",
        justifyContent: "center"
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    successImage: {
        height: 100,
        width: 100
    }
})

export default EditProfile