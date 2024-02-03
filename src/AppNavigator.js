import {View, Text} from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import  Splash  from './screens/Splash'
import Main from './screens/Main'
import AddNewBill from './screens/AddNewBill';
import ScanBar from './screens/ScanBar';
import ExitScreen from './screens/ExitScreen';

const Stack = createStackNavigator()

function AppNavigator () {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}}/>
                <Stack.Screen name="Main" component={Main} options={{headerShown:false}}/>
                <Stack.Screen name="AddNewBill" component={AddNewBill} options={{headerShown:false}}/>
                <Stack.Screen name="ScanBarCode" component={ScanBar} options={{headerShown:false}}/>
                <Stack.Screen name="ExitScreen" component={ExitScreen} options={{headerShown:false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
