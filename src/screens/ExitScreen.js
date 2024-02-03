import { View, Text, StyleSheet, BackHandler } from 'react-native';
import React, { useEffect } from 'react';
import { THEME_COLOR } from '../common/Colors';

const ExitScreen = () => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });

    setTimeout(() => {
      BackHandler.exitApp();
    }, 100);

    return () => backHandler.remove();
  }, []);

    return (<View></View>);
};

export default ExitScreen;