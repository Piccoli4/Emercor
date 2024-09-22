import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const CategoryItem = ({ item }) => {

    const navigation = useNavigation();

  return (
    <TouchableOpacity 
        style={styles.categoryContainer} 
        onPress={() => navigation.navigate('ItemList', {category: item.name})}
    >
        <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
        <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  )
}

export default CategoryItem

const styles = StyleSheet.create({
    categoryContainer: {
        backgroundColor: '#7B2CBF25',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#7B2CBF',
        borderRadius: 6,
        padding: 5,
        margin: 5,
        width: 85,
        height: 85
    },
    categoryIcon: {
        width: 35,
        height: 35,
        marginBottom: 5,
    },
    categoryName: {
        fontSize: 14,
        color: '#000',
        fontWeight: '400'
    }
})