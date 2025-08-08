import {
    SafeAreaView,
    Modal,
    TouchableOpacity,
    View,
    Text,
    Button,
    StyleSheet,
    Animated,
    Easing,
    Alert,
    Image
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Log_style from './styles/Log_style'
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { FontAwesome } from '@expo/vector-icons'
import { Dimensions } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles/Main_style';

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


    const handlesignup = async () => {
        try {
            const response = await fetch(`${api}/api/signup`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                username: username
            })
            });

            const data = await response.json();
            if (!data.errors){
                console.log('Signup response:', data);
            }
            else{
                addAlert('Invalid Registration, Please make sure you fulfill the registration requirement!')
            }

            if (data.token) {
                try {
                    await AsyncStorage.setItem('auth_token', data.token);
                    const profile = await fetch(`${api}/api/profile` , {
                        method: 'GET',
                        headers: {
                           'Authorization': `Bearer ${data.token}`,
                           'Content-Type': 'application/json'
                        }
                    })
                    const user = profile.json()
                    GoHome([user.username]);
                }catch(error){
                    console.log('Failed to fetch the profile', error)
                }
            } else {
                setError(data.error || 'No token received');
            }
        } catch (error) {
            setError('Network error occurred');
        }
    };

    const addAlert = (msg) => {
        Alert.alert('Error', msg ,[
            {
                text : 'OK',
                onPress: () => console.log('OK button Pressed !') 
            }
            
        ])
    }

    const handlesignin= async () => {
        try {
            const log_response = await fetch(`${api}/api/signin`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                logID : logID,
                password: logPassword
            })
            });

            const data = await log_response.json();
            if (data.message){
                console.log('error:', data.message)
            }
            console.log('Sign In response:', data);

            if (data.token) {
                try {
                    await AsyncStorage.setItem('auth_token', data.token);
                    const log_user = await fetch(`${api}/api/profile` , {
                        method: 'GET',
                        headers: {
                           'Authorization': `Bearer ${data.token}`,
                           'Content-Type': 'application/json'
                        }
                    })
                    const logUser = log_user.json()
                    GoHome([logUser.username]);
                }catch(error){
                    console.log('Failed to fetch the profile', error)
                }
            } else {
                setError(data.error || 'No token received');
            }
        } catch (error) {
            setError('Network error occurred');
        }
    };

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

                                        <TouchableOpacity>
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