import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useEffect, useState } from 'react'
import * as Location from 'expo-location'
import MapPreview from './MapPreview'
import { mapStaticApi } from '../../firebase/googleMapAPI'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { usePostUserLocationMutation } from '../../services/user'
import { useSelector } from 'react-redux'

const LocationSelector = () => {

    const navigation = useNavigation()

    const [ location, setLocation ] = useState({
        latitude: '',
        longitude: ''
    })
    
    const [ address, setAddress ] = useState('') // Dirección de la posición geográfica del dispositivo
    const [inputAddress, setInputAddress] = useState(''); // Dirección ingresada por el usuario

    const localId = useSelector(state => state.auth.localId)
    const [ triggerPostUserLocation ] = usePostUserLocationMutation()

    useEffect( () => {
        (
            async () => {
            const {status} = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') return 

            const newLocation = await Location.getCurrentPositionAsync()
            setLocation ({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude
            })
            }
        )()
    },[])
    
    useEffect( () => {
        (
            async () => {
            if(location.latitude) {
                const urlReverseGeocoding = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${mapStaticApi}`

                const response = await fetch(urlReverseGeocoding)
                const data = await response.json()

                setAddress(data.results[0].formatted_address)
            }
            }
        )()
    },[location])

    // Función para convertir la dirección ingresada en coordenadas (Geocoding directo)
    const handleConvertAddress = async () => {
        if (!inputAddress) return;

        try {
            const urlGeocoding = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(inputAddress)}&key=${mapStaticApi}`;
            const response = await fetch(urlGeocoding);
            const data = await response.json();

            if (data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry.location;
                setLocation({
                    latitude: lat,
                    longitude: lng
                });
                setAddress(data.results[0].formatted_address); // Actualizar la dirección mostrada
            } else {
                alert('No se pudo encontrar la dirección.');
            }
        } catch (error) {
        alert('Error al buscar la dirección.');
        }
    };

    const handleConfirmLocation = () => {
        const userLocation = {
            ...location,
            address
        }
        triggerPostUserLocation({ localId, userLocation })

        navigation.navigate('MyDirections')
    }

  return (
    <View style={styles.container}>
        <MapPreview location={location}/>
        <Text style={styles.address}>{address}</Text>
        <View style={styles.searchAddressContainer}>
            <TextInput
                style={styles.input}
                placeholder="Modificar tu dirección"
                value={inputAddress}
                onChangeText={setInputAddress}
            />
            <Pressable onPress={handleConvertAddress}>
                <Ionicons name='search' size={24}/>
            </Pressable>
        </View>
        <Pressable style={styles.confirmButton} onPress={handleConfirmLocation}>
        <Text style={styles.confirmButtonText}>Confirmar Dirección</Text>
      </Pressable>
    </View>
  )
}

export default LocationSelector

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    address: {
        marginTop: 25,
        marginHorizontal: 10,
        fontSize: 20,
        fontWeight: '500'
    },
    searchAddressContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: '#7B2CBF',
        borderRadius: 10,
        borderWidth: 1.8,
        padding: 10,
        paddingHorizontal: 15,
    },
    input: {
        fontSize: 16,
        color: '#000'
    },
    confirmButton: {
        width: '65%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#7B2CBF',
        alignItems: 'center',
        marginTop: 15
    },
    confirmButtonText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFF',
        textShadowColor: '#000',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 0.9
    }
})