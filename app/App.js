import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
// Import screens (verify these paths and components exist)
import { NavigationContainer } from '@react-navigation/native';
import * as AuthSession from 'expo-auth-session';
import HomeScreen from './Home';
import LogPage from './Login'; // Must export a valid component
import OnboardingScreen from './OnBoardingScreen';
import StudyArea from './Study';
import TodoList from './Task';
const Stack = createStackNavigator();
const api = 'http://192.168.5.4:3000';
const GOOGLE_CLIENT_ID = '337695431184-ag60ocgirrlnkhe7ndfqlil7u2i4j768.apps.googleusercontent.com';



const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');
const [request, response, promptAsync] = AuthSession.useAuthRequest(
  {
    clientId: GOOGLE_CLIENT_ID, // Critical: Explicitly set this
    scopes: ['openid', 'email', 'profile'],
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }), // Disable proxy for Bare Workflow
  },
  discovery
);

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return true;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    const currentTime = Date.now() / 1000;
    return payload.exp && payload.exp < currentTime;
  } catch (error) {
    console.error('Token check failed:', error);
    return true;
  }
};

const refreshToken = async (tokenInput) => {
  try {
    const response = await fetch(`${api}/api/token_reg`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenInput}`,
        'Content-Type': 'application/json'
      }
    });
    const responseData = await response.json();
    if (response.ok && responseData.token) {
      await AsyncStorage.setItem('auth_token', responseData.token);
      return responseData.token;
    } else {
      await AsyncStorage.removeItem('auth_token');
      return null;
    }
  } catch (error) {
    console.log('Token refresh failed:', error);
    return null;
  }
};

const StackNavigation = () => {
  const [initialRoute, setInitialRoute] = useState('Log');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserState = async () => {
      try {
        const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
        const token = await AsyncStorage.getItem('auth_token');

        console.log('APK Startup - hasCompletedOnboarding:', hasCompletedOnboarding);
        console.log('APK Startup - token exists:', !!token);

        if (token) {
          if (isTokenExpired(token)) {
            console.log('APK: Token expired → Log');
            setInitialRoute('Log');
          } else {
            console.log('APK: Valid token → Home');
            await refreshToken(token);
            setInitialRoute('Home');
          }
        } else if (hasCompletedOnboarding) {
          console.log('APK: No token, onboarding done → Log');
          setInitialRoute('Log');
        } else {
          console.log('APK: First run → Onboarding');
          setInitialRoute('Onboarding');
        }
      } catch (error) {
        console.error('APK Startup Error:', error);
        setInitialRoute('Log');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserState();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  // CRITICAL FIX: Ensure ONLY Stack.Screen components are direct children
  // No extra spaces, comments, or text between Screen components
  return (
    <Stack.Navigator 
      initialRouteName={initialRoute} 
      screenOptions={{ headerShown: false }}
      onUnhandledAction={(action) => {
        if (action.type === 'NAVIGATE' && action.payload.name === 'Log') {
          Alert.alert(
            'Navigation Error',
            'Opening Login screen...',
            [{ text: 'OK', onPress: () => setInitialRoute('Log') }]
          );
        }
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Log" component={LogPage} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Task" component={TodoList} />
      <Stack.Screen name="Study" component={StudyArea} />
    </Stack.Navigator>
  );
};

const App = () => {

  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  )
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default App;
