import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddPostScreen from '../screens/AddPostScreen'
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import HomeScreenStackNav from './HomeScreenStackNav';
import ExploreScreenStackNav from './ExploreScreenStackNav';
import ProfileScreenStackNav from './ProfileScreenStackNav';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabel: ({ focused }) => (
          <Text
            style={{
              color: focused ? '#7B2CBF' : '#7B2CBF80',
              fontSize: 14,
              marginBottom: 3,
            }}
          >
            {route.name}
          </Text>
        ),
        tabBarIcon: ({ focused }) => {
          let iconName;

          // Define el nombre del ícono basado en la ruta
          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Explorar') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Publicar') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={22}
              color={focused ? '#7B2CBF' : '#7B2CBF80'}
            />
          );
        },
        tabBarActiveTintColor: '#7B2CBF',
        tabBarInactiveTintColor: '#7B2CBF80',
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreenStackNav} />
      <Tab.Screen name="Explorar" component={ExploreScreenStackNav} />
      <Tab.Screen name="Publicar" component={AddPostScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreenStackNav} />
    </Tab.Navigator>
  );
}
