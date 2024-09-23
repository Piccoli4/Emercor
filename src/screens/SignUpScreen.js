import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, Pressable, Alert } from 'react-native'
import { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import Checkbox from 'expo-checkbox'
import { useNavigation } from '@react-navigation/native';
import { useSignUpUserMutation } from '../services/auth';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { signUpSchema } from '../validations/signUpSchema';
import * as ImagePicker from 'expo-image-picker'
import { usePatchImageProfileMutation } from '../services/market';
import { setUser } from '../features/auth/authSlice'
import MyAlert from '../components/MyAlert'

const SignUpScreen = () => {

  const insets = useSafeAreaInsets()
  const [ selectedImage, setSelectedImage ] = useState(null);
  const [ triggerAddImageProfile ] = usePatchImageProfileMutation()
  const [ name, setName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ repeatedPassword, setRepeatedPassword ] = useState('')
  const [ isPasswordShown, setIsPasswordShown ] = useState(false)
  const [ isRepeatedPasswordShown, setIsRepeatedPasswordShown ] = useState(false)
  // const [ isChecked, setIsChecked ] = useState(false)
  const [ errors, setErrors ] = useState({})
  const navigation = useNavigation()
  const [ triggerSigUp, { data, isSuccess, isLoading } ] = useSignUpUserMutation()
  const dispatch = useDispatch()
  const [ alertVisible, setAlertVisible ] = useState(false);
  const [ alertMessage, setAlertMessage ] = useState('');


  const pickImage = async () => {
    // Solicitar permisos para acceder a la cámara y a la galería
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
  
    if (status !== 'granted') {
      alert('Se requieren permisos para acceder a la cámara.');
      return;
    }
  
    // Mostrar opciones al usuario
    const options = [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Tomar una foto', onPress: openCamera },
      { text: 'Elegir de la galería', onPress: openGallery }
    ];
  
    // Usar Alert para mostrar opciones
    Alert.alert('Seleccionar Imagen', 'Elige una opción', options);
  };
  
  // Abrir la cámara
  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
      allowsEditing: true
    });
  
    if (!result.canceled) {
      setSelectedImage('data:image/jpeg;base64,' + result.assets[0].base64);
    }
  };
  
  // Abrir la galería
  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
      allowsEditing: true
    });
  
    if (!result.canceled) {
      setSelectedImage("data:image/jpeg;base64," + result.assets[0].base64);
    }
  };


  // Función para manejar el registro del usuario
  const handleSignUp = async () => {
    try {
      signUpSchema.validateSync({ name, lastName, email, password, repeatedPassword });

      // Crea la cuenta de usuario
      const { data } = await triggerSigUp({ email, password });

      // Sube la imagen y los datos del perfil después de la creación del usuario
      if (selectedImage || name || lastName) {
        await triggerAddImageProfile({ 
          image: selectedImage, 
          localId: data.localId,
          email: data.email,
          name, 
          lastName 
        });
      }

      // Dispatch user data to Redux
      dispatch(setUser({
        email: data.email,
        idToken: data.idToken,
        localId: data.localId,
        name,          
        lastName,
        image: selectedImage 
      }));

      // Si es exitoso navega a Home
      navigation.navigate('Home');
    } catch (error) {
      // Si el error es de validación
      if (error.path) {
        setErrors({ [error.path]: error.message });
      } else {
        // Si el usuario ya está registrado
        setAlertMessage('El usuario ya está registrado.');
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
            <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="camera" size={40} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.formInput, styles.capitalizeInput]}
                placeholder='Ingrese su nombre' 
                placeholderTextColor='#99999985'
                value= {name}
                onChangeText={(text) => setName(text)}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.formInput, styles.capitalizeInput]}
                placeholder='Ingrese su apellido' 
                placeholderTextColor='#99999985'
                value={lastName}
                onChangeText={(text) => setLastName(text)}
              />
            </View>
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.formInput}
                placeholder='Ingrese su correo electrónico' 
                placeholderTextColor='#99999985'
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            <View style={[styles.inputContainer, styles.passwordContainer]}>
              <TextInput
                style={styles.formInput}
                placeholder='Ingrese su contraseña'
                placeholderTextColor='#99999985'
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
                          <Ionicons name='eye' size={24} color='#99999985'/>
                      ) : (
                          <Ionicons name='eye-off' size={24} color='#99999985'/>
                      )
                  }
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                  <TextInput
                      style={styles.formInput}
                      placeholder='Repita su contraseña'
                      placeholderTextColor= '#99999985'
                      secureTextEntry= {!isRepeatedPasswordShown}
                      value={repeatedPassword}
                      onChangeText={(text) => setRepeatedPassword(text)}
                  />
                  <TouchableOpacity
                      style={{
                          position: 'absolute',
                          right: 12
                      }}
                      onPress={() => setIsRepeatedPasswordShown(!isRepeatedPasswordShown)}
                  >
                      {
                          isRepeatedPasswordShown == true ? (
                              <Ionicons name='eye' size={24} color='#99999985'/>
                          ) : (
                              <Ionicons name='eye-off' size={24} color='#99999985'/>
                          )
                      }
                  </TouchableOpacity>
              </View>
            </View>
            {errors.repeatedPassword && <Text style={styles.errorText}>{errors.repeatedPassword}</Text>}
            {/* <View style={styles.check}>
              <Checkbox
                  style={{marginRight: 8}}
                  value={isChecked}
                  onValueChange={handleCheckboxChange}
                  color={isChecked ? '#7B2CBF' : undefined}
              />
              <Text style={{color: '#FFF'}}>Acepto los terminos y condiciones</Text>
            </View>
            {errors.checkbox && <Text style={styles.errorText}>{errors.checkbox}</Text>} */}
            <View style={styles.pressableContainer}>
              <Pressable style={styles.buttonContainer} onPress={handleSignUp}>
                  <Text style={styles.buttonText}>Crear Cuenta</Text>
              </Pressable>
            </View>
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Ya tienes cuenta?</Text>
              <Pressable
                  onPress={() => navigation.navigate('Login')}
              >
                  <Text style={styles.loginContainerPressableText}>Ingresar</Text>
              </Pressable>
            </View>
          </View>

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

export default SignUpScreen

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center'
  },
  container: {
    marginTop: 15,
    width: '100%',
    alignItems: 'center'
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
    width: 100,
    height: 100,
    borderRadius: 60,
    overflow: 'hidden',
    borderColor: '#FFF',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
    gap: 10
  },
  inputContainer: {
    width: '85%',
    marginVertical: 3,
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
    fontSize: 18, 
    fontWeight: '600'
  },
  capitalizeInput : {
    textTransform: 'capitalize',
  },
  check: {
    flexDirection: 'row',
    marginVertical: 6
  },
  pressableContainer: {
    alignItems: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    width: 210,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 7,
  },
  buttonText: {
    color: '#7B2CBF',
    fontSize: 20,
    fontWeight: '600',
    textShadowColor: '#000',
    textShadowRadius: 1
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10
  },
  loginText: {
    color: '#FFF',
    fontSize: 18,
  },
  loginContainerPressableText: {
    fontSize: 20,
    color: '#78defa',
    fontWeight: 'bold',
    marginLeft: 10
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