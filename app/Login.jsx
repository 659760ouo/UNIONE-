import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, redirectUri } from "./service/firebase";
// Clear browser cache to prevent sign-in issues
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  
  // Configure Google auth request
  const [request, response, promptAsync] = Google.useAuthRequest({
     // From Google Cloud Console
    androidClientId: "337695431184-rslcc762u1fsdhfsfajs8tjjccmq3j50.apps.googleusercontent.com",
    webClientId: "337695431184-ag60ocgirrlnkhe7ndfqlil7u2i4j768.apps.googleusercontent.com", 
    redirectUri: redirectUri,
     // From Google Cloud Console
  });

  
  // Handle Google Sign-In response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleFirebaseSignIn(id_token);
    } else if (response?.type === 'error') {
      Alert.alert("Login Failed", "Could not complete Google sign-in. Please try again.");
      setLoading(false);
    }
  }, [response]);

  // Sign in to Firebase with Google token
  const handleFirebaseSignIn = async (idToken) => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
      // Navigate to home screen on success
      navigation.navigate("Home");
    } catch (error) {
      console.error("Firebase sign-in error:", error);
      Alert.alert("Login Failed", "Could not connect to your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger Google sign-in flow
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      console.error("Google sign-in error:", error);
      Alert.alert("Error", "Could not start sign-in process. Please try again.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GoalTracker</Text>
      
      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={handleGoogleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} color="white" style={styles.icon} />
            <Text style={styles.googleText}>Sign in with Google</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#333"
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4285F4",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center"
  },
  icon: {
    marginRight: 10
  },
  googleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500"
  }
});

export default LoginScreen;
