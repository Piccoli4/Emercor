import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from '../../global/colors';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'

const PostItem = ({item, hideCategory, isDeletable, onDelete }) => {

    const navigation = useNavigation();

    const formatPrice = (price) => {
        return price.toFixed(2) // Asegura siempre 2 decimales
            .replace('.', ',') // Reemplaza el punto decimal con coma
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Añade puntos como separadores de miles
    };
    

  return (
    <TouchableOpacity 
        style={styles.itemContainer} 
        onPress={() => {
            const { createdAt, ...rest } = item; // Excluye `createdAt` de `item`
            navigation.navigate('ProductDetail', { 
                product: {
                    ...rest // Pasa todos los campos excepto `createdAt`
                } 
            });
        }}
    >
        <View style={styles.itemImageAndCategory}>
            <Image 
                source={{ uri: item.image }} 
                style={styles.itemImage} 
                resizeMode='cover'
            />
            {!hideCategory && (
                <Text style={styles.itemCategoryText}>{item.category}</Text>
            )}
        </View>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemLocality}>{item.locality}</Text>
        {item.price !== undefined ? (
            <Text style={styles.itemPrice}>${formatPrice(item.price)}</Text>
        ) : (
            <Text style={styles.itemPrice}>Precio no disponible</Text>
        )}
        {/* Muestra el icono de eliminación si `isDeletable` es true */}
        {isDeletable && (
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
                <Ionicons name="trash-outline" size={26} color="red" />
            </TouchableOpacity>
        )}
  </TouchableOpacity>
  )
}

export default PostItem

const styles = StyleSheet.create({
    itemContainer: {
        width: '48%',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#7B2CBF',
        borderRadius: 10,
        margin: 5,
        overflow: 'hidden',
        position: 'relative'
    },
    itemImageAndCategory: {
        backgroundColor: '#7B2CBF',
        width: '100%',
        alignItems: 'center',
        borderRadius: 10
    },
    itemImage: {
        width: '100%',
        height: 195,
        marginTop: -3
    },
    itemCategoryText: {
        color: '#FFF',
        marginVertical: 2,
        fontSize: 12,
        fontWeight: '500',
        textShadowColor: '#000',
        textShadowOffset: {width: 0.6, height: 0.6},
        textShadowRadius: 1
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginVertical: 5,
        marginLeft: 5
    },
    itemLocality: {
        fontSize: 14,
        fontWeight: '500',
        alignSelf: 'flex-start',
        marginLeft: 5,
        marginTop: -5
    },
    itemPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginVertical: 5,
        color: colors.blue,
        marginLeft: 5,
        textShadowColor: '#000',
        textShadowOffset: {width: 0.6, height: 0.6},
        textShadowRadius: 1
    },
    deleteButton: {
        position: 'absolute',
        bottom: 5,
        right: 5,
    }
})