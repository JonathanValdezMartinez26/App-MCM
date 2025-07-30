import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

interface CustomHeaderProps {
  title: string;
  onBack: () => void;
  onAction?: () => void;
  actionIconName?: React.ComponentProps<typeof Ionicons>['name'];
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  onBack,
  onAction,
  actionIconName = 'trash-outline',
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Pressable onPress={onBack} style={styles.iconWrapper} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#1E1E1E" />
        </Pressable>

        <Text style={styles.title}>{title}</Text>

        {onAction ? (
          <Pressable onPress={onAction} style={styles.iconWrapper} hitSlop={8}>
            <Ionicons name={actionIconName} size={24} color="#1E1E1E" />
          </Pressable>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: COLORS.shadesBlack,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
  },
});
