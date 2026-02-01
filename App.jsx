import { Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
const App = () => {
  useEffect(() => {
    if (Platform.OS === 'android')
      SplashScreen.hide();
  }, [])
  return (
    <View>
      <Text style={{ color: 'red', textAlign: 'center' }}>App</Text>
    </View>
  )
}

export default App

const styles = StyleSheet.create({})