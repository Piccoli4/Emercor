import { Image, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { colors } from '../global/colors';
import { Ionicons } from '@expo/vector-icons'
import { useGetUserQuery } from '../services/user';
import Loading from '../components/Loading';

const ProductDetailScreen = ({ navigation }) => {

    const route = useRoute();
    const { product } = route.params;
    const { title, description, price } = product;
    const [ isExpanded, setIsExpanded ] = useState(false);
    const { localId } = product; // Extrae el localId del producto
    // Usa el hook para obtener los datos del usuario
    const { data: userData, isLoading: isUserLoading, isError: isUserError } = useGetUserQuery(localId);


    const shareProduct = async () => {
        const content = {
            message: `${title}\n${description}\n$${price}`,
        }

        Share.share(content).then(
            resp => {
                console.log(resp);
            }, (error) => {
                console.log(error);
            }
        )
    }

    const shareButton = () => {
        navigation.setOptions({
            headerRight: () => (
                <Ionicons 
                    name='share-social' 
                    size={24} 
                    color='white'
                    style={styles.shareButtonStyle}
                    onPress={() => shareProduct()}
                />
            )
        })
    }

    useEffect(() => {
        shareButton()
    },[navigation])

    const formatPrice = (price) => {
        return price.toFixed(2) // Asegura siempre 2 decimales
            .replace('.', ',') // Reemplaza el punto decimal con coma
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Añade puntos como separadores de miles
    };

    if (isUserLoading) return <Loading/>;
    if (isUserError) return <Text>Error al cargar los datos del usuario</Text>;

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.detailsContainer}>
            <View style={styles.imageAndCategoryContainer}>
                <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                    resizeMode='cover'
                />
                <Text style={styles.productCategory}>{product.category}</Text>
            </View>
            <Text style={styles.productTitle}>{product.title}</Text>
            <Text style={styles.description}>Descripción</Text>
            <View style={styles.descriptionContainer}>
                <Text
                    style={styles.productDescription}
                    numberOfLines={isExpanded ? undefined : 4}
                >
                    {product.description}
                </Text>
                {product.description.length > 100 && ( // Verifica si la descripción supera 100 caracteres
                    <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                        <Text style={styles.seeMoreText}>
                            {isExpanded ? 'Ver menos' : 'Ver más'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.localityAndPriceContainer}>
                <Text style={styles.productLocality}>{product.locality}</Text>
                {product.price !== undefined ? (
                    <Text style={styles.productPrice}>${formatPrice(product.price)}</Text>
                ) : (
                    <Text style={styles.productPrice}>Precio no disponible</Text>
                )}
            </View>

            {/* Información del usuario que hizo la publicación */}
            <View style={styles.userInfoContainer}>
                <Image 
                    source={userData && userData.image ? { uri: userData.image } : require('../../assets/img/defaultUser.png')}
                    style={styles.userImage}
                />
                <View style={styles.userInfoTextContainer}>
                    <Text style={styles.userName}>
                        {userData ? `${userData.name} ${userData.lastName}` : 'No se encontro nombre y apellido'}
                    </Text>
                    <Text style={styles.userEmail}>
                        {userData && userData.email ? userData.email : 'Email no disponible'}
                    </Text>
                </View>
            </View>

            <TouchableOpacity style={styles.messageButton}>
                <Text style={styles.messageText}>Enviar Mensaje</Text>
            </TouchableOpacity>

        </ScrollView>
    </View>
  )
}

export default ProductDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    detailsContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: 30
    },
    imageAndCategoryContainer: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: colors.violet,
        overflow: 'hidden'
    },
    productImage: {
        width: '100%',
        height: 350
    },
    productCategory: {
        color: '#FFF',
        marginVertical: 10,
        fontSize: 18,
        fontWeight: '700',
        textShadowColor: '#000',
        textShadowOffset: {width: 0.9, height: 0.9},
        textShadowRadius: 1
    },
    productTitle: {
        alignSelf: 'flex-start',
        marginTop: 10,
        marginLeft: 5,
        fontSize: 24,
        fontWeight: '700'
    },
    description: {
        alignSelf: 'flex-start',
        marginTop: 10,
        marginLeft: 5,
        fontSize: 20,
        fontWeight: '500'
    },
    descriptionContainer: {
        alignSelf: 'flex-start',
        marginTop: 3
    },
    productDescription: {
        marginLeft: 5,
        fontSize: 16,
        color: '#333',
        alignSelf: 'flex-start'
    },
    seeMoreText: {
        color: colors.violet,
        fontSize: 15,
        fontWeight: '500',
        marginTop: 3,
        alignSelf: 'flex-end'
    },
    localityAndPriceContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 5
    },
    productLocality: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: '400'
    },
    productPrice: {
        marginRight: 10,
        fontSize: 22,
        fontWeight: '600',
        color: colors.blue,
        textShadowColor: '#000',
        textShadowOffset: {width: 0.6, height: 0.6},
        textShadowRadius: 1
    },
    userInfoContainer: {
        width: '100%',
        marginTop: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        borderWidth: 1,
        borderColor: colors.violet,
        backgroundColor: '#7B2CBF65'
    },
    userImage: {
        width: 55,
        height: 55,
        borderRadius: 30,
        overflow: 'hidden',
        borderColor: '#000',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userInfoTextContainer: {
        marginHorizontal: 5
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    userEmail: {
        fontSize: 14,
        fontWeight: '400'
    },
    messageButton: {
        marginTop: 10,
        width: '90%',
        backgroundColor: colors.violet,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center'
    },
    messageText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
        textShadowColor: '#000',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1.5
    },
    shareButtonStyle: {
        marginRight: 15,
        textShadowColor: '#000',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1.5
    }
})