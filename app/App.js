import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from './OnBoardingScreen';
import HomeScreen from './Home';

const Stack = createStackNavigator();

const StackNavigation = () => (
    <Stack.Navigator initialRouteName='Onboarding' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
);

const App = () => {
    return (
        
        <StackNavigation/>
        
    );
};

export default App;