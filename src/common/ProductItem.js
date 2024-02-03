import { View, Text, Dimensions, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';


const ProductItem = ({ item, index, onClick }) => {
  return (
    <TouchableWithoutFeedback onPress={() => {}}>
      <View>
        <TouchableOpacity style={styles.container} onPress={() => onClick(index)}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <View>
            {/* <Text style={styles.title}>{item.title.length > 20 ? item.title.substring(0, 20) : item.title}</Text> */}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.title}>{"₹" + item.price}</Text>
          </View>
          <Text style={[styles.title, { position: 'absolute', right: 20, bottom: 10 }]}>{"Q:" + item.quantity}</Text>
          <Text style={[styles.title, { position: 'absolute', right: 20, bottom: 30 }]}>{"B:" + item.barcode}</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 20,
    height: 100,
    backgroundColor: "white",
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    marginBottom: 20,
  },
  title: {
    color:"black",
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    marginTop: 20,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 10,
    alignSelf: 'center',
  },
});