import { View, StyleSheet, Vibration,Text ,Button, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RNCamera } from 'react-native-camera';
import { THEME_COLOR } from '../common/Colors';
import { useNavigation } from '@react-navigation/native'

export default function ScanBar() {
  const [scanned, setScanned] = useState(false);
  const [displayText, setDisplayText] = useState('Not yet scanned');
  const navigation = useNavigation();

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setDisplayText(data);
    console.log(`Bar code with data ${data} has been scanned!`);
    navigation.navigate('AddNewBill', { barcodeData: data });
    Vibration.vibrate(100); 
  };

  useEffect(() => {
    console.log('ScanBar component mounted');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>BillScan</Text>
      </View>
      <View style={styles.cameraContainer}>
        <RNCamera
          style={styles.camera}
          onBarCodeRead={scanned ? undefined : handleBarCodeScanned}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
      </View>
      <Text style={styles.maintext}>{displayText}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.btnCancel, { backgroundColor: THEME_COLOR }]} onPress={() => navigation.goBack()}>
          <Text style={styles.btnCancelText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  CamPermText: {
    fontSize: 20,
    color: 'black',
  },
  logoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: THEME_COLOR,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomRightRadius: 30,
    zIndex: 1,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  cameraContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  maintext: {
    marginTop: '10%',
    fontSize: 20,
    color: 'black',
  },
  btnCancel: {
    backgroundColor: '#000',
    width:120,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 15,
    marginTop: 20,
  },
  btnCancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});