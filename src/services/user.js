import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { URL_FIREBASE } from '../firebase/database';
  
// Define un servicio utilizando el baseQuery personalizado para Firebase
export const userApi = createApi({
reducerPath: 'userApi',
baseQuery: fetchBaseQuery({baseUrl: URL_FIREBASE}),
tagTypes: ['postInfo', 'userInfo'],
  endpoints: (builder) => ({
    getUserPost: builder.query({
      query: () => ({
        url: '/userPost.json', 
      }),
      providesTags: ['postInfo']
    }),
    addPost: builder.mutation({
      async queryFn(postData) {
        try {
          const response = await fetch(`${URL_FIREBASE}/userPost.json`, {
            method: 'POST',
            body: JSON.stringify(postData),
          });
          const data = await response.json();
          return { data: data.name }; 
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: ['postInfo']
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/userPost/${postId}.json`,
        method: 'DELETE',
      }),
      invalidatesTags: ['postInfo'],
    }),
    patchImageProfile: builder.mutation({
      async queryFn({ image, localId, name, lastName, email }) {
        try {
          const response = await fetch(`${URL_FIREBASE}/users/${localId}.json`, {
            method: 'PATCH', // Utiliza PATCH para agregar o crear el recurso
            body: JSON.stringify({ image, name, lastName, email }),
          });
          const data = await response.json();
          return { data: { message: 'Perfil actualizado correctamente', ...data } };
        } catch (error) {
          console.error('Error actualizando el perfil:', error);
          return { error: { message: error.message } };
        }
      },
    }),
    getUser: builder.query({
      query: (localId) => `users/${localId}.json`, // Accede al usuario directamente por su ID
      transformResponse: (response) => {
        const locations = response.locations ? Object.entries(response.locations).map(item => ({ id: item[0], ...item[1] })) : [];
        return {
          ...response,
          locations
        }
      },
      providesTags: ['userInfo']
    }),
    postUserLocation: builder.mutation({
      query: ({ localId, userLocation }) => ({
        url: `users/${localId}/locations.json`,
        method: 'POST',
        body: userLocation
      }),
      invalidatesTags: ['userInfo']
    }),
    deleteUserLocation: builder.mutation({
      query: ({ localId, locationId }) => ({
        url: `users/${localId}/locations/${locationId}.json`,
        method: 'DELETE'
      }),
      invalidatesTags: ['userInfo'],
    })
  }),
});

// Exporta hooks para usarlos en componentes funcionales, generados automáticamente basados en los endpoints definidos
export const { 
  useGetUserPostQuery,
  useAddPostMutation,
  useDeletePostMutation,
  usePatchImageProfileMutation,
  useGetUserQuery,
  usePostUserLocationMutation,
  useDeleteUserLocationMutation
} = userApi;