import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Modal,
  Platform,
  Animated
} from 'react-native';
import { styles } from './styles/Home_style';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';

// Import modular components
import GoalHeader from '../assets/components/goal/GoalHeader';
import GoalList from '../assets/components/goal/GoalList';
import FloatingButtons from '../assets/components/goal/FloatingButtons';
import NewGoalModal from '../assets/components/goal/NewGoalModal';
import EmptyState from '../assets/components/goal/EmptyState';

// Other tab screens
const StatsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <GoalHeader 
          title="Statistics" 
          subtitle="Track your progress" 
          showToggle={false} 
        />
        <EmptyState 
          message="Your goal statistics will appear here" 
          buttonText="Go to Goals"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </SafeAreaView>
  );
};

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <GoalHeader 
          title="Profile" 
          subtitle="Your settings and info" 
          showToggle={false} 
        />
        <EmptyState 
          message="Your profile details will appear here" 
          buttonText="Go to Goals"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </SafeAreaView>
  );
};

// Main Home Screen
const HomeScreen = () => {
  // State management
  const [ongoingGoals, setOngoingGoals] = useState([]);
  
  const [finishedGoals, setFinishedGoals] = useState([]);

  const [activeView, setActiveView] = useState('ongoing');
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const goalAnimations = useRef({ ongoing: [], finished: [] }).current;

  // Update newest goal status
  useEffect(() => {
    if (ongoingGoals.length === 0) return;
    
    setOngoingGoals(prev => prev.map((goal, index) => {
      if (index === prev.length - 1) return { ...goal, status: 'new' };
      if (goal.status === 'new' && index !== prev.length - 1) return { ...goal, status: 'conquering' };
      return goal;
    }));
  }, [ongoingGoals.length]);

  // Initialize animations
  useEffect(() => {
    // Initialize ongoing goal animations
    ongoingGoals.forEach((_, index) => {
      if (!goalAnimations.ongoing[index]) {
        goalAnimations.ongoing[index] = new Animated.Value(0);
      }
      Animated.timing(goalAnimations.ongoing[index], {
          toValue: 1,
          duration: 500 + index * 100,
          useNativeDriver: true,
        }).start();
      }
    );

    // Initialize finished goal animations
    finishedGoals.forEach((_, index) => {
      if (!goalAnimations.finished[index]) {
        goalAnimations.finished[index] = new Animated.Value(0);
        Animated.timing(goalAnimations.finished[index], {
          toValue: 1,
          duration: 500 + index * 100,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [ongoingGoals, finishedGoals]);

  // Handlers passed as props to components
  const handleAddGoal = () => {
    setShowNewGoalModal(true);
    setSelectedDate(new Date());
  };

  const removeOngoingGoal = (goalId) => {
    setOngoingGoals(ongoingGoals.filter(goal => goal.id !== goalId)); 
  };

  const removeFinishedGoal = (goalId) => {
    setFinishedGoals(finishedGoals.filter(goal => goal.id !== goalId)); 
  };

  const markAsFinished = (goalId) => {
    const goalToFinish = ongoingGoals.find(goal => goal.id === goalId);
    if (!goalToFinish) return;

    setOngoingGoals(ongoingGoals.filter(goal => goal.id !== goalId));
    setFinishedGoals([...finishedGoals, {
      ...goalToFinish,
      status: 'finished',
      finishedDate: new Date()
    }]);
  };

  const markAsOngoing = (goalId) => {
    const goalToReactivate = finishedGoals.find(goal => goal.id === goalId);
    if (!goalToReactivate) return;

    setFinishedGoals(finishedGoals.filter(goal => goal.id !== goalId));
    setOngoingGoals([...ongoingGoals, {
      ...goalToReactivate,
      status: 'conquering',
      finishedDate: null
    }]);
  };

  const addNewGoalWithDate = () => {
    if (newGoalTitle.trim() === '') return;
    
    const newGoal = {
      id: Date.now(),
      title: newGoalTitle,
      description: newGoalDescription,
      status: "new",
      updates: 0,
      targetDate: selectedDate,
      startDate: new Date()
    };
    
    setOngoingGoals([...ongoingGoals, newGoal]);
    setShowNewGoalModal(false);
    setNewGoalTitle('');
    setNewGoalDescription('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <ScrollView style={styles.scrolling} contentContainerStyle={styles.scrollContent}>
          <GoalHeader 
            title="Goals" 
            subtitle={activeView === 'ongoing' ? 'Track your progress' : 'Celebrate achievements'}
            activeView={activeView}
            setActiveView={setActiveView}
            showToggle={true}
          />

          {activeView === 'ongoing' ? (
            ongoingGoals.length === 0 ? (
              <EmptyState 
                message="No ongoing goals yet! , Click the button below to add your goal!" 
                color='white'
                
              />
            ) : (
              <GoalList 
                goals={ongoingGoals}
                animations={goalAnimations.ongoing}
                type="ongoing"
                onRemove={removeOngoingGoal}
                onStatusChange={markAsFinished}
              />
            )
          ) : (
            finishedGoals.length === 0 ? (
              <EmptyState 
                message="No finished goals yet!" 
                buttonText="View Ongoing Goals"
                onPress={() => setActiveView('ongoing')}
              />
            ) : (
              <GoalList 
                goals={finishedGoals}
                animations={goalAnimations.finished}
                type="finished"
                onRemove={removeFinishedGoal}
                onStatusChange={markAsOngoing}
              />
            )
          )}
        </ScrollView>
      </View>

      {activeView === 'ongoing' && (
        <FloatingButtons 
          onAdd={handleAddGoal}
          onRemove={ongoingGoals.length > 0 ? () => removeOngoingGoal(ongoingGoals[ongoingGoals.length - 1].id) : null}
          disabled={ongoingGoals.length === 0}
        />
      )}

      <NewGoalModal 
        visible={showNewGoalModal}
        onClose={() => setShowNewGoalModal(false)}
        title={newGoalTitle}
        setTitle={setNewGoalTitle}
        description={newGoalDescription}
        setDescription={setNewGoalDescription}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        onConfirm={addNewGoalWithDate}
      />
    </SafeAreaView>
  );
};

const Tab = createBottomTabNavigator();
// Main App component with tab navigation
export default function App() {
  return (
   
    <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#1F2937',
            borderTopColor: '#374151',
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
          name="Stats" 
          component={StatsScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="bar-chart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" size={size} color={color} />
            ),
          }}
        />
    </Tab.Navigator>
    
  );
}
