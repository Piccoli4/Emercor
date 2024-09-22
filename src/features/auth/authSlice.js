import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  localId: '',
  email: '',
  idToken: '',
  name: '',
  lastName: '',
  image: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
        state.localId = action.payload.localId 
        state.email = action.payload.email
        state.idToken = action.payload.idToken
        state.name = action.payload.name
        state.lastName = action.payload.lastName
        state.image = action.payload.image
    },
    clearUser: (state, action) => {
        state.localId = ""
        state.email = ""
        state.idToken = ""
        state.name = ""
        state.lastName = ""
        state.image = ""
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser, clearUser } = authSlice.actions

export default authSlice.reducer