import { useState } from "react"
import { View, Text, Pressable, Platform } from "react-native"
import { Feather } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { COLORS } from "../constants"

export default function DateSelector({
    label,
    date,
    onDateChange,
    minDate,
    maxDate,
    placeholder = "Seleccionar fecha"
}) {
    const [show, setShow] = useState(false)

    const onChange = (event, selectedDate) => {
        setShow(Platform.OS === "ios")
        if (selectedDate) {
            onDateChange(selectedDate)
        }
    }

    const formatDate = (date) => {
        if (!date) return placeholder
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
    }

    return (
        <View className="mb-4">
            <Text className="text-base font-medium text-gray-700 mb-2">{label}</Text>

            <Pressable
                onPress={() => setShow(true)}
                className="flex-row items-center justify-between p-4 bg-white border border-gray-200 rounded-xl"
            >
                <Text className={`text-base ${date ? "text-gray-800" : "text-gray-400"}`}>
                    {formatDate(date)}
                </Text>
                <Feather name="calendar" size={20} color={date ? COLORS.primary : "#9CA3AF"} />
            </Pressable>

            {show && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChange}
                    minimumDate={minDate}
                    maximumDate={maxDate}
                />
            )}
        </View>
    )
}
