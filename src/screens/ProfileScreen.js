import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import mypublications from '../../assets/img/mypublications.png';
import MyDirections from '../../assets/img/mydirections.png';
import logout from '../../assets/img/logout.png';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useGetUserQuery } from '../services/user';
import Loading from '../components/Loading'
import { useNavigation } from '@react-navigation/native';
import { deleteSession } from '../db';
import { clearUser } from '../features/auth/authSlice';

const ProfileScreen = () => {

  const navigation = useNavigation()
  const localId = useSelector(state => state.auth.localId);
  const email = useSelector(state => state.auth.email);

  const { data, isSuccess, isLoading, isError } = useGetUserQuery(localId);

  // Estado local para manejar los datos del usuario
  const [userData, setUserData] = useState({ image: '', name: '', lastName: '', email: '' });

  // Desestructuración de datos del estado local
  const { image, name, lastName } = userData;

  // Efecto para actualizar los datos del usuario cuando se obtienen desde la base de datos
  useEffect(() => {
    if (isSuccess && data) {
      setUserData({
        image: data.image || '',
        name: data.name || '',
        lastName: data.lastName || '',
        email: email // El email se obtiene de Redux
      });
    }
  }, [data, isSuccess, email]);

  if (isLoading) return <Loading/>
  if (isError) return <Text style={{marginTop: 40}}>Error al cargar datos</Text>

  const menuList = [
    {
      id: 1,
      name: 'Mis Publicaciones',
      icon: mypublications,
      path: 'MyPublications'
    },
    {
      id: 2,
      name: 'Mis Direcciones',
      icon: MyDirections,
      path: 'MyDirections'
    },
    {
      id: 3,
      name: 'Cerrar Sesión',
      icon: logout
    }
  ];

  const dispatch = useDispatch()

  const handleMenuPress = (item) => {
    if(item.name == 'Cerrar Sesión') {
      deleteSession()
    dispatch(clearUser())
    }
    item?.path?navigation.navigate(item.path):null;
  }

  // Función para renderizar cada ítem del menú
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress(item)}>
      <Image
        source={item.icon}
        style={[
          styles.menuIcon,
          item.name === 'Mis Direcciones' && styles.largeIcon
        ]}
      />
      <Text style={styles.menuText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Image
          source={image ? { uri: image } : require('../../assets/img/defaultUser.png')}
          style={styles.userImage}
        />
        <Text style={styles.userName}>{name} {lastName}</Text>
        <Text style={styles.userEmail}>{email}</Text>
      </View>

      <FlatList
        data={menuList}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.flatListContainer}
      />

    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  userInfoContainer: {
    marginTop: 60,
    alignItems: 'center',
    gap: 5
  },
  userImage: {
    marginTop: 20,
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderColor: '#7B2CBF',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  userName: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  userEmail: {
    fontSize: 18
  },
  flatListContainer: {
    marginVertical: 35,
    marginHorizontal: 10
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#7B2CBF',
    padding: 10,
    gap: 3,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#7B2CBF25'
  },
  menuIcon: {
    width: 35,
    height: 35
  },
  largeIcon: {
    width: 40, 
    height: 40,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center'
  }
});
