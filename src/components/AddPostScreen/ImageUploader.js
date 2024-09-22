import { useState } from 'react';
import { TouchableOpacity, Image, Alert, View, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImageUploader = ({ onImagePicked }) => {

    const [selectedImage, setSelectedImage] = useState(null);

    // Solicita permisos de galería o cámara
    const requestPermission = async (permissionType) => {
        let status;
        if (permissionType === 'gallery') {
            const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            status = galleryStatus;
        } else if (permissionType === 'camera') {
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
            status = cameraStatus;
        }

        if (status !== 'granted') {
            Alert.alert('Permisos denegados', 'Lo siento, necesitamos permisos para acceder a esta funcionalidad.');
            return false;
        }
        return true;
    };

    // Abre la galería y permite seleccionar una imagen
    const pickImage = async () => {
        const hasPermission = await requestPermission('gallery');
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            const { uri } = result.assets[0];
            setSelectedImage(uri);
            onImagePicked(uri);
        }
    };

    // Captura una imagen con la cámara
    const takePhoto = async () => {
        const hasPermission = await requestPermission('camera');
        if (!hasPermission) return;

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            const { uri } = result.assets[0];
            setSelectedImage(uri);
            onImagePicked(uri);
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={selectedImage ? { uri: selectedImage } : require('../../../assets/img/placeholder-image.jpg')}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.imageButtonsContainer}>
                <TouchableOpacity onPress={takePhoto} style={styles.button}>
                    <Text style={styles.buttonText}>Tomar una foto</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={pickImage} style={styles.button}>
                    <Text style={styles.buttonText}>Ver galería</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default ImageUploader;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 15,
    },
    imageButtonsContainer: {
        justifyContent: 'center',
        marginLeft: 10,
        gap: 15
    },
    button: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#7B2CBF',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFF',
        textShadowColor: '#000',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 0.9
    }
})