import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { COLORS, icons, SIZES } from '@/constants';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';

const SCAN_SIZE = SIZES.width * 0.7;

export default function QRScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<any>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data, type }: { data: string; type: string }) => {
    if (!scanned) {
      setScanned(true);
      console.log('Scanned QR:', data);
      // TODO: handle scanned data (e.g., navigate or show data)
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No access to camera</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={() => { navigation.goBack() }}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </Pressable>

      {/* Title and Subtitle */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Payment with QR</Text>
        <Text style={styles.subtitle}>
          You can get paid by showing the QR code or you can create by entering the amount
        </Text>
      </View>

      {/* Camera Scanner */}
      <View style={styles.scannerContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          facing={facing}
          ref={cameraRef}
        />
        <View style={styles.overlay}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      {/* Rescan Button */}
      {scanned && (
        <Pressable style={styles.rescanButton} onPress={() => setScanned(false)}>
          <Text style={styles.rescanText}>Tap to Scan Again</Text>
        </Pressable>
      )}
      <View style={styles.scanBtnContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("sendmoney")}
          style={styles.scanBtn}>
          <Image
            resizeMode='contain'
            source={icons.scan2}
            style={styles.scanIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { padding: 16 },
  textContainer: { alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 24, fontFamily: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, fontFamily: "regular", color: '#8e8e93', textAlign: 'center' },
  scannerContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00FF00',
    borderWidth: 4,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  rescanButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  rescanText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#8e8e93' },
  scanBtnContainer: {
    position: "absolute",
    bottom: 18,
    zIndex: 999,
    width: "100%",
    height: 160,
    alignItems: 'center'
  },
  bottomContainer: {
    position: "absolute",
    bottom: 300,
    alignItems: "center"
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
});
