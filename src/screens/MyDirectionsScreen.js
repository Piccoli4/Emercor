import { useNavigation } from '@react-navigation/native'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { useDeleteUserLocationMutation, useGetUserQuery } from '../services/user'
import { useSelector } from 'react-redux'
import Loading from '../components/Loading'
import { Ionicons } from '@expo/vector-icons'

const MyDirectionsScreen = () => {

  const navigation = useNavigation()

  const localId = useSelector(state => state.auth.localId)
  const { data: user, isLoading } = useGetUserQuery(localId)
  const [ deleteUserLocation ] = useDeleteUserLocationMutation();

  if (isLoading) return <Loading/> 

  const handleDelete = async (locationId) => {
    try {
      await deleteUserLocation({ localId, locationId });
    } catch (error) {
      console.error('Error al eliminar la dirección:', error);
    }
  };

  return (
    <View style={styles.container}>
      {user.locations && user.locations.length > 0 ? (
        <FlatList
          data={user.locations}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.addressContainer}>
              <Text style={styles.addressText}>{item.address}</Text>
              <Ionicons
                name="trash-outline"
                size={24}
                color="red"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          )}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <View style={styles.noLocationsTextContainer}>
          <Text style={styles.noLocationsText}>No hay direcciones agregadas</Text>
        </View>
      )}
      <Pressable style={styles.addLocationButton} onPress={()=> {navigation.navigate('LocationSelector')}}>
        <Text style={styles.buttonText}>Agregar Dirección</Text>
      </Pressable>
    </View>
  )
}

export default MyDirectionsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  flatListContent: {
    paddingBottom: 50
  },
  addressContainer: {
    width: '90%',
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: '#7B2CBF',
    padding: 20,
    marginVertical: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center'
  },
  addressText: {
    width: '80%'
  },
  noLocationsTextContainer: {
    width: '90%',
    height: 100,
    alignSelf: 'center',
    marginTop: 100,
    borderWidth: 1.5,
    borderColor: '#7B2CBF',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noLocationsText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#7B2CBF',
    textShadowColor: '#000',
    textShadowOffset: {width: 0.9, height: 0.9},
    textShadowRadius: 1
  },
  addLocationButton: {
    width: '65%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#7B2CBF',
    alignItems: 'center',
    marginVertical: 65
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 0.9
  }
})