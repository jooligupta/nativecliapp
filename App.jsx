import { Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './android/src/redux/store';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCredentials, logout } from './android/src/redux/authSlice';

// Import Auth Screens
import Signin from './android/src/components/screens/signin/Signin'
import Signup from './android/src/components/screens/signup/Signup'
import Forgot from './android/src/components/screens/forgot/Forgot'
import AnimatedSplash from './android/src/components/screens/AnimatedSplash'

// Import Tab Navigators (Alternative to Drawer)
import AdminDrawerNavigator from './android/src/components/screens/navigation/AdminDrawerNavigator'
import UserDrawerNavigator from './android/src/components/screens/navigation/UserDrawerNavigator'

const Stack = createNativeStackNavigator();

// Auth Check Component
function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userString = await AsyncStorage.getItem("user");

      if (token && userString) {
        const user = JSON.parse(userString);
        dispatch(setCredentials({ user, token }));
      }
    } catch (error) {
      console.log("Auth check error:", error);
    } finally {
      setIsLoading(false);
      if (Platform.OS === 'android') {
        SplashScreen.hide();
      }
    }
  };

  if (isLoading) {
    return null;
  }

  return children;
}

// Main Navigator
function MainNavigator() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth Screens
          <>
            <Stack.Screen name="Signin" component={Signin} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Forgot" component={Forgot} />
          </>
        ) : user?.role === 'ADMIN' ? (
          // Admin Dashboard with Tabs
          <Stack.Screen name="AdminDrawerNavigator" component={AdminDrawerNavigator} />
        ) : (
          // User Dashboard with Tabs
          <Stack.Screen name="UserDrawerNavigator" component={UserDrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main App Component
const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <AnimatedSplash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Provider store={store}>
      <AuthInitializer>
        <MainNavigator />
      </AuthInitializer>
    </Provider>
  );
};

export default App;