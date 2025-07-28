import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '@/constants';

const CIRCLE_RADIUS = SIZES.width * 0.35;

export default function AccountVerificationSelfieScan() {
  const navigation = useNavigation<NavigationProp<any>>();
  const cameraRef = useRef<any>(null);
  const [facing, setFacing] = useState<CameraType>('front');

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCapture = async () => {
    if (verifying || !cameraRef.current) return;
    try {
      await cameraRef.current.takePictureAsync({ quality: 0.5 });
      setVerifying(true);
      let pct = 0;
      const timer = setInterval(() => {
        pct += 20;
        setProgress(pct);
        if (pct >= 100) {
          clearInterval(timer);
          navigation.navigate('welcome');
        }
      }, 300);
    } catch (e) {
      console.warn('Capture failed', e);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera Preview */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
      />

      {/* Back button */}
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Circle Overlay */}
      <View style={styles.circleOverlay} pointerEvents="none" />

      {/* Footer: progress + capture */}
      <View style={styles.footer}>
        {verifying && (
          <>
            <Text style={styles.progressText}>{progress}%</Text>
            <Text style={styles.verifyingText}>Verifying your face…</Text>
          </>
        )}
        <TouchableOpacity
          style={[styles.captureButton, verifying && { opacity: 0.5 }]}
          onPress={handleCapture}
          disabled={verifying}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  circleOverlay: {
    position: 'absolute',
    top: (SIZES.height - CIRCLE_RADIUS * 2) / 2 - 50,
    left: (SIZES.width - CIRCLE_RADIUS * 2) / 2,
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    borderWidth: 3,
    borderColor: '#00FF00',
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignItems: 'center',
  },
  progressText: {
    color: COLORS.white,
    fontSize: 36,
    fontFamily: 'bold'
  },
  verifyingText: {
    color: COLORS.white,
    fontSize: 16,
    marginTop: 4,
    fontFamily: "regular"
  },
  captureButton: {
    marginTop: 16,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.white,
    borderWidth: 4,
    borderColor: '#eee',
  },
});
