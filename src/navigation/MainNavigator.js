import { NavigationContainer } from '@react-navigation/native'
import TabNavigator from './TabNavigator'
import StackNavigator from './StackNavigator'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchSession } from '../db'
import { setUser } from '../features/auth/authSlice'

const MainNavigator = () => {

    const idToken = useSelector(state => state.auth.idToken)
    const dispatch = useDispatch()

    useEffect(() => {
      (
        async () => {
          try {
            const session = await fetchSession();
            if(session?.rows.length) {
              const user = session.rows._array[0]
              dispatch(setUser(user));
            }
          } catch (error) {
            console.log(error);
          }
        }
      )()
    },[])

  return (
    <NavigationContainer>
        {idToken ? <TabNavigator/> : <StackNavigator/>}
    </NavigationContainer>
  )
}

export default MainNavigator