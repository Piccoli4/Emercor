import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { useLoginUserMutation } from '../services/auth';
import Loading from '../components/Loading';
import { setUser } from '../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { loginSchema } from '../validations/loginSchema';
import { insertSession } from '../db';
import MyAlert from '../components/MyAlert'

const LoginScreen = () => {

  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const userAvatar = require('../../assets/img/avatar.png');
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ isPasswordShown, setIsPasswordShown ] = useState(false)
  const [ errors, setErrors ] = useState({});
  const [ triggerLogin, { isLoading } ] = useLoginUserMutation();
  const dispatch = useDispatch()

  const [ alertVisible, setAlertVisible ] = useState(false);
  const [ alertMessage, setAlertMessage ] = useState('');


  const handleLogin = async () => {
    try {
      loginSchema.validateSync({email, password})

      const {data} = await triggerLogin({email, password})
      
      await insertSession({
        email: data.email,
        localId: data.localId,
        idToken: data.idToken
      });

      dispatch(setUser({
        email:data.email, 
        localId: data.localId,
        idToken: data.idToken
      }))
    } catch (error) {
      if (error.path) {
        setErrors({ [error.path]: error.message });
      } else {
        setAlertMessage('Email o contraseña incorrectos');
        setAlertVisible(true);
      }
    }
  };

  return (
      <LinearGradient
        colors={['#7B2CBF', '#1E3A8A']}
        style={styles.background}
      >
        {isLoading ? (
          <Loading />
        ) : (
          <View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
            
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Emercor</Text>
            </View>

            <View style={styles.avatarContainer}>
              <Image
                source={userAvatar}
                style={styles.avatar}
                resizeMode="contain" 
              />
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.formInput}
                  placeholder='Ingrese su correo electrónico' 
                  placeholderTextColor='#aaa'
                  value= {email}
                  onChangeText={(text) => setEmail(text)}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              <View style={[styles.inputContainer, styles.passwordContainer]}>
                <TextInput
                  style={styles.formInput}
                  placeholder='Ingrese su contraseña'
                  placeholderTextColor='#aaa'
                  secureTextEntry={!isPasswordShown}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        right: 12
                    }}
                    onPress={() => setIsPasswordShown(!isPasswordShown)}
                >
                    {
                        isPasswordShown == true ? (
                            <Ionicons name='eye' size={24} color='#aaa'/>
                        ) : (
                            <Ionicons name='eye-off' size={24} color='#aaa'/>
                        )
                    }
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <Pressable style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
                <Text style={styles.loginText}>Iniciar Sesión</Text>
            </Pressable>
            <Pressable>
                <Text 
                  style={{color:'#02c2f7', 
                          fontSize: 16,
                          marginVertical: 20
                        }}
                >
                  ¿Olvidaste la contraseña?
                </Text>
            </Pressable>
            <Pressable style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUpButtonText}>Registrarse</Text>
            </Pressable>
          </View>
        )}
        <MyAlert 
          visible={alertVisible} 
          onClose={() => setAlertVisible(false)} 
          message={alertMessage} 
          type="error" 
        />
      </LinearGradient>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center'
  },
  container: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    gap: 15
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center'
  },
  title: {
    marginVertical: 10,
    fontSize: 35,
    fontWeight: '700',
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: {width: 1.5, height: 1.5},
    textShadowRadius: 1
  },
  avatarContainer: {
    marginTop: 20,
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderColor: '#FFF',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 25,
    fontWeight: '500',
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: {width: 0.7, height: 0.7},
    textShadowRadius: 1
  },
  formContainer: {
    marginVertical: 25,
    width: '100%',
    alignItems: 'center',
    gap: 10
  },
  inputContainer: {
    width: '85%',
    marginVertical: 5,
    paddingVertical: 10,
    paddingLeft: 10,
    borderColor: '#FFF',
    borderWidth: 2,
    borderRadius: 10
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  formInput: {
    fontSize: 20,
    fontWeight: '600'
  },
  loginButton: {
    marginVertical: 20,
    padding: 15,
    borderRadius: 10,
    width: '85%',
    backgroundColor: '#7B2CBF',
    alignItems: 'center'
  }, 
  loginText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 0.9
  }, 
  signUpButton: {
    marginVertical: 20,
    width: '85%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10
  },
  signUpButtonText: {
    color: '#7B2CBF',
    fontSize: 22,
    fontWeight: '700',
    textShadowColor: '#000',
    textShadowOffset: {width: 0.8, height: 0.8},
    textShadowRadius: 0.9
  },
  errorText: {
    alignSelf: 'flex-start',
    marginTop: -10,
    marginLeft: 35,
    color: '#f00',
    fontSize: 15,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 0.3, height: 0.3 },
    textShadowRadius: 1
  }
})