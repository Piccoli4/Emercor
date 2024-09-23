import { 
  ActivityIndicator,
  KeyboardAvoidingView, 
  Platform, 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput,
  View 
} from 'react-native'
import { useState } from 'react'
import DropDown from '../components/AddPostScreen/DropDown';
import Loading from '../components/Loading';
import useProvinces from '../global/hooks/useProvinces';
import { useGetCategoriesQuery } from '../services/market';
import { useAddPostMutation } from '../services/user';
import ImageUploader from '../components/AddPostScreen/ImageUploader';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '../firebase/firebaseConfig';
import Header from '../components/HomeScreen/Header';
import { useSelector } from 'react-redux';


const AddPostScreen = () => {

  const [ imageUrl, setImageUrl ] = useState('');
  const [ focusedInput, setfocusedInput ] = useState(false);
  const [ selectedCategory, setSelectedCategory ] = useState('');
  const [ selectedProvince, setSelectedProvince ] = useState('');
  const [ selectedDepartment, setSelectedDepartment ] = useState('');
  const [ selectedLocality, setSelectedLocality ] = useState('');
  const [ showDepartmentInput, setShowDepartmentInput ] = useState(false);
  const [ showLocalityInput, setShowLocalityInput ] = useState(false);
  const [ title, setTitle ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ price, setPrice ] = useState('');
  const [ address, setAddress ] = useState('');
  const [imageUploaderKey, setImageUploaderKey] = useState(Date.now()); // Clave para reiniciar ImageUploader
  const [dropdownKey, setDropdownKey] = useState(Date.now()); // Clave para reiniciar DropDown
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const localId = useSelector((state) => state.auth.localId);

  // Esta función se llamará cuando la imagen se suba exitosamente
  const handleImageSelected = (url) => {
    setImageUrl(url);
  };

  // Obtiene las categorías
  const {data, error, isLoading} = useGetCategoriesQuery()

  // Ordena las categorías alfabéticamente por el nombre
  const sortedData = data ? [...data].sort((a, b) => a.name.localeCompare(b.name)) : [];

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
  };
  

  // Obtiene las provincias, departamentos y municipios usando el hook personalizado
  const { 
    provinces, 
    departments, 
    localities, 
    loading,
    fetchDepartments, 
    fetchLocalities  
  } = useProvinces();

  // Maneja la selección de provincia
  const handleProvinceChange = (provinceId) => {
    const province = provinces.find(prov => prov.id === provinceId);
    setSelectedProvince({
      id: provinceId,
      name: province ? province.nombre : ""
    });
    setSelectedDepartment('');
    setSelectedLocality('');
    setShowDepartmentInput(false);
    setShowLocalityInput(false);
    
    if (provinceId) {
      fetchDepartments(provinceId);
      setShowDepartmentInput(true);
    }
  };

  // Maneja la selección de departamento
  const handleDepartmentChange = (departmentId) => {
    const department = departments.find(dep => dep.id === departmentId);
    setSelectedDepartment({
      id: departmentId,
      name: department ? department.nombre : ""
    });
    setSelectedLocality('');
    setShowLocalityInput(false);

    if (departmentId) {
      fetchLocalities(departmentId);
      setShowLocalityInput(true);
    }
  };

  // Maneja el cambio de la localidad
  const handleLocalityChange = (localityId) => {
    const locality = localities.find(loc => loc.id === localityId);
    setSelectedLocality({
      id: localityId,
      name: locality ? locality.nombre : ""
    });
  };

  // Hook de la mutación para publicar los productos en la 'collection' de Firestore
  const [ addPost ] = useAddPostMutation();
  

  // Función para manejar la publicación
  const handlePost = async () => {
    if (!title || !description || !price || !address || !selectedCategory || !selectedProvince || !imageUrl) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    setIsSubmitting(true);

    try {

      // Primero sube la imagen a Firebase Storage
      const storage = getStorage(firebaseApp);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const storageRef = ref(storage, `publications/${Date.now()}.jpg`);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Cuando la imagen esta subida, crea postData
      const postData = {
        image: downloadURL,
        title,
        description,
        category: selectedCategory, 
        province: selectedProvince.name, 
        department: selectedDepartment.name,  
        locality: selectedLocality.name, 
        address,
        price: parseFloat(price.replace(',', '.')) || 0, // Reemplaza las comas por puntos y asegura que sea un número.
        createdAt: new Date(), // Agrega la fecha actual
        localId
      };

      await addPost(postData).unwrap(); // Llama a la mutación de redux
      alert('Publicación creada con éxito!');

      // Resetear todos los campos del formulario
      resetFormFields();

    } catch (e) {
      console.error('Error: ', e);
      alert('Error al crear la publicación: ' + e.message); 
    } finally {
      setIsSubmitting(false); 
    }   

  };

  const resetFormFields = () => {
    setImageUploaderKey(Date.now()); // Cambiar la clave para reiniciar ImageUploader
    setTitle('');
    setDescription('');
    setPrice('');
    setAddress('');
    setSelectedCategory('');
    setSelectedProvince(''); 
    setSelectedDepartment('');
    setSelectedLocality('');
    setShowDepartmentInput(false);
    setShowLocalityInput(false);
    setDropdownKey(Date.now()); // Cambiar la clave para reiniciar DropDown
  };

  if (isLoading) return <ActivityIndicator 
                          size="large" 
                          color="#7B2CBF" 
                          style={{marginTop: 50}}
                        />;
  if (error) return <Text>Error: {JSON.stringify(error)}</Text>;

  return (
    <View style={styles.container}>
      <Header/>
      <View style={styles.titleAndSubTitleContainer}>
        <Text style={styles.title}>Agrega una Nueva Publicación</Text>
        <Text style={styles.subTitle}>Crea una nueva publicación y comienza a vender</Text>
      </View>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView 
          contentContainerStyle={{ 
            alignItems: 'center', 
            width: '100%', 
            paddingBottom: 50 
          }}
        >
          <View style={styles.formContainer}>
            <View style={styles.imageContainer}>
              <ImageUploader key={imageUploaderKey} onImagePicked={handleImageSelected} />
            </View>

            <View style={styles.inputsContainer}>
              <TextInput
                style={[styles.input, { borderColor: focusedInput === 'title' ? '#1E3A8A' : '#7B2CBF' }]}
                placeholder='Titulo'
                placeholderTextColor={'#888'}
                value={title}
                onChangeText={setTitle}
                onFocus={() => setfocusedInput('title')} 
                onBlur={() => setfocusedInput(null)}
              />
              <TextInput
                style={[styles.input, styles.multilineText, { borderColor: focusedInput === 'description' ? '#1E3A8A' : '#7B2CBF'}]}
                placeholder='Descripción'
                multiline
                placeholderTextColor={'#888'}
                value={description}
                onChangeText={setDescription}
                onFocus={() => setfocusedInput('description')} 
                onBlur={() => setfocusedInput(null)}
              />
              <TextInput
                style={[styles.input,{ borderColor: focusedInput === 'price' ? '#1E3A8A' : '#7B2CBF' }]}
                placeholder='Precio'
                keyboardType='decimal-pad'
                placeholderTextColor={'#888'}
                value={price}
                onChangeText={(text) => {
                  // Permitir solo números, puntos o comas
                  const formattedText = text.replace(/[^0-9.,]/g, '');
                  setPrice(formattedText);
                }}
                onFocus={() => setfocusedInput('price')} 
                onBlur={() => setfocusedInput(null)}
              />
            </View>

            <DropDown
              key={`category-${dropdownKey}`} // Clave para forzar el reinicio del DropDown
              options={sortedData?.map((category) => ({ label: category.name, value: category.name, key: category.id }))}
              selectedValue={selectedCategory}
              onValueChange={handleCategoryChange}
              placeholder="Seleccione una categoría"
            />

            <DropDown
              key={`province-${dropdownKey}`} // Clave para forzar el reinicio del DropDown
              options={provinces.map((province) => ({ label: province.nombre, value: province.id, key: province.id }))}
              selectedValue={selectedProvince.id}
              onValueChange={handleProvinceChange}
              placeholder="Seleccione una provincia"
            />

            {showDepartmentInput && (
              <DropDown
                options={departments.map((department) => ({ label: department.nombre, value: department.id, key: department.id }))}
                selectedValue={selectedDepartment.id}
                onValueChange={handleDepartmentChange}
                placeholder="Seleccione un departamento"
              />
            )}

            {showLocalityInput && (
              <DropDown
                options={localities.map((locality) => ({ label: locality.nombre, value: locality.id, key: locality.id }))}
                selectedValue={selectedLocality.id}
                onValueChange={handleLocalityChange}
                placeholder="Seleccione una localidad"
              />
            )}

            <View style={styles.inputsContainer}>
              <TextInput
                style={[styles.input,{ borderColor: focusedInput === 'address' ? '#1E3A8A' : '#7B2CBF' }]}
                placeholder='Dirección'
                placeholderTextColor={'#888'}
                value={address}
                onChangeText={setAddress}
                onFocus={() => setfocusedInput('address')} 
                onBlur={() => setfocusedInput(null)}
              />
            </View>

            <Pressable 
              style={styles.addPostButton} 
              onPress={handlePost}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loading />
              ) : (
                <Text style={styles.addPostButtonText}>Publicar</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {loading ? <Loading /> : null}
    </View>
  )
}

export default AddPostScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  titleAndSubTitleContainer: {
    marginTop: 5,
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    color: '#7B2CBF',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 0.9
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '500'
  },
  formContainer: {
    width: '85%',
    alignItems: 'center'
  },
  imageContainer: {
    width: '85%',
    marginTop: 10
  },
  inputsContainer: {
    width: '85%',
    gap: 10,
    marginTop: 10
  },
  input: {
    borderWidth: 1.8,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#000'
  },
  multilineText: {
    minHeight: 120,
    textAlignVertical: Platform.OS === 'android' ? 'center' : 'top',
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    paddingBottom: Platform.OS === 'ios' ? 50 : 10
  },
  addPostButton: {
    marginVertical: 15,
    padding: 10,
    borderRadius: 10,
    width: '85%',
    backgroundColor: '#7B2CBF',
    alignItems: 'center'
  },
  addPostButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 0.9
  }
})