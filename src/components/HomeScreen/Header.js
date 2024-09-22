import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserQuery } from '../../services/user';
import Loading from '../Loading'
import { Ionicons } from '@expo/vector-icons'
import { deleteSession } from '../../db';
import { clearUser } from '../../features/auth/authSlice';

const Header = () => {

  const localId = useSelector(state => state.auth.localId);
  const { data: user, isLoading, isError } = useGetUserQuery(localId);
  const dispatch = useDispatch()

  const handleLogout = async () => {
    await deleteSession()
    dispatch(clearUser())
  }
  

  if (isLoading) return <Loading/>
  if (isError) return <Text style={{marginTop: 40}}>Error al cargar datos de usuario</Text>

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={user?.image ? {uri:user.image} : require('../../../assets/img/defaultUser.png')} 
            style={styles.profileImage}
            resizeMode='cover'
          />
        </View>
        <View>
          <Text style={styles.welcomeText}>Hola,</Text>
          <Text style={styles.nameText}>{user?.name} {user?.lastName}</Text>
        </View>
      </View>
      <Pressable style={styles.logout} onPress={handleLogout}>
        <Ionicons name='log-out-outline' size={40} color='#7B2CBF'/>
      </Pressable>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'flex-start',
    marginTop: 40
  },
  profileImageContainer: {
    width: 55,
    height: 55,
    borderRadius: 30,
    overflow: 'hidden',
    borderColor: '#000',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10
  },
  profileImage: {
    width: '100%',
    height: '100%'
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500'
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600'
  },
  logout: {
    marginRight: 20,
    marginTop: 50,
    alignItems: 'center'
  },
  logoutText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -5
  }
});
