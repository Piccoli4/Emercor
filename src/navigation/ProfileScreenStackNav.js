import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../screens/ProfileScreen'
import MyPublicationsScreen from '../screens/MyPublicationsScreen'
import ProductDetailScreen from '../screens/ProductDetailScreen'
import MyDirectionsScreen from '../screens/MyDirectionsScreen'
import { colors } from '../global/colors'
import LocationSelector from '../components/ProfileScreen/LocationSelector'

const Stack = createStackNavigator()

const ProfileScreenStackNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Profile-Tab' component={ProfileScreen} options={{headerShown: false}}/>
      <Stack.Screen 
        name='MyPublications' 
        component={MyPublicationsScreen}
        options={{
            headerTitle: 'Mis Publicaciones',
            headerStyle: {
              backgroundColor: colors.violet
            },
            headerTintColor: '#FFF',
            headerTitleStyle: {
              fontWeight: '600',
              textShadowColor: '#000',
              textShadowOffset: {width: 1, height: 1},
              textShadowRadius: 0.9 
            },
            headerBackTitleVisible: false,
          }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{
          headerTitle: 'Detalle del Producto',
          headerStyle: {
            backgroundColor: colors.violet
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: '600',
            textShadowColor: '#000',
            textShadowOffset: {width: 1, height: 1},
            textShadowRadius: 0.9 
          },
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name='MyDirections' 
        component={MyDirectionsScreen}
        options={{
            headerTitle: 'Mis Direcciones',
            headerStyle: {
              backgroundColor: colors.violet
            },
            headerTintColor: '#FFF',
            headerTitleStyle: {
              fontWeight: '600',
              textShadowColor: '#000',
              textShadowOffset: {width: 1, height: 1},
              textShadowRadius: 0.9 
            },
            headerBackTitleVisible: false,
          }}
      />
      <Stack.Screen 
        name='LocationSelector' 
        component={LocationSelector}
        options={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: colors.violet
            },
            headerTintColor: '#FFF',
            headerTitleStyle: {
              fontWeight: '600',
              textShadowColor: '#000',
              textShadowOffset: {width: 1, height: 1},
              textShadowRadius: 0.9 
            },
            headerBackTitleVisible: false,
          }}
      />
    </Stack.Navigator>
  )
}

export default ProfileScreenStackNav