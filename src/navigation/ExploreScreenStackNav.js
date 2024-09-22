import { createStackNavigator } from '@react-navigation/stack'
import ExploreScreen from '../screens/ExploreScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen'
import { colors } from '../global/colors';

const Stack = createStackNavigator();

export default function ExploreScreenStackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Explore-tab" 
        component={ExploreScreen} 
        options={{ headerShown: false, headerBackTitleVisible: false,}}
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
    </Stack.Navigator>
  )
}