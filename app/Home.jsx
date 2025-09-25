import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import GoalScreen from './Goal';
import MenuScreen from './Menu';
import GoalStatistics from './Stats';

const api = 'http://192.168.5.4:3000'

export const HomeScreen = () => {
  const navigation = useNavigation();
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);
  const [username, setUsername] = useState(''); // Moved state inside component

  const notifications = [
    { id: 1, title: "New study reminder", message: "Math test tomorrow at 9 AM" },
    { id: 2, title: "Trip approaching", message: "Your Paris trip is in 3 days" },
    { id: 3, title: "Task completed", message: "Grocery shopping marked as done" }
  ];

  

  const post_username = (user) => {
    setUsername(user);
  };

  const get_user = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        console.log('Failed to extract token');
        return;
      }
      
      console.log('Extracted token successfully');
      const response = await fetch(`${api}/api/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const user_get = await response.json();
      post_username(user_get.username);
      await AsyncStorage.setItem('un', user_get.username)
      await AsyncStorage.setItem('em', user_get.email)
      console.log('Username:', username);
      console.log('User data:', user_get);
    } catch (error) {
      console.log('Home screen failed to request username', error);
    }
  };

  // Use useEffect to call async function once on mount
  useEffect(() => {
    get_user();

  }, []
);



  return (
    <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: 'white' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back! {username}</Text>
        </View>

        {/* Notification Bar */}
        <TouchableOpacity
          style={styles.notificationBar}
          onPress={() => setNotificationsExpanded(!notificationsExpanded)}
        >
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>Notifications</Text>
            <FontAwesome 
              name={notificationsExpanded ? "chevron-up" : "chevron-down"} 
              size={18} 
              color="#333" 
            />
          </View>

          {notificationsExpanded && (
            <View style={styles.notificationsList}>
              {notifications.map(notification => (
                <View key={notification.id} style={styles.notificationItem}>
                  <Text style={styles.notificationItemTitle}>{notification.title}</Text>
                  <Text style={styles.notificationItemMessage}>{notification.message}</Text>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>

        {/* Paired Cards Section */}
        <View style={styles.cardsContainer}>
          {/* First pair */}
          <View style={styles.cardPair}>
            {/* Study Area Card */}
            <TouchableOpacity style={styles.card} onPress={()=>navigation.navigate('Study')}>
              <View style={[styles.cardIconContainer, { backgroundColor: '#EBF4FF' }]}>
                <FontAwesome name="book" size={24} color="#4A6CF7" />
              </View>
              <Text style={styles.cardTitle}>Study Area</Text>
              <Text style={styles.cardSubtitle}>Organize your learning</Text>
              <FontAwesome name="arrow-right" size={16} color="#666" style={styles.cardArrow} />
            </TouchableOpacity>

            {/* Trip Planning Card */}
            <TouchableOpacity style={styles.card}>
              <View style={[styles.cardIconContainer, { backgroundColor: '#E6F4EA' }]}>
                <FontAwesome name="plane" size={24} color="#36B37E" />
              </View>
              <Text style={styles.cardTitle}>Trip Planning</Text>
              <Text style={styles.cardSubtitle}>Plan your next adventure</Text>
              <FontAwesome name="arrow-right" size={16} color="#666" style={styles.cardArrow} />
            </TouchableOpacity>
          </View>

          {/* Second pair */}
          <View style={styles.cardPair}>
            {/* To Do List Card */}
            <TouchableOpacity style={styles.card} onPress={()=> navigation.navigate('Task')}>
              <View style={[styles.cardIconContainer, { backgroundColor: '#FFEBE6' }]}>
                <FontAwesome name="list" size={24} color="#FF5630" />
              </View>
              <Text style={styles.cardTitle}>To Do List</Text>
              <Text style={styles.cardSubtitle}>Manage your tasks</Text>
              <FontAwesome name="arrow-right" size={16} color="#666" style={styles.cardArrow} />
            </TouchableOpacity>

            {/* Reminders Card */}
            <TouchableOpacity style={styles.card}>
              <View style={[styles.cardIconContainer, { backgroundColor: '#FFF8E6' }]}>
                <FontAwesome name="bell" size={24} color="#FFAB00" />
              </View>
              <Text style={styles.cardTitle}>Reminders</Text>
              <Text style={styles.cardSubtitle}>Never miss a thing</Text>
              <FontAwesome name="arrow-right" size={16} color="#666" style={styles.cardArrow} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const globalStyles = StyleSheet.create({
  safeArea: {
    // Add your global safe area styles here
    flex: 1,
  }
});

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
  },
  
  // Header
  header: {
    marginBottom: 25,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  
  // Notifications
  notificationBar: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
    shadowColor: '#00000010',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  notificationsList: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 15,
  },
  notificationItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  notificationItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  notificationItemMessage: {
    fontSize: 14,
    color: '#666',
  },
  
  // Cards layout
  cardsContainer: {
    gap: 15,
  },
  cardPair: {
    flexDirection: 'row',
    gap: 15,
  },
  card: {
    flex: 1, // Equal width for paired cards
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#00000015',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 15,
  },
  cardArrow: {
    alignSelf: 'flex-end',
  },
});




const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#ffffffff',
            borderTopColor: '#333333ff',
            paddingBottom: Platform.OS === 'ios' ? 15 : 5,
            paddingTop: Platform.OS === 'ios' ? 15 : 5,
          },
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#9CA3AF',
          headerShown: false
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Goal" 
          component={GoalScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="bullseye" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Stats" 
          component={GoalStatistics} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="bar-chart" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen 
          name="More" 
          component={MenuScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="list" size={size} color={color} />
            ),
          }}
        />



    </Tab.Navigator>
  );
}

