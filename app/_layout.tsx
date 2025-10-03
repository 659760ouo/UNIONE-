import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import HomeScreen from './Home';
import LogPage from './Login';
import OnboardingScreen from './OnBoardingScreen';
import StudyArea from './Study';
import TodoList from './Task';

const Stack = createStackNavigator();

const api = 'http://192.168.5.4:3000'

useEffect(() => {
  const checkOauthToken = async () => {
    const token = await AsyncStorage.getItem('oauthToken');
    if (token) {
      console.log('OAuth token found!');
      await AsyncStorage.setItem('auth_token', token);

    }
  };
  checkOauthToken();

}, []);




const isTokenExpired = (token) => {
  if (!token) return true; // Treat empty token as expired

  try {
    // Split JWT into parts (header, payload, signature)
    const base64Url = token.split('.')[1];
    if (!base64Url) return true; // Invalid token format

    // Decode base64url to JSON
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    const currentTime = Date.now() / 1000; // Convert to Unix timestamp (seconds)

    // Check if expiration time exists and is in the past
    return payload.exp && payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true; // Treat invalid tokens as expired
  }
};



const refreshToken = async (token_input) =>{
    try{

        
        const protected_data = await fetch(`${api}/api/token_reg`,{
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${token_input}`,
                'Content-Type': 'application/json'
            }
        })

        res_user = await protected_data.json()
        console.log(res_user)
        await AsyncStorage.setItem('auth-token', res_user.token)
    }catch(error){
        console.log('Something went wrong when requesting to token_reg endpt', error)
    }
}
    
const StackNavigation = () => {
    
    const [initialRouter, setInitialRouter] = useState(null)
    useEffect(() => {
        const checkUserState = async () => {
        try {
        // Check if user has completed onboarding
        const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
        
        // Check for valid auth token
        const token = await AsyncStorage.getItem('auth_token');
        

        if (token) {
            if (isTokenExpired(token)) {
                console.log('Token is expired');
                setInitialRouter('Log'); // Send to login if expired
                
                
            } else {
                console.log('Token is valid');
                setInitialRouter('Home');
                console.log(initialRouter)
                refreshToken(token); // Optional: Refresh token if valid but near expiry
            }
        }
        else if (hasCompletedOnboarding) {

          // No token but completed onboarding - go to login
          console.log('No token received when opening the app')
          setInitialRouter('Log');

        } else {

          // First time user - show onboarding
          setInitialRouter('Onboarding');
        }
        } catch (error) {
        console.error('Error checking user state:', error);
        setInitialRouter('Onboarding'); // Fallback
        }
    };
    checkUserState();
    
  }, []);

  if (initialRouter === null){
    return null
  }
  
  return (
  
    <Stack.Navigator initialRouteName={initialRouter} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Log" component={LogPage} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name='Task' component={TodoList}/>
      <Stack.Screen name='Study' component={StudyArea}/>
      
    </Stack.Navigator>
  
  )
  
};




const App = () => {
    return (
        
        <StackNavigation/>
        
    );
};

export default App;