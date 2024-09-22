import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { URL_FIREBASE } from '../firebase/database';
  
// Define un servicio utilizando el baseQuery personalizado para Firebase
export const marketApi = createApi({
reducerPath: 'marketApi',
baseQuery: fetchBaseQuery({baseUrl: URL_FIREBASE}),
tagTypes: ['postInfo', 'userInfo'],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/category.json', 
    }),
    getSliders: builder.query({
      query: () => ({
        url: '/sliders.json'
      }),
    })
  }),
});

// Exporta hooks para usarlos en componentes funcionales, generados automáticamente basados en los endpoints definidos
export const { 
  useGetCategoriesQuery,
  useGetSlidersQuery
} = marketApi;