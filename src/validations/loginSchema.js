import { object, string } from 'yup';

export const loginSchema = object({
    password: string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .matches(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
        .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
        .matches(/\d/, 'La contraseña debe contener al menos un número')
        .required('Debe ingresar una contraseña'),
    email: string()
        .email('Ingrese un correo electrónico válido')
        .required('Debe ingresar un correo electrónico'),
});
