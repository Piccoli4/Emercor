import * as yup from 'yup';

export const addPostSchema = yup.object().shape({
    selectedLocality: yup
        .object({
        name: yup.string().required('La localidad es obligatoria.')
        }),
    selectedDepartment: yup
        .object({
        name: yup.string().required('El departamento es obligatorio.')
        }),
    selectedProvince: yup
        .object({
        name: yup.string().required('La provincia es obligatoria.')
        }),
    selectedCategory: yup
        .string()
        .required('La categoría es obligatoria.'),
    price: yup
        .number()
        .required('El precio es obligatorio.')
        .typeError('El precio debe ser un número.'),
    description: yup
        .string()
        .max(180, 'La descripción no puede tener más de 180 caracteres.'),
    title: yup
        .string()
        .required('El título es obligatorio.')
        .matches(/^[A-Za-z0-9 ]+$/, 'El título solo puede contener letras, números y espacios.')
        .min(3, 'El título debe tener al menos 3 caracteres.'),
    imageUrl: yup
        .string()
        .required('La imagen es obligatoria.')
});