import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Easing,
    Image,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { auth } from './firebase';
import Log_style from './styles/Log_style';

// Clear leftover auth sessions
WebBrowser.maybeCompleteAuthSession();

// Assets
const google = require('../assets/images/google.png');
const fb = require('../assets/images/facebook.png');

const LogPage = () => {
    const navigation = useNavigation();
    const [ActiveView, SetActiveView] = useState('Login');
    const startpt = useRef(new Animated.Value(0)).current;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, SetUsername] = useState('');
    const [logID, setLogID] = useState('');
    const [logPassword, setLogPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [authTimeout, setAuthTimeout] = useState(null);
    const { width, height } = Dimensions.get('window');
    const [isAuth,setIsAuth] = useState(false);

    const [guser, setGuser] = useState({ name: '', email: '', expiry: '' });
    // Configuration - REPLACE THESE VALUES!
    const GITHUB_HTML_URL = "https://659760ouo.github.io/GoogleAuth/google-auth";
    const GOOGLE_CLIENT_ID = "337695431184-dc7665df4vkl4m0dj5vbqmbsu4mc7j87.apps.googleusercontent.com";
    const GOOGLE_CLIENT_SECRET = "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";
    const EXPO_DEV_URL = "exp://192.168.5.4:8081";


    useEffect(() => {
        const getuser = () => {
            console.log(guser)
        }
        getuser()
    }, [guser])

    // Open GitHub HTML page to start Google auth flow
    const openGithubAuthPage = async () => {
        setLoading(true);
        setError('');

        // Clear existing timeout
        if (authTimeout) clearTimeout(authTimeout);

        // Set 30-second timeout for authentication flow
        const newTimeout = setTimeout(() => {
            setError("Authentication timed out. Please try again.");
            setLoading(false);
        }, 30000);
        setAuthTimeout(newTimeout);

        try {
            // Open Google auth URL in browser
            await WebBrowser.openBrowserAsync(
                `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_HTML_URL)}&response_type=code&scope=openid%20profile%20email`
                
            );
            setIsAuth(true);
        } catch (err) {
            setError('Failed to open browser. Please check your settings.');
            setLoading(false);
            clearTimeout(newTimeout);
        }
    };

    // Handle received Google authorization code
    const handleGoogleCode = async (code) => {
        if (!code) return;

        // Clear timeout - we received the code
        if (authTimeout) clearTimeout(authTimeout);

        setLoading(true);
        setError('');
        try {
            // Exchange code for Google ID token
            const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    code: code,
                    client_id: GOOGLE_CLIENT_ID,
                    client_secret: GOOGLE_CLIENT_SECRET,
                    redirect_uri: GITHUB_HTML_URL,
                    grant_type: "authorization_code",
                }).toString(),
            });

            const tokenData = await tokenResponse.json();
            console.log(tokenData)
            if (tokenData.error) {
                throw new Error(`Google error: ${tokenData.error_description || tokenData.error}`);
            }

            if (!tokenData.id_token) {
                throw new Error("No ID token received from Google");
            }

            // Sign in to Firebase with Google credential
            const credential = GoogleAuthProvider.credential(tokenData.id_token);
            const google_user = await signInWithCredential(auth, credential);
            if (!google_user) {
                throw new Error("Firebase sign-in failed");
            }else{
                setGuser({ name: google_user.user.displayName, email: google_user.user.email, expiry: '' });
                console.log('Signed in to firebase successfully',guser)
            }
            
            console.log("Google sign-in successful", credential);

            // Store token and navigate to home
            AsyncStorage.setItem('oauthToken', tokenData.id_token);
            
            navigation.navigate('Home');
        } catch (err) {
            setError(`Sign-in failed: ${err.message}`);
            console.error('Google auth error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Listen for deep links containing authorization code
    useEffect(() => {
        const checkForCode = async () => {
            // Check initial URL when app opens
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl) {
                const parsedUrl = Linking.parse(initialUrl);
                if (parsedUrl.queryParams?.googleCode) {
                    handleGoogleCode(parsedUrl.queryParams.googleCode);
                    console.log("Received code from initial URL:", parsedUrl.queryParams.googleCode);
                }
            }

            // Listen for URL changes while app is open
            const handleUrl = (event) => {
                const parsedUrl = Linking.parse(event.url);
                if (parsedUrl.queryParams?.googleCode) {
                    handleGoogleCode(parsedUrl.queryParams.googleCode);
                    console.log("Received code from URL:", parsedUrl.queryParams.googleCode);
                }
            };

            Linking.addEventListener("url", handleUrl);
            return () => Linking.removeEventListener("url", handleUrl);
        };

        checkForCode();
    }, [isAuth]);

    // Cleanup timeout on component unmount
    useEffect(() => {
        return () => {
            if (authTimeout) clearTimeout(authTimeout);
        };
    }, [authTimeout]);

    // Animation for view transition
    useEffect(() => {
        Animated.timing(startpt, {
            toValue: ActiveView === 'Login' ? 0 : 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: false
        }).start();
    }, [ActiveView]);

    // Email/Password Sign In
    const handlesignin = async () => {
        setLoading(true);
        setError('');
        try {
            if (!logID || !logPassword) throw new Error('Please fill in all fields');
            
            const userCredential = await signInWithEmailAndPassword(auth, logID, logPassword);
            navigation.navigate('Home');
        } catch (err) {
            setError(getFriendlyError(err.code));
            console.error('Sign-in error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Email/Password Sign Up
    const handlesignup = async () => {
        setLoading(true);
        setError('');
        try {
            if (!username || !email || !password) throw new Error('Please fill in all fields');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email format');
            if (password.length < 8) throw new Error('Password must be at least 8 characters');

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await userCredential.user.updateProfile({ displayName: username });
            navigation.navigate('Home');
        } catch (err) {
            setError(getFriendlyError(err.code));
            console.error('Sign-up error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Helper for user-friendly error messages
    const getFriendlyError = (code) => {
        switch (code) {
            case 'auth/invalid-email': return 'Invalid email format';
            case 'auth/user-not-found': return 'No account found with this email';
            case 'auth/wrong-password': return 'Incorrect password';
            case 'auth/email-already-in-use': return 'Email already registered';
            case 'auth/weak-password': return 'Password is too weak';
            default: return 'Authentication failed. Please try again.';
        }
    };

    return (
        <SafeAreaView style={Log_style.container}>
            {error && (
                <View style={Log_style.errorContainer}>
                    <Text style={Log_style.errorText}>{error}</Text>
                </View>
            )}

            {ActiveView === 'Register' && (
                <View style={Log_style.requirements}>
                    <Text style={Log_style.requ_txt}>Username must be 3-20 characters</Text>
                    <Text style={Log_style.requ_txt}>Password must be at least 8 characters</Text>
                    <Text style={Log_style.requ_txt}>with at least one number and uppercase letter</Text>
                </View>
            )}

            <View id='enter-field' style={Log_style.enter_field}>
                {ActiveView === 'Login' && <Text style={Log_style.title}>Welcome Back!</Text>}
                
                {ActiveView === 'Register' && (
                    <>
                        <Text style={Log_style.title}>Create Your Account!</Text>
                        <TextInput 
                            style={Log_style.log_input} 
                            placeholder='Enter your username' 
                            placeholderTextColor='black' 
                            onChangeText={SetUsername} 
                            value={username} 
                        />
                        <TextInput 
                            style={Log_style.log_input} 
                            placeholder='Enter your Email' 
                            placeholderTextColor='black' 
                            onChangeText={setEmail} 
                            value={email} 
                            keyboardType='email-address' 
                        />
                        <TextInput 
                            style={Log_style.log_input} 
                            placeholder='Enter your password' 
                            placeholderTextColor='black' 
                            secureTextEntry 
                            onChangeText={setPassword} 
                            value={password} 
                        />
                    </>
                )}

                {ActiveView === 'Login' && (
                    <>
                        <TextInput 
                            style={Log_style.log_input} 
                            placeholder='Enter your email' 
                            placeholderTextColor='black' 
                            onChangeText={setLogID} 
                            value={logID} 
                            keyboardType='email-address' 
                        />
                        <TextInput 
                            style={Log_style.log_input} 
                            placeholder='Enter your password' 
                            placeholderTextColor='black' 
                            secureTextEntry 
                            onChangeText={setLogPassword} 
                            value={logPassword} 
                        />
                    </>
                )}

                <View style={Log_style.log_btn}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#000" />
                    ) : (
                        <>
                            {ActiveView === 'Login' && (
                                <TouchableOpacity onPress={handlesignin}>
                                    <Text style={Log_style.LR_txt}>Login</Text>
                                </TouchableOpacity>
                            )}
                            {ActiveView === 'Register' && (
                                <TouchableOpacity onPress={handlesignup}>
                                    <Text style={Log_style.LR_txt}>Register</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>

                <View style={Log_style.toggleTextContainer}>
                    {ActiveView === 'Login' ? (
                        <>
                            <TouchableOpacity onPress={() => SetActiveView('Register')}>
                                <Text style={Log_style.toggleText}>Don't have an account? Sign Up</Text>
                            </TouchableOpacity>

                            <View style={Log_style.icon_container}>
                                <View style={[Log_style.iconView, { borderLeftWidth: 3, borderColor: 'black' }]}>
                                    <TouchableOpacity 
                                        onPress={openGithubAuthPage}
                                        disabled={loading}
                                    >
                                        <Image style={Log_style.icon} source={google} />
                                    </TouchableOpacity>
                                </View>
                                <View style={[Log_style.iconView, { borderRightWidth: 3, borderColor: 'black' }]}>
                                    <TouchableOpacity disabled>
                                        <Image style={Log_style.icon} source={fb} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    ) : (
                        <TouchableOpacity onPress={() => SetActiveView('Login')}>
                            <Text style={Log_style.toggleText}>Already have an account? Sign In</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {ActiveView === 'Login' && (
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={Log_style.key}>
                            Forgot Your Password   <FontAwesome name='key' style={{ fontSize: 18, marginLeft: 30, color: '#a67202' }} />
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

export default LogPage;
