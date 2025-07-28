import { Tabs } from "expo-router";
import { View, Text, Platform, Image } from "react-native";
import { COLORS, icons, FONTS, SIZES } from "../../constants";

const TabLayout = () => {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: Platform.OS !== 'ios',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 90 : 60,
          backgroundColor: COLORS.white,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View style={{
                alignItems: "center",
                paddingTop: 16,
                width: SIZES.width / 5
              }}>
                <Image
                  source={focused ? icons.home : icons.home2Outline}
                  resizeMode="contain"
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: focused ? COLORS.primary : COLORS.gray3,
                  }}
                />
                <Text style={{
                  ...FONTS.body4,
                  color: focused ? COLORS.primary : COLORS.gray3,
                }}>Home</Text>
              </View>
            )
          },
        }}
      />
      <Tabs.Screen
        name="spending"
        options={{
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View style={{
                alignItems: "center",
                paddingTop: 16,
                width: SIZES.width / 5
              }}>
                <Image
                  source={focused ? icons.graph2 : icons.graph2Outline}
                  resizeMode="contain"
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: focused ? COLORS.primary : COLORS.gray3,
                  }}
                />
                <Text style={{
                  ...FONTS.body4,
                  color: focused ? COLORS.primary : COLORS.gray3,
                }}>Spending</Text>
              </View>
            )
          },
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View style={{
                alignItems: "center",
                justifyContent: "center",
                width: SIZES.width / 5,
                height: SIZES.width / 5,
                borderRadius: 999,
                backgroundColor: COLORS.primary,
                marginBottom: 32
              }}>
                <Image
                  source={icons.scan}
                  resizeMode="contain"
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: COLORS.white,
                  }}
                />
              </View>
            )
          },
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View style={{
                alignItems: "center",
                paddingTop: 16,
                width: SIZES.width / 4
              }}>
                <Image
                  source={focused ? icons.chatBubble2 : icons.chatBubble2Outline}
                  resizeMode="contain"
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: focused ? COLORS.primary : COLORS.gray3,
                  }}
                />
                <Text style={{
                  ...FONTS.body4,
                  color: focused ? COLORS.primary : COLORS.gray3,
                }}>Support</Text>
              </View>
            )
          },
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View style={{
                alignItems: "center",
                paddingTop: 16,
                width: SIZES.width / 5
              }}>
                <Image
                  source={focused ? icons.user : icons.userOutline}
                  resizeMode="contain"
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: focused ? COLORS.primary : COLORS.gray3,
                  }}
                />
                <Text style={{
                  ...FONTS.body4,
                  color: focused ? COLORS.primary : COLORS.gray3,
                }}>User</Text>
              </View>
            )
          },
        }}
      />
    </Tabs>
  )
}

export default TabLayout