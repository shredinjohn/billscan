import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Modal, Dimensions, TouchableWithoutFeedback, TextInput, TouchableOpacity, Animated, Easing,StatusBar ,BackHandler} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { LIGHT_GRAY, THEME_COLOR } from '../common/Colors';
import ProductItem from '../common/ProductItem';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const AddNewBill = () => {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [addItem, setAddItem] = useState([]);
  const navigation = useNavigation();
  const [slideAnim,leftAnim] = useState(new Animated.Value(Dimensions.get('window').height));
  const [searchText, setSearchText] = useState('');

  const [name, setName] = useState('');
  const [NameModalVisible, setNameModalVisible] = useState(false);
  const route = useRoute();
  const { barcodeData } = route.params || {};
  const [selectedItem, setSelectedItem] = useState([]);

  const selectProductByBarcode = (barcodeData, products, setAddItem) => {
    const product = products.find(item => item.barcode === barcodeData);
    if (product) {
      const itemIndex = addItem.findIndex(item => item.id === product.id);
      if (itemIndex !== -1) {
        const updatedItem = { ...addItem[itemIndex], quantity: addItem[itemIndex].quantity + 1 };
        const updatedData = [...addItem];
        updatedData[itemIndex] = updatedItem;
        setAddItem(updatedData);
      } else {
        setAddItem([...addItem, { ...product, quantity: 1 }]);
      }
    } else {
      alert('Product not found');
    }
  };


  useEffect(() => {
    const checkProductsFile = async () => {
      const fileExists = await RNFS.exists(`${RNFS.DocumentDirectoryPath}/products.csv`);
      if (fileExists) {
      } else {
        alert("Please import the CSV file for the products")
      }
    };

    checkProductsFile();
  }, []);

  // Rest of the component code

  useEffect(() => {
    if (barcodeData) {
      console.log('Barcode data:', barcodeData); 
      selectProductByBarcode(barcodeData, products, setAddItem);
    }
  }, [barcodeData]);

  useEffect(() => {
    Animated.timing(
      slideAnim,
      {
        toValue: modalVisible ? 0 : Dimensions.get('window').height,
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }
    ).start();
  }, [slideAnim, modalVisible]);

  useEffect(() => {
    getAllProducts('products.csv').then(data => {
      setProducts(data);
      });
  }, []);
 
  const getAllProducts = async () => {
    try {
      const documentPath = RNFS.DocumentDirectoryPath + '/products.csv';
      const fileContent = await RNFS.readFile(documentPath, 'utf8');
      const lines = fileContent.split('\n');
      const headers = lines[0].split(',');
      const products = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const product = {};
        for (let j = 0; j < headers.length; j++) {
          product[headers[j]] = values[j];
        }
        // product.barcode = values[headers.indexOf('barcode')];
        // console.log('Barcode:', product.barcode);
        products.push(product);
        
      }
      return products;
    } catch (error) {
      console.error(error);
    }
  };

  const addItems = ind => {
    const itemToAdd = products[ind];
    const itemIndex = addItem.findIndex(item => item.id === itemToAdd.id);
    if (itemIndex !== -1) {
      const updatedItem = { ...addItem[itemIndex], quantity: addItem[itemIndex].quantity + 1 };
      const updatedData = [...addItem];
      updatedData[itemIndex] = updatedItem;
      setAddItem(updatedData);
    } else {
      setAddItem([...addItem, { ...itemToAdd, quantity: 1 }]);
    }
  };

  const getTotal = () => {
    let total = 0;
    let temData = addItem;
    temData.map(item => {
      const price = parseFloat(item.price);
        total = total + price * item.quantity;
    });
    return total.toFixed(2);
  };

  const filterItems = (txt) => {
    if (txt === '') {
      getAllProducts('products.csv').then(data => {
        setProducts(data);
      });
      return;
    }
  
    let newData = products.filter(item => {
      return item.title.toUpperCase().includes(txt.toUpperCase());
    });
  
    if (newData.length > 0) {
      setProducts(newData);
    } else {
      setProducts(products);
    }
  };

  const saveBill = async () => {
    let day = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
  
    const newBill = {
      data: addItem,
      billerName: name,
      billDate: day + '/' + month + '/' + year,
      total: getTotal(),
    };
  
    // Retrieve existing bills from AsyncStorage
    const existingBills = await AsyncStorage.getItem('bills');
    let bills = [];
  
    if (existingBills !== null) {
      bills = JSON.parse(existingBills);
    }
  
    // Append the new bill to the existing list of bills
    bills.push(newBill);
  
    // Save the updated list of bills to AsyncStorage
    const jsonData = JSON.stringify(bills);
    await AsyncStorage.setItem('bills', jsonData);
  
    navigation.navigate('Main');
  };
  
  useEffect(() => {
    if (route.params && route.params.selectedBill) {
      setAddItem(route.params.selectedBill.data);
      setName(route.params.selectedBill.billerName);
    }
  }, [route.params]);

  // Render the component
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}> 
          <Image source={require('../images/left.png')} style={styles.topbtn} />
        </TouchableOpacity>
        {addItem.length > 0 ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.Total}>{'Total: ' + getTotal()}</Text>
          </View>
        ) : (null)}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image source={require('../images/add.png')} style={styles.topbtn} />
          </TouchableOpacity>
      </View>
      {addItem.length > 0 ? (
        <FlatList data={addItem} renderItem={({ item, index }) => {
          return <View style={styles.addItem} key={index}>
              <ProductItem item={item} index={index} onClick={(ind) => {
                  setModalVisible(false);
                  setSelectedItem(item);
                  addItems(ind);
              }} />
          </View>
        }} />
      ) : (
        <View style={styles.emptyView}>
          <Image source={require('../images/emptyimg.png')} style={styles.emptyImg}/>
          <Text style={styles.emptyTxt}>No Item Added</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addBtnScan}onPress={()=>{
              navigation.navigate('ScanBarCode');
            }}>
              <Text style={styles.buttonText}>Scan Now 🧾</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {addItem.length > 0 ? (
        <View style={styles.bottomView}>
          <TouchableOpacity style={styles.scnbtn} onPress={()=>{
              navigation.navigate('ScanBarCode');
            }}>
            <Text style={styles.TxtSubmit}>Scan Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => {
            setNameModalVisible(true);
          }}>
            <Text style={styles.TxtSubmit}>Submit Bill</Text>
          </TouchableOpacity>
        </View>
      ):(null)}

      <Modal transparent visible={modalVisible} onRequestClose={() => {
        Animated.timing(
          slideAnim,
          {
            toValue: Dimensions.get('window').height,
            duration: 200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
          }
        ).start(() => setModalVisible(false));
      }}>
        <TouchableWithoutFeedback onPress={() => {
          setModalVisible(true);
        }}>        
          <Animated.View style={[styles.ModalView, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.ModalView}>
              <TouchableOpacity onPress={() => {
                Animated.parallel([
                  Animated.timing(
                    slideAnim,
                    {
                      toValue: Dimensions.get('window').height,
                      duration: 200,
                      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                      useNativeDriver: true,
                    }
                  )
                ]).start(() => setModalVisible(false));
              }}>
                
                <Animated.Image source={require('../images/left.png')} style={[styles.topbtn, { margin: 20, transform: [{ translateX: slideAnim }] }]} />
              </TouchableOpacity>
              <FlatList
                data={products}
                renderItem={({ item, index }) => {
                  return (
                    <View style={styles.addItem} key={index}>
                      <ProductItem
                        item={item}
                        index={index}
                        onClick={ind => {
                          setModalVisible(false);
                   
                          addItems(ind);
                        }}
                      />
                    </View>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={
                  <View style={styles.searchBox}>
                    <Image source={require('../images/search.png')} style={{ height: 25, width: 25 }} />
                    <TextInput
                      placeholder="Search Item by Name"
                      style={styles.Input}
                      value={searchText}
                      onChangeText={txt => {
                        setSearchText(txt);
                        filterItems(txt);}}
                    />
                  </View>
                }
              />
            </View>
  
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal transparent visible={NameModalVisible} onRequestClose={() => navigation.goBack()}>
        <View style={styles.nameModalView}>
                <View style={styles.nameView}>
                  <TextInput placeholder='Biller Name' value={name} onChangeText={(txt)=>setName(txt)}
                  style={styles.nameInput} />
                  <View style={styles.nameBtnView}>
                  <TouchableOpacity style={styles.namecancelBtn} onPress={(
                    ) => {
                      setNameModalVisible(false);
                    }}>
                  <Text style={styles.nameTxt}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.namesubmitBtn} onPress={() => {
                    setNameModalVisible(false)
                    saveBill();
                  }}>
                    <Text style={styles.nameTxt}>Confirm ✅</Text>
                  </TouchableOpacity>
                  </View>
                  </View>
            </View>
      </Modal>
      
    </View>
  )
}

export default AddNewBill;

const styles=StyleSheet.create({
  container:{
    flex:1,
  },
  header:{
    height:60,
    width:'100%',
    elevation:5,
    backgroundColor:"#fff",
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:"center" ,
    paddingLeft:20,
    paddingRight:20 
  },
  topbtn:{
    width:30,
    height:30,   
  },
  bottomView:{
    position:'absolute',
    height:100,
    width:"100%",
    bottom:0,
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    backgroundColor:"#fff",
    flexDirection:'row',
    justifyContent:"space-evenly",
    alignItems:"center",
    elevation:5, 
    paddingRight:0,
  },
  btn:{
    backgroundColor:'#00688b',
    width:"40%",  
    justifyContent:'center',
    alignItems:"center",      
    height:50,
    borderRadius:15,
  },
  scnbtn:{
    backgroundColor:THEME_COLOR,
    width:"40%",  
    justifyContent:'center',
    alignItems:"center",      
    height:50,
    borderRadius:15,
  },
  TxtSubmit:{
    color:"#fff",
    fontSize:16,
    fontWeight:600,
  },
  Total:{
    fontSize:20,
    fontWeight:'700',
    color:"#000"
  },
  ModalView:{
    position:"absolute",
    backgroundColor:'#fff',
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
  },
  searchBox:{
    width:"86%",
    height:50,
    backgroundColor: LIGHT_GRAY,
    alignSelf:'center',
    borderRadius:20,
    flexDirection:'row',
    alignItems:"center",
    paddingLeft:15,
    paddingRight:15,
  },
  Input:{
    width:"70%",
    marginLeft:10,
    color:"black",
    fontWeight:'500',
  },
  emptyView:{
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
    justifyContent:'center',
    alignItems:'center',
  },
  emptyImg:{
    width:100,
    height:100,
    marginRight:10,
  },
  emptyTxt:{
    fontSize:20,
    fontWeight:'700',
    color:"#000",
    marginTop:20,
  },
  addItem:{  
    width:'100%',
    height:100,
    marginBottom:25,
  },
  addBtnScan:{
    backgroundColor:THEME_COLOR,
    justifyContent:'center',
    alignItems:"center",
    width:200,
    height:70,
    borderRadius:15,
    position:'absolute',
    alignSelf:'center',
    bottom:20,
    position:'relative',
  },
  buttonContainer:{
    marginTop:50,
    flexDirection:'column',
    alignItems:'center',  
  },
  buttonText:{
    color:'#fff',
    fontSize:16,
    fontWeight:'600',
  },
  nameModalView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameView: {
    width: '90%',
    height: 160,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  nameInput: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 20,
    paddingLeft: 20,
    color: '#000',
  },
  namesubmitBtn: {
    width: '40%',
    height: 50,
    backgroundColor: THEME_COLOR,
    borderRadius: 15,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  namecancelBtn: {
    width: '40%',
    height: 50,
    backgroundColor: '#363636',
    borderRadius: 15,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  nameTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nameBtnView: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop:20,
  },
});