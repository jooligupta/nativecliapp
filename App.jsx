import { Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './android/src/redux/store';
// import HomeScreen from './android/src/components/screens/HomeScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Signin from './android/src/components/screens/signin/Signin'
import Signup from './android/src/components/screens/signup/Signup'
const App = () => {
  const Stack = createNativeStackNavigator();
  useEffect(() => {
    if (Platform.OS === 'android')
      SplashScreen.hide();
  }, [])
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Signin">
          {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
          <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
export default App

const styles = StyleSheet.create({})