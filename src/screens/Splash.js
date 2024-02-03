import {View, Text, StyleSheet} from 'react-native';
import React,{useEffect} from 'react';
import { THEME_COLOR } from '../common/Colors';

const Splash = ({navigation}) => {
    useEffect(()=>{
        setTimeout(()=>{
            navigation.navigate('Main');
        },50); 
    },[]);
	return(
	<View style={styles.container}>
        <Text style={styles.logo}>BillScan</Text>
    </View>
    );
};

export default Splash;

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: THEME_COLOR
    },
    logo:{
        color:"#FFFFFF",
        fontSize:30,
        fontWeight:'800',
    }
})