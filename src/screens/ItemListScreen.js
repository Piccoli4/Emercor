import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useGetUserPostQuery } from '../services/user';
import PostItem from '../components/HomeScreen/PostItem';
import Loading from '../components/Loading'
import { colors } from '../global/colors';
import { useEffect, useState } from 'react';

const ItemListScreen = () => {

    const route = useRoute();
    const { category } = route.params;
    // Obtiene los productos de la categoría seleccionada a través del hook
    const { data: products, error, isSuccess, isLoading } = useGetUserPostQuery();

    const [ productsFiltered, setProductsFiltered ] = useState([])

    useEffect(() => {
        if (isSuccess && products) {
            // Convierte el objeto products a un array
            const productsArray = Array.isArray(products) ? products : Object.values(products);
            // Filtra los productos por categoría
            setProductsFiltered(productsArray.filter(product => product.category === category));
        }
    }, [category, isSuccess, products]);
    

  return (
    <View style={styles.container}>
        {isLoading && <Loading/>}
        {error && <Text>Error al cargar los productos: {error.message}</Text>}

        {!isLoading && !error && productsFiltered?.length === 0 && (
            <View style={styles.noProductsTextContainer}>
                <Text style={styles.noProductsText}>No hay productos en esta categoría.</Text>
            </View>
        )}

        <FlatList 
            data={productsFiltered}
            numColumns={2}
            renderItem={({ item }) => <PostItem item={item} hideCategory={true}/>}
            keyExtractor={(item) => item.id}
        />
    </View>
  )
}

export default ItemListScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    title: {
        marginTop: 10,
        alignSelf: 'center',
        fontSize: 25,
        fontWeight: '800',
        color: '#7B2CBF',
        textShadowColor: '#000',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 0.9
    },
    productItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    productTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    noProductsTextContainer: {
        width: '90%',
        height: 100,
        alignSelf: 'center',
        marginTop: 100,
        borderWidth: 1.5,
        borderColor: colors.violet,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    noProductsText: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.violet,
        textShadowColor: '#000',
        textShadowOffset: {width: 0.9, height: 0.9},
        textShadowRadius: 1
    }
})