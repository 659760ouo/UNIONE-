import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // Use Expo Router's router
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // Initialize Expo Router

  // Check user state (onboarding + auth) on app start
  useEffect(() => {
    const checkUserState = async () => {
      try {
        const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
        const token = await AsyncStorage.getItem('auth_token');

        // Determine initial route (use Expo Router path names!)
        if (token) {
          router.replace('/Home'); // Navigate to Home
        } else if (hasCompletedOnboarding === 'true') {
          router.replace('/Login'); // Navigate to Login (not "Log")
        } else {
          router.replace('/Onboarding'); // Navigate to Onboarding
        }
      } catch (error) {
        console.error('Startup Error:', error);
        router.replace('/Login');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserState();
  }, [router]);

  // Loading screen
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  // Let Expo Router handle routing via _layout.tsx
  return null;
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