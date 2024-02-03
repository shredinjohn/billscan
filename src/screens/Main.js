import { View, Text, Linking, StyleSheet, TouchableOpacity, Platform,PermissionsAndroid, Image, BackHandler,FlatList, ToastAndroid, StatusBar,Dimensions } from 'react-native';
import React, { useEffect, useRef ,useState} from 'react';
import { LIGHT_GRAY, THEME_COLOR } from '../common/Colors';
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

let backPressedOnce = false;

const Main = () => {
  const navigation = useNavigation();
  const [bills,setBills]=useState([]);
  const backHandlerRef = useRef(null);
  const isFocused = useIsFocused();

  const handleImportPress = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      if (!result) {
        return;
      }
      const fileExtension = result.name.split('.').pop();
      if (fileExtension !== 'csv') {
        alert('Please select a CSV file');
        return;
      }
      const fileContent = await RNFS.readFile(result.uri, 'utf8');
      await RNFS.writeFile(`${RNFS.DocumentDirectoryPath}/products.csv`, fileContent, 'utf8');
      alert('File imported successfully');
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the file picker');
      } else {
        console.warn('Error importing CSV file:', err);
      }
    }
  };

  useEffect(() => {
    const getBills = async () => {
      const jsonData = await AsyncStorage.getItem('bills');
      if (jsonData !== null) {
        setBills(JSON.parse(jsonData));
      }
    };
  
    getBills();
  }, [isFocused]); 

  const getBills=async()=>{
    let data=await AsyncStorage.getItem('bills');  
    let json=JSON.parse(data);
    console.log(JSON.stringify(json));
    if (json !== null && json.length > 0) {
      setBills(json);
    } else {
      setBills([]);
    }
   
  }
  
  const handleBillPress = (bill) => {
    navigation.navigate('AddNewBill', { selectedBill: bill });
  };
  
  const handleDeletePress = async (index) => {
    const newBills = [...bills];
    newBills.splice(index, 1);
    setBills(newBills);
    await AsyncStorage.setItem('bills', JSON.stringify(newBills));
  };


  const saveBill = async () => {
      
    const bill = {
      billerName,
      billDate,
      billAmount,
    };
    let bills = await AsyncStorage.getItem('bills');
    if (bills === null) {
      bills = [];
    } else {
      bills = JSON.parse(bills);
    }
    bills.push(bill);
    await AsyncStorage.setItem('bills', JSON.stringify(bills));
    navigation.goBack();
  };
  
  useFocusEffect(
    React.useCallback(() => {
      let backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (navigation.isFocused()) {
          if (backPressedOnce) {
            navigation.navigate('ExitScreen');
            return true;
          } else {
            backPressedOnce = true;
            ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
            setTimeout(() => {
              backPressedOnce = false;
            }, 2000);
            return true;
          }
        }
      });
  
      return () => backHandler.remove();
    }, [navigation])
  );


  return (
    
  <View style={styles.container}>
     <View style={styles.logoContainer}>
          <Text style={styles.logoText}>BillScan</Text>
          
        </View>
        <StatusBar backgroundColor={THEME_COLOR} />
        <TouchableOpacity style={styles.exportBtn}>
            <FontAwesomeIcon icon={faUpload} size={20} color="white" style={styles.icon}/>
      </TouchableOpacity>
    <TouchableOpacity style={styles.addBtn} onPress={() => {
          navigation.navigate('AddNewBill');
        }}>
          <Text style={styles.btnTxt}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.importBtn} onPress={handleImportPress}>
            <FontAwesomeIcon icon={faDownload} size={20} color="white" style={styles.icon}/>
      </TouchableOpacity>
    {bills.length > 0 ? (
      <FlatList
        data={bills}
        renderItem={({ item, index })  => (
          <TouchableOpacity
            style={styles.billItem}
            onPress={() => {
              handleBillPress(item);
            }}
          >
            <Text style={styles.txtStyle}>{'Bill Name :' + item.billerName}</Text>
            <Text style={styles.txtStyle}>{'Bill Date :' + item.billDate}</Text>
            <Text style={styles.txtStyle}>{'Bill Amount :' + item.total}</Text>
            <TouchableOpacity
    style={styles.deleteBtn}
    onPress={() => {
      handleDeletePress(index);
    }}
  >
    <Text style={styles.deleteBtnText}>Delete</Text>
  </TouchableOpacity>
          </TouchableOpacity>
          
        )}
        keyExtractor={(item, index) => index.toString()}
        style={{ marginTop: 50,marginBottom:70 }}
      />
      
    ) : (
      <View style={styles.noDataContainer}>
        <Image source={require('../images/nodata.png')} style={styles.noData} />
        <Text style={styles.noDataTxt}>No Bill Found</Text>
      </View>
    )}
  </View>
);
      }

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 70,
    borderRadius: 15,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 10,
    zIndex: 1,
  },
  importBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 70,
    borderRadius: 15,
    position: 'absolute',
    alignSelf: 'flex-end', 
    bottom: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: THEME_COLOR,
  },
 exportBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 70,
    borderRadius: 15,
    position: 'absolute',
    alignSelf: 'flex-end', 
    bottom: 10,
    left: 10,
    zIndex: 1,
    backgroundColor: THEME_COLOR,
  },
  header: {
    width: '100%',
    height: 70,
  },
  icon: {
    alignSelf: 'center',
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
    fontSize: 22,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  btnTxt: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 600,
  },
  noData: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  noDataTxt: {
    fontSize: 20,
    fontWeight: 600,
    marginTop: 20,
    marginLeft: 15,
    color: '#000',
  },
  billItem: {
  
  width: Dimensions.get('window').width - 40,
  height: 100,
  alignSelf: 'center',
  marginTop: 0,  
  borderRadius: 10,
  elevation: 5,
  backgroundColor: 'white', 
  marginBottom: 20,
  marginLeft:5,
  marginRight:5,
  justifyContent: 'center',
  alignItems: 'flex-start',
  marginTop: 5,
  },
  txtStyle: {
    fontSize: 16,
    fontWeight: 600,
    marginTop: 2,
    marginLeft: 15,
    color: '#000',
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteBtn: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});