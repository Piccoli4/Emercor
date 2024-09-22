import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const WelcomeScreen = () => {

    const navigation = useNavigation()

  return (
    <View style={styles.container}>
        <View style={styles.imageContainer}>
            <Image 
                source={require('../../assets/img/welcome.jpg')}
                style={{width: '100vw', height: 400}}
            />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.title}>Emercor</Text>
            <Text style={styles.subTitle}>Compra y vende al instante.</Text>
            <Text style={styles.description}>
                Emercor es tu mercado digital para transformar lo que ya no usas en oportunidades. 
                {"\n"}
                Compra, vende y conecta con personas como tú, que buscan darle una nueva vida a lo que ya tienen.
            </Text>
            <Pressable style={styles.buttonContainer} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Comenzar</Text>
            </Pressable>
        </View>
    </View>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageContainer: {
        flex: 1,
        maxHeight: 600
    },
    textContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: -45
    },
    title: {
        fontSize: 35,
        fontWeight: '800',
        color: '#7B2CBF',
        textShadowColor: '#000',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1
    },
    subTitle: {
        fontSize: 22,
        fontWeight: '500',
        color: '#000',
        textShadowColor: '#7B2CBF',
        textShadowOffset: {width: 0.6, height: 0.6},
        textShadowRadius: 0.8
    },
    description: {
        marginTop: 20,
        marginHorizontal: 12,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'justify'
    },
    buttonContainer: {
        marginTop: 80,
        padding: 15,
        borderRadius: 50,
        width: '70%',
        backgroundColor: '#7B2CBF',
        alignItems: 'center'

    },
    buttonText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFF',
        textShadowColor: '#000',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 0.9
    }
})