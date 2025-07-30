import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
// 👉 Import Camera (value) and CameraType (type) separately:
import { Camera, CameraView } from 'expo-camera';
import type { CameraType } from 'expo-camera';

import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { SIZES } from '@/constants';

const BOX_WIDTH = SIZES.width * 0.9;
const BOX_HEIGHT = BOX_WIDTH / 1.6;

export default function AccountVerificationScanScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  // 👉 Tell TS that our ref is the instance type of the Camera component
  const cameraRef = useRef<any>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [verifying, setVerifying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      // …your upload/verify logic here…
      setVerifying(true);
      let pct = 0;
      const interval = setInterval(() => {
        pct += 10;
        setProgress(pct);
        if (pct >= 80) {
          clearInterval(interval);
          setTimeout(() => {
            setVerifying(false);
            setIsCapturing(false);
            setProgress(0);
            navigation.navigate('accountverificationsetup2');
          }, 500);
        }
      }, 200);
    } catch (e) {
      console.warn(e);
      setIsCapturing(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }
  if (!hasPermission) {
    return <View style={styles.center}><Text>No camera access</Text></View>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing={facing}
        ref={cameraRef}
      />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.step}>1/2</Text>
      </View>
      <Text style={styles.instruction}>Please scan front of your ID card</Text>

      {/* Overlay with transparent cutout */}
      <View style={styles.overlay}>
        <View style={styles.topMask} />
        <View style={styles.middleRow}>
          <View style={styles.sideMask} />
          <View style={styles.cutout} />
          <View style={styles.sideMask} />
        </View>
        <View style={styles.bottomMask} />
      </View>

      {/* Verifying */}
      {verifying && (
        <View style={styles.verifying}>
          <Text style={styles.progress}>{progress}%</Text>
          <Text style={styles.verifText}>Verifying your ID…</Text>
        </View>
      )}

      {/* Capture button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.capture, isCapturing && { opacity: 0.5 }]}
          onPress={takePicture}
          disabled={isCapturing}
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
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99999
  },
  step: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  instruction: {
    position: 'absolute',
    top: 90,
    width: '100%',
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontFamily: "regular"
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topMask: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  bottomMask: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  middleRow: {
    flexDirection: 'row'
  },
  sideMask: {
    width: (SIZES.width - BOX_WIDTH) / 2,
    height: BOX_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  cutout: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    borderWidth: 2,
    borderColor: '#0f0',
    borderRadius: 8,
  },
  verifying: {
    position: 'absolute',
    bottom: 140,
    width: '100%',
    alignItems: 'center',
  },
  progress: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '700'
  },
  verifText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  capture: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#eee',
  },
});
