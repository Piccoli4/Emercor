import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ItemListScreen from '../screens/ItemListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import { colors } from '../global/colors';

const Stack = createStackNavigator();

const HomeScreenStackNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false, headerBackTitleVisible: false,}}
      />
      <Stack.Screen 
        name="ItemList" 
        component={ItemListScreen} 
        options={({ route }) => ({ title: route.params.category,
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
        })}
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

export default HomeScreenStackNav