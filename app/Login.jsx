import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    Pressable,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { auth } from './firebase';
import Log_style from './styles/Log_style';

const google = require('../assets/images/google.png')
const fb = require('../assets/images/facebook.png')





const api = 'http://192.168.5.4:3000'

const LogPage = () => {
    const navigation = useNavigation()
    const [ActiveView, SetActiveView] = useState('Login')
    const startpt = useRef(new Animated.Value(0)).current;
    const [email, setEmail] = useState()
    const [password , setPassword] = useState()
    const [username , SetUsername] = useState()
    const [logID , setLogID] = useState()
    const [logPassword, setLogPassword] = useState()
    const [error, setError] = useState()
    const {width, height} = Dimensions.get('window')


    const EXPO_USERNAME = "yrsdaily"; // Replace with your actual username

// Get project slug from app.json (must match exactly)
    const PROJECT_SLUG = "yrsdaily"; // Replace with your actual project slug

// Manually construct the auth.expo.io URI instead of using proxy (convert 192.16... to auth.expo.io)
    const getExpoProxyUri = () => {
    // For development with Expo Go
    if (__DEV__) {
        return `https://auth.expo.io/@${EXPO_USERNAME}/${PROJECT_SLUG}`;
    }
    // For production (optional)
    return makeRedirectUri({
        native: "com.yrsdaily.unione:/oauthredirect",
        });
    }
// Initialize with the explicit URI
    const redirectUri = getExpoProxyUri();
    console.log("Final Redirect URI:", redirectUri);

    // Initialize Google auth request
    const [request, response, promptAsync] = Google.useAuthRequest({
        // Use the WEB client ID from google-services.json (client_type: 3) to match for web redirect uri( not android!!!)
        clientId: "337695431184-ag60ocgirrlnkhe7ndfqlil7u2i4j768.apps.googleusercontent.com",
        iosClientId: "139581308140-imf4dv4bogf4aj945eosqvnett4mp06e.apps.googleusercontent.com",
        webClientId: "337695431184-ag60ocgirrlnkhe7ndfqlil7u2i4j768.apps.googleusercontent.com",
        
        redirectUri: redirectUri,
        // profile: ['profile', 'email'],
    }); 
    console.log("Auth Request:", request);
    console.log("Response:", response);
    // Handle authentication response

    const repsonseUnchange = () => {
        if (response == null){
            console.log("Response unchanged", response);
        }else{ 
            console.log("Response changed", response);
        }
        
    }
    useEffect(() => {
        console.log("Google Sign-In response:", response);
        if (response?.type === "success") {
        
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        // Sign in with Firebase
        signInWithCredential(auth, credential)
            .then((userCredential) => {
            console.log("Successfully signed in:", userCredential.user.displayName);
            GoHome()
            // Handle post-sign-in actions (e.g., navigation)
            })
            .catch((error) => {
            console.error("Sign-in error:", error.message);
            });
        }else if(response?.type === "error"){
            console.error("Sign-in error:", response.error);
        }

    }, [response]);
    console.log('Request object:', request);
    console.log('Response object:', response);
    console.log('Prompt Async function:', promptAsync);


    
    const GoHome = (user) => {
        navigation.navigate('Home')
    }

    useEffect(() => {
        const toValue = ActiveView === 'Login' ? 0 : 1;
        Animated.timing(startpt, {
            toValue,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: false
        }).start();
    }, [ActiveView, startpt]);

    return (
        <SafeAreaView style={[Log_style.container]}>
            {ActiveView === 'Register' &&
                <View style={Log_style.requirements}>
                    <Text style={Log_style.requ_txt}>
                        Username must be 3-20 characters and 
                    </Text>
                    <Text style={Log_style.requ_txt}>
                        might containing letters, numbers, and underscores.
                    </Text>
                    <Text style={Log_style.requ_txt}>
                        Password must be at least 8 characters that 
                    </Text>
                    <Text style={Log_style.requ_txt}>
                        containing a number and atleast 1 uppercase. 
                    </Text>
                </View>
            }

            {/* Removed log_container and pill navigation */}
            
            <View id='enter-field' style={Log_style.enter_field}>
                {ActiveView === 'Login' &&
                    <Text style={Log_style.title}> Welcome Back !</Text>
                }
                
                {ActiveView === 'Register' &&
                    <React.Fragment>
                        <Text style={Log_style.title}> Create Your Account!</Text>
                        <TextInput
                            style={Log_style.log_input}
                            placeholder='Enter your username'
                            placeholderTextColor='black'
                            onChangeText={(txt) => SetUsername(txt)} 
                        ></TextInput>
                        <TextInput
                            style={Log_style.log_input}
                            placeholder='Enter your Email'
                            placeholderTextColor='black'
                            onChangeText={(txt) => setEmail(txt)} 
                        />
                        <TextInput
                            style={Log_style.log_input}
                            placeholder='Enter your password'
                            placeholderTextColor='black'
                            secureTextEntry
                            onChangeText={(txt) => setPassword(txt)} 
                        ></TextInput>
                    </React.Fragment>
                }

                {ActiveView === 'Login' &&
                    <React.Fragment>
                        <TextInput
                            style={Log_style.log_input}
                            placeholder='Enter your username or email'
                            placeholderTextColor='black'
                            onChangeText={(txt) => setLogID(txt)} 
                        />
                        <TextInput
                            style={Log_style.log_input}
                            placeholder='Enter your password'
                            placeholderTextColor='black'
                            secureTextEntry
                            onChangeText={(txt) => setLogPassword(txt)} 
                        />
                    </React.Fragment>
                }

                <View style={Log_style.log_btn}>
                    {ActiveView === 'Login' &&
                        <TouchableOpacity onPress={() => handlesignin()}>
                            
                                <Text id='login/register btn txt' style={Log_style.LR_txt}>Login</Text>
                            
                        </TouchableOpacity>
                    }
                    
                    {ActiveView === 'Register' &&
                        <TouchableOpacity onPress={() => handlesignup()}>
                            <Text id='login/register btn txt' style={Log_style.LR_txt}>Register</Text>
                        </TouchableOpacity>
                    }
                </View>

                {/* Added toggle text under the button */}
                <View style={Log_style.toggleTextContainer}>
                    {ActiveView === 'Login' ? (
                        <React.Fragment>
                            <TouchableOpacity onPress={() => SetActiveView('Register')}>
                                <Text style={Log_style.toggleText}>
                                Don't have an account? Sign Up
                                </Text>

                            </TouchableOpacity>


                            <View style={Log_style.icon_container}>
                                <View style={[Log_style.iconView, , {borderLeftWidth: 3, borderColor: 'black'}]}> 
                                    <Pressable>
                                      
                                        <TouchableOpacity onPress={() => {
                                            console.log("Prompting Google Sign-In...");
                                            promptAsync({redirectUri: redirectUri, showInRecents: true});
                                            repsonseUnchange();
                                        }}>
                                            <Image style={

                                                Log_style.icon} 
                                                source={google} 
                                            >
                                            </Image>
                                        </TouchableOpacity>

                                    </Pressable>
                                </View>
                                
                               <View style={[Log_style.iconView, {borderRightWidth: 3, borderColor: 'black'}]}> 
                                    <Pressable>
                                        <TouchableOpacity>
                                            <Image style={Log_style.icon} source={fb} ></Image>
                                        </TouchableOpacity>

                                    </Pressable>
                                </View>

                            </View>
                        </React.Fragment>


                    ) : (
                        
                            <TouchableOpacity onPress={() => SetActiveView('Login')}>
                                <Text style={Log_style.toggleText}>
                                Already have an account? Sign In
                                </Text>
                            </TouchableOpacity>

                    )}
                </View>

                {ActiveView === 'Login' &&
                    <TouchableOpacity>
                        <Text style={Log_style.key} >
                            Forgot Your Password   <FontAwesome name='key' style={{ fontSize: 18, marginLeft: 30, color: '#a67202'}} />
                        </Text>
                    </TouchableOpacity>
                }
            </View>
        </SafeAreaView>
    )
}



export default LogPage