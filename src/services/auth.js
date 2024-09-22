import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_AUTH, URL_AUTH } from '../firebase/firebaseAuthentication'

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: URL_AUTH }),
    endpoints: (builder) => ({
      loginUser: builder.mutation({
        query: ({ ...user }) => ({
          url: `accounts:signInWithPassword?key=${API_AUTH}`,
          method: 'POST',
          body: user
        }),
      }),
      signUpUser: builder.mutation({
        query: ({ ...user }) => ({
          url: `accounts:signUp?key=${API_AUTH}`, 
          method: 'POST',
          body: user
        }),
      }),
    }),
  });
  
  export const { useLoginUserMutation, useSignUpUserMutation } = authApi;